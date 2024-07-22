'use client'

import { IconContext, PaperPlaneRight, Microphone } from '@phosphor-icons/react' 
import { redirect } from 'next/navigation'
import { FormEventHandler, MouseEventHandler, useEffect, useRef, useState } from 'react'
import wretch from 'wretch'
import { useChatActions, useChoices, useHelpText, useLanguage, useIsVoiceMuted } from './store'
import { Choice, extractPromptAndChoices } from '@/lib/dialog-client'
import { useRecorder } from '@/lib/use-recorder'
import { useLoading } from '@/lib/use-loader'
import { Spinner } from '@/components/spinner'
import { useVoiceToText } from "react-speakup"
import FormDataAddon from 'wretch/addons/formData'
import { Hash, Map } from 'lucide-react'
import voiceIgnores from '../chat/ignore.json'
import synonymsList from '../chat/synonyms.json'
import { json } from 'stream/consumers'
import { comma } from 'postcss/lib/list'
// import { VoiceRecorder }  from '@/app/api/recognition/speechRecognition'

// JOLT Transformation
// [
// 	{
// 	  "operation": "shift",
// 	  "spec": {
// 		"entities": {
// 		  "*": {
// 			"synonyms": {
// 			  "*": {
// 				"@(2,value)": "@1"
// 			  }
// 			}
// 		  }
// 		}
// 	  }
// 	}
// ]

// [
// 	{
// 	  "operation": "shift",
// 	  "spec": {
// 		"entities": {
// 		  "*": {
// 			"value": {
// 			  "@(1,synonyms)": "@1"
// 			}
// 		  }
// 		}
// 	  }
// 	}
// ]

// [
// 	{
// 	  "operation": "shift",
// 	  "spec": {
// 		"entities": {
// 		  "*": {
// 			"synonyms": {
// 			  "*": {
// 				"@(2,synonyms)": "@1"
// 			  }
// 			}
// 		  }
// 		}
// 	  }
// 	}
// ]
  

export function SpeechToText() {
	const [synonyms, setSynonyms]= useState<{[index: string]: Array<string>}>(synonymsList);
	const { startListening, stopListening, transcript } = useVoiceToText({continuous: true})
	// const { startRecording, stopRecording, webkitTranscript, isRecording, recognition} = VoiceRecorder();
	const { setPrompt, setChoices, setHelpText, setVoice } = useChatActions()
	const storedChoices = useChoices()
	const { start, stop, getFile, clearData } = useRecorder()
	const loading = useLoading()
	const form = useRef<HTMLFormElement>(null)
	const input = useRef<HTMLInputElement>(null)
	const helpText = useHelpText()
	const placeHolderTranslate = useLanguage()
	const isVoiceMuted = useIsVoiceMuted()
	var bRecording = false;
	const [stopCommands, setStopCommands] = useState({});
	const [mainTranscript, setMainTranscript] = useState("");

    const [webkitTranscript, setWebkitTranscript] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [recognition, setRecognition] = useState(new webkitSpeechRecognition());
	const [speechRecognitionList, setSpeechRecognitionList] = useState(new webkitSpeechGrammarList());


    useEffect(() => {
        if ('webkitSpeechRecognition' in window) {
			const recognitionInstance = new webkitSpeechRecognition();
			const grammarlistInstance = new webkitSpeechGrammarList();

			recognitionInstance.continuous = false;
			recognitionInstance.interimResults = false;
			recognitionInstance.lang = 'fil-PH';

			recognitionInstance.onstart = () => {
				setIsRecording(true);
				console.log('Voice recognition started. Speak now.');
			};

			recognitionInstance.onresult = (event) => {
				const currentTranscript = event.results[event.results.length - 1][0].transcript.trim();
				console.log('Recognition result:', currentTranscript);
				setWebkitTranscript(currentTranscript);
				// stopRecording();
			};

			recognitionInstance.onend = () => {
				setIsRecording(false);
				console.log('Voice recognition ended.');
			};

			recognitionInstance.onnomatch = () => {
				console.log('Not Recognized.');
			};

			recognitionInstance.grammars = grammarlistInstance;
        	setRecognition(recognitionInstance);
			setSpeechRecognitionList(grammarlistInstance);
        } else {
        	console.error('Web Speech API is not supported in this browser.');
        }
    }, []);

    const startRecording = () => {
        if (recognition != null) {
			recognition.start();
        } else {
			console.error('Recognition instance not initialized.');
        }
    };

    const stopRecording = () => {
        if (recognition != null) {
			recognition.stop();
        } else {
			console.error('Recognition instance not initialized.');
        }
    };

	useEffect(() => {
		var stopChoices = {};
		// console.log(storedChoices);
		// console.log(JSON.stringify(storedChoices));
		var stringArray = Array<String>();
		storedChoices.map((choice, index) => {
			const option = JSON.stringify(choice.title);
			var buildString = "";
			const formattedTitle = choice.title.replaceAll(".", "").trimEnd().replaceAll(" ", "_").toLowerCase();
			// console.log(formattedTitle);
			if (formattedTitle in synonyms) {
				buildString = choice.title.replaceAll(".", "");
				synonyms[formattedTitle].map(title => {
					stringArray.push(title);
					// title.split(" ").map(value => {
					// 	if (value.toLowerCase() in voiceIgnores) {
					// 		console.error(value + " is an ignore word");
					// 	} else {
					// 		if (value.toLowerCase().replaceAll(" ", "_") in synonyms) {
					// 			synonyms[value.toLowerCase()].map(value => {
					// 				stringArray.push(value);
					// 			});
					// 		} else {
					// 			stringArray.push(value);
					// 		}
					// 	}
					// });
				});
			} else {
				choice.title.replaceAll(".", "").split(" ").map((value) => {
					if (value.toLowerCase() in voiceIgnores) {
						console.error(value + " is an ignore word");
					} else {
						buildString = buildString.concat(value + " ");
						if (value.toLowerCase() in synonyms) {
							synonyms[value.toLowerCase()].map(value => {
								stringArray.push(value);
							});
						} else {
							stringArray.push(value);
						}
					}
				});
			}
			stopChoices = {...stopChoices, [index]: buildString};
		});
		const grammar = `#JSGF V1.0; grammar answers; public <answer> = ${stringArray.join(" | ",)};`;
		// console.log(grammar);
		// console.log("GRAMMAR: " + grammar);
		speechRecognitionList.addFromString(grammar);
		setStopCommands(stopChoices);
		// console.log(stopChoices);
	}, [storedChoices])

	useEffect(() => {
		// console.log(webkitTranscript);
		if (webkitTranscript != "") {
			// console.log(JSON.stringify(stopCommands));
			if (Object.keys(stopCommands).length <= 0) {
				// stopListening()
				stopRecording();
				document.getElementById('free_input')?.setAttribute('value', webkitTranscript);
				var transcriptionContainer = document.getElementById('transcription-p');
				if ( transcriptionContainer != null ){
					transcriptionContainer.classList.remove("hidden");
					transcriptionContainer.innerHTML = '"'+ webkitTranscript +'"';
				}
				// form.current?.requestSubmit();
			} else {
				const splitCommands = Object.keys(stopCommands);
				for (let i = 0; i < splitCommands.length; i++) {
					const command = Object.values(stopCommands)[i] as string;
					if (command.trimEnd().toLowerCase().includes(" ") && command.trimEnd().toLowerCase().replaceAll(" ", "_") in synonyms) {
						const synonymsArray = synonyms[command.trimEnd().toLowerCase().replaceAll(" ", "_")];
						for (let ii = 0; ii < synonymsArray.length; ii++) {
							const partial = synonymsArray[ii];
							// console.log("COMPARE: " + webkitTranscript.toLowerCase() + " WITH " + partial.toLowerCase())
							if (webkitTranscript.toLowerCase().includes(partial.toLowerCase())) {
								stopRecording();
								// console.log("ISSUED STOP COMMAND: " + command);
								document.getElementById('free_input')?.setAttribute('value', command);
								
								var transcriptionContainer = document.getElementById('transcription-p');
								if ( transcriptionContainer != null ){
									transcriptionContainer.classList.remove("hidden");
									transcriptionContainer.innerHTML = '"'+ webkitTranscript +'"';
								}

								form.current?.requestSubmit();
								return;
							}
						}
					} else {
						const splitChoice = command.split(" ");
						for (let ii = 0; ii < splitChoice.length; ii++) {
							const partial = splitChoice[ii];
							const synonymsArray = synonyms[partial.toLowerCase()];
							if (synonymsArray) {
								for (let iii = 0; iii < synonymsArray.length; iii++) {
									const partial = synonymsArray[iii];
									if (partial != "") {
										// console.log("COMPARE: " + webkitTranscript.toLowerCase() + " WITH " + partial.toLowerCase());
										// console.log("CASE: " + webkitTranscript.toLowerCase().includes(partial.toLowerCase()))
										if (webkitTranscript.toLowerCase().includes(partial.toLowerCase())) {
											// stopListening();
											stopRecording();
											// console.log("ISSUED STOP COMMAND: " + Object.values(stopCommands)[i]);
											document.getElementById('free_input')?.setAttribute('value', command);
											
											var transcriptionContainer = document.getElementById('transcription-p');
											if ( transcriptionContainer != null ){
												transcriptionContainer.classList.remove("hidden");
												transcriptionContainer.innerHTML = '"'+ webkitTranscript +'"';
											}

											form.current?.requestSubmit();
											return;
										}
									}	
								}
							} else if (partial != "") {
									// console.log("COMPARE: " + webkitTranscript.toLowerCase() + " WITH " + partial.toLowerCase());
									// console.log("CASE: " + webkitTranscript.toLowerCase().includes(partial.toLowerCase()))
									if (webkitTranscript.toLowerCase().includes(partial.toLowerCase())) {
										// stopListening();
										stopRecording();
										// console.log("ISSUED STOP COMMAND: " + Object.values(stopCommands)[i]);
										document.getElementById('free_input')?.setAttribute('value', command);

										var transcriptionContainer = document.getElementById('transcription-p');
										if ( transcriptionContainer != null ){
											transcriptionContainer.classList.remove("hidden");
											transcriptionContainer.innerHTML = '"'+ webkitTranscript +'"';
										}

										form.current?.requestSubmit();
										return;
								}
							}
						}
					}
					document.getElementById('free_input')?.setAttribute('value', webkitTranscript);
					var transcriptionContainer = document.getElementById('transcription-p');
					if ( transcriptionContainer != null ){
						transcriptionContainer.classList.remove("hidden");
						transcriptionContainer.innerHTML = '"'+ webkitTranscript +'"';
					}
					// (Object.values(stopCommands)[index] as string).split(" ").map((partial) => {
					// 	if (partial != "") {
					// 		console.log("COMPARE: " + webkitTranscript.toLowerCase() + " WITH " + partial.toLowerCase());
					// 		console.log("CASE: " + webkitTranscript.toLowerCase().includes(partial.toLowerCase()))
					// 		if (webkitTranscript.toLowerCase().includes(partial.toLowerCase())) {
					// 			// stopListening();
					// 			stopRecording();
					// 			console.log("ISSUED STOP COMMAND: " + Object.values(stopCommands)[index]);
					// 			document.getElementById('free_input')?.setAttribute('value', (Object.values(stopCommands)[index] as string));
					// 			form.current?.requestSubmit();
					// 			return true;
					// 		}
					// 	}
					// });
					// if (transcript.toLowerCase().includes((Object.values(stopCommands)[index] as string).toLowerCase())) {
					// 	stopListening();
					// 	console.log("ISSUED STOP COMMAND: " + Object.values(stopCommands)[index]);
					// }
				}
			}
		}
		// console.log(Object.keys(stopChoices));
		// console.log((stopChoices as any)[1]);
		
		// if (transcript.toLowerCase().includes("stop".toLowerCase())) {
		//   stopListening();
		//   console.log("STOP COMMAND ISSUED");
		// }
	}, [webkitTranscript]);

	// For the little dialog transcription box that appears when the user speaks into the microphone.

	// This function is called when the user submits the form or presses the send button.
	const handleSpeechToTextSubmit: FormEventHandler<HTMLFormElement> = async e => {

		e.preventDefault()

		const formData = new FormData(form.current!)

		const file = getFile()

		if (formData.get('text') === '') {
			formData.delete('text')
		}

		if (file) {
			formData.append('audio', file)
			clearData()
		}

		if (!Array.from(formData.keys()).length) {
			return setHelpText('Payload cannot be empty!')
		}

		loading.start()

		setHelpText('Loading...')

		for (let i = 0; i < 3; i++) {

			const res = await wretch('/api/chat')
				.addon(FormDataAddon)
				.formData(Object.fromEntries(formData))
				.post()
				.badRequest(() => setHelpText('Invalid response. Please try again.'))
				.unauthorized(() => redirect('/')) 
				.internalError(res => setHelpText(res.json))
				.error(504, () =>
					setHelpText('Request timeout. Attempting to resend request...')
				)
				.json<ReturnType<typeof extractPromptAndChoices>>()

			if (res) {
				setPrompt(res.prompt ?? '') 
				setVoice(res.voice)
				setChoices(res.choices) 

				if (!res.prompt?.includes('again')) {
					form.current?.reset()
				}

				break

			}
		}
		document.getElementById('free_input')?.setAttribute('value', "");
		var transcriptionContainer = document.getElementById('transcription-p');
		if ( transcriptionContainer != null ){
			transcriptionContainer.classList.add("hidden");
			transcriptionContainer.innerHTML = '"'+ webkitTranscript +'"';
		}
		// Stop the loading spinner
		loading.stop()
	}

	async function handleMicClick() {
		if (isRecording) {
			// Stop mic to listen
			// bRecording = false;
			// stopListening()
			stopRecording();
			// return transcript
			//return stop().then(() => form.current?.requestSubmit())
		} else {
				// If not recording, start voice recording
			// start()
			// bRecording = true;
			// startListening()
			startRecording();
		}
	}

	return (
		<>
				<form className="relative w-full h-full flex flex-col items-center" onSubmit={handleSpeechToTextSubmit} ref={form}>
					{/*Only show Free Input when there are no choices*/}
					{ storedChoices.length == 0 && (
						<div id="text-input-div" className="relative flex h-full w-full items-center gap-x-2 max-sm:px-2 mt-5">
								<div className="relative flex-1">
									<input
										id="free_input"
										type="text"
										className="w-full rounded-full bg-white/50 px-5 py-4 text-lg"
										placeholder={placeHolderTranslate}
										name="text"
										ref={input}
									/>
								</div>
							<IconContext.Provider value={{size: 50}}>
								<button className="btn">
									<PaperPlaneRight className="icon" />
								</button>
							</IconContext.Provider>
						</div>
					)}

					{/*Only show mic if mic is not muted*/}
					{( isVoiceMuted == false ) && (
						<div className="relative h-full w-full flex flex-col items-center mt-5">

							{/*A div where the transcription will be displayed*/}
							{ ( webkitTranscript != "" ) && (
								<div className="relative h-10 flex flex-col items-center bg-blue-300 rounded-full">
									<p id="transcription-p" className="m-auto text-center text-lg px-5 italic"></p>
								</div>
							)}

							{/*This is necessary so that the transcription can be submitted to the form. 
							Naka hide kasi ung duplicated elements nito sa ^taas^ if may choices, kaya gumawa 
							ng duplicated elements na naka hide para sa transcription*/}
							{ storedChoices.length != 0  && (
								<div className="hidden">
									<input
										id="free_input"
										type="text"
										className="hidden"
										placeholder={placeHolderTranslate}
										name="text"
										ref={input}
									/>
									<button className="btn">
										<PaperPlaneRight className="icon hidden" />
									</button>	
								</div>							
							)}

							<IconContext.Provider value={{size: 60}}>
								<button
									className={`btn duration-[1.25s] relative inset-y-0 border-white my-auto aspect-square rounded-full transition-colors ${isRecording ? 'btn-primary animate-pulse' : ''}`} type="button" onClick={handleMicClick}>
									<Microphone className="icon" />
								</button>
							</IconContext.Provider>
						</div>
					)}
				</form>
		</>
	)
}