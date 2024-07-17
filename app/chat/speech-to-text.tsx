'use client'

import { PaperPlaneRight, Microphone } from '@phosphor-icons/react/dist/ssr/index' 
import { redirect } from 'next/navigation'
import { FormEventHandler, MouseEventHandler, useEffect, useRef, useState } from 'react'
import wretch from 'wretch'
import { useChatActions, useChoices, useHelpText } from './store'
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
		console.log(storedChoices);
		// console.log(JSON.stringify(storedChoices));
		var stringArray = Array<String>();
		storedChoices.map((choice, index) => {
			const option = JSON.stringify(choice.title);
			var buildString = "";

			if (choice.title.replaceAll(".", "").toLowerCase() in synonyms) {
				buildString = choice.title.replaceAll(".", "");
				synonyms[choice.title.replaceAll(".", "").toLowerCase()].map(title => {
					title.split(" ").map(value => {
						if (value.toLowerCase() in voiceIgnores) {
							console.error(value + " is an ignore word");
						} else {
							if (value.toLowerCase().replaceAll(" ", "_") in synonyms) {
								synonyms[value.toLowerCase()].map(value => {
									stringArray.push(value);
								});
							} else {
								stringArray.push(value);
							}
						}
					});
				});
			} else {
				choice.title.replaceAll(".", "").split(" ").map((value) => {
					if (value.toLowerCase() in voiceIgnores) {
						console.error(value + " is an ignore word");
					} else {
						buildString = buildString.concat(value + " ");
						if (value.toLowerCase().replaceAll(" ", "_") in synonyms) {
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
		console.log(grammar);
		console.log("GRAMMAR: " + grammar);
		speechRecognitionList.addFromString(grammar);
		setStopCommands(stopChoices);
		console.log(stopChoices);
	}, [storedChoices])

	useEffect(() => {
		// console.log(webkitTranscript);
		if (webkitTranscript != "") {
			console.log(JSON.stringify(stopCommands));
			if (Object.keys(stopCommands).length <= 0) {
				// stopListening()
				stopRecording();
				document.getElementById('text')?.setAttribute('value', webkitTranscript);
				// form.current?.requestSubmit();
			} else {
				const splitCommands = Object.keys(stopCommands);
				for (let i = 0; i < splitCommands.length; i++) {
					const command = splitCommands[i];
					const splitChoice = (Object.values(stopCommands)[i] as string).split(" ");
					for (let ii = 0; ii < splitChoice.length; ii++) {
						const partial = splitChoice[ii];
						const array = synonyms[partial.toLowerCase()];
						if (synonyms[partial.toLowerCase()]) {
							for (let iii = 0; iii < array.length; iii++) {
								const partial = array[iii];
								if (partial != "") {
									console.log("COMPARE: " + webkitTranscript.toLowerCase() + " WITH " + partial.toLowerCase());
									// console.log("CASE: " + webkitTranscript.toLowerCase().includes(partial.toLowerCase()))
									if (webkitTranscript.toLowerCase().includes(partial.toLowerCase())) {
										// stopListening();
										stopRecording();
										console.log("ISSUED STOP COMMAND: " + Object.values(stopCommands)[i]);
										document.getElementById('text')?.setAttribute('value', (Object.values(stopCommands)[i] as string));
										form.current?.requestSubmit();
										return;
									}
								}	
							}
						} else if (partial != "") {
								console.log("COMPARE: " + webkitTranscript.toLowerCase() + " WITH " + partial.toLowerCase());
								// console.log("CASE: " + webkitTranscript.toLowerCase().includes(partial.toLowerCase()))
								if (webkitTranscript.toLowerCase().includes(partial.toLowerCase())) {
									// stopListening();
									stopRecording();
									console.log("ISSUED STOP COMMAND: " + Object.values(stopCommands)[i]);
									document.getElementById('text')?.setAttribute('value', (Object.values(stopCommands)[i] as string));
									form.current?.requestSubmit();
									return;
							}
						}
					}
					document.getElementById('text')?.setAttribute('value', webkitTranscript);
					// (Object.values(stopCommands)[index] as string).split(" ").map((partial) => {
					// 	if (partial != "") {
					// 		console.log("COMPARE: " + webkitTranscript.toLowerCase() + " WITH " + partial.toLowerCase());
					// 		console.log("CASE: " + webkitTranscript.toLowerCase().includes(partial.toLowerCase()))
					// 		if (webkitTranscript.toLowerCase().includes(partial.toLowerCase())) {
					// 			// stopListening();
					// 			stopRecording();
					// 			console.log("ISSUED STOP COMMAND: " + Object.values(stopCommands)[index]);
					// 			document.getElementById('text')?.setAttribute('value', (Object.values(stopCommands)[index] as string));
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

	// This function is called when the user submits the form or presses the send button.
	const handleSpeechToTextSubmit: FormEventHandler<HTMLFormElement> = async e => {

		// Preventing to reload the page
		e.preventDefault()

		// Get the current inputs in the form only when it is not null
		const formData = new FormData(form.current!)

		// Get the current voice recording if there is any (nag rereturn lang to kapag may audio na narecord)
		const file = getFile()

		// If walang laman ung input, remove it from the form data
		if (formData.get('text') === '') {
			formData.delete('text')
		}

		// If may audio na narecord, append it to the form data
		if (file) {
			formData.append('audio', file)
			clearData()
		}

		// If the length of the input is 0, set the help text to 'Payload cannot be empty!'
		if (!Array.from(formData.keys()).length) {
			return setHelpText('Payload cannot be empty!')
		}

		// Start the loading spinner (ito ung tatlong dots na naandar)
		loading.start()

		// Gawin "Loading..." ung taas ng mga choices sa UI
		setHelpText('Loading...')

		// max 3 attempts in case of gateway timeout
		for (let i = 0; i < 3; i++) {

			// Post request to the /api/chat which is the endpoint for the DialogFlowCX
			const res = await wretch('/api/chat')
				.addon(FormDataAddon)
				.formData(Object.fromEntries(formData))
				.post()
				.badRequest(() => setHelpText('Invalid response. Please try again.')) // If bad request, display this message
				.unauthorized(() => redirect('/')) // If unauthorized, redirect to the homepage
				.internalError(res => setHelpText(res.json))
				.error(504, () =>
					// gateway timeout, vercel limitations
					setHelpText('Request timeout. Attempting to resend request...')
				)
				.json<ReturnType<typeof extractPromptAndChoices>>()

			// If the response from DialogFlowCX is not null, set the prompt, voice, and choices.
			if (res) {
				setPrompt(res.prompt ?? '') // Ito ung Loading... sa taas ng mga choices, idisplay hanggang mag reply ung DialogFlowCX
				setVoice(res.voice) // Ito ung naririnig na voice over kapag nag rereply ung DialogFlowCX
				setChoices(res.choices) // Ito ung mga choices na ipapakita sa UI, naka depende kung ano ung reply ng DialogFlowCX

				if (!res.prompt?.includes('again')) {
					form.current?.reset()
				}
				
				setHelpText('Click anything or type in the chatbox.') // Ito ung default na text na lalabas sa UI kapag may new choices
				break
			}
		}
		document.getElementById('text')?.setAttribute('value', "");
		// Stop the loading spinner
		loading.stop()
	}

    /*
		If person uses Speech Recognition (Cinlick ung mic sa chat box) and NAG RERECORD CURRENTLY ung voice, stop recording after i-click ulit.
	*/
	async function handleMicClick() {
		// Mic is CURRENTLY recording
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

    // This is the UI of the whole green square chat box (ito ung kasama ung choices at chat box)
	return (
		<>
			<form className="relative w-full mt-5" onSubmit={handleSpeechToTextSubmit} ref={form}>
				<div className="relative flex w-full items-center gap-x-2 max-sm:px-2">
						<div className="relative flex-1">
							{/* { mainTranscript != "" &&  */
								(								
									<input
									type="text"
									className="w-full rounded-full bg-white/50 px-5 py-4 text-lg"
									placeholder="Type anything here!"
									name="text"
									id='text'
									ref={input}
									// onChange={stopRecording}
								/>)
							} 
							{/* { mainTranscript == "" && 
								(								
									<input
									type="text"
									className="w-full rounded-full bg-white/50 px-5 py-4 text-lg"
									placeholder="Type anything here!"
									name="text"
									ref={input}
								/>)
							} */}
							<button
								className={`btn duration-[1.25s] absolute inset-y-0 right-2 my-auto aspect-square rounded-full p-1.5 transition-colors ${
									isRecording ? 'btn-primary animate-pulse' : ''
								}`}
								type="button"
								onClick={handleMicClick}
							>
								<Microphone className="icon" />
							</button>
						</div>
					<button className="btn w-10 p-0">
						<PaperPlaneRight className="icon" />
					</button>
				</div>
			</form>
		</>
	)
}