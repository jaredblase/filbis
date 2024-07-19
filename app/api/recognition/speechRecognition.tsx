'use-client'

import { Construction } from 'lucide-react';
import React, { useState, useEffect } from 'react';

namespace CORE{
    export interface IWindow extends Window{
        webkitSpeechRecognition: any;
    }
}

export const VoiceRecorder = () => {
    const [webkitTranscript, setWebkitTranscript] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [recognition, setRecognition] = useState(Object);

        
    useEffect(() => {
        if ('webkitSpeechRecognition' in window) {
            const recognitionInstance = new webkitSpeechRecognition();

            recognitionInstance.continuous = true;
            recognitionInstance.interimResults = false;
            recognitionInstance.lang = 'en-US';

            recognitionInstance.onstart = () => {
                setIsRecording(true);
                console.log('Voice recognition started. Speak now.');
        };

        recognitionInstance.onresult = (event) => {
            const currentTranscript = event.results[event.results.length - 1][0].transcript.trim();
            console.log('Recognition result:', currentTranscript);
            setWebkitTranscript(currentTranscript);

            // Check if the stop word or sentence is detected
            if (currentTranscript.toLowerCase().includes('stop')) {
            stopRecording();
            }
        };

        recognitionInstance.onend = () => {
            setIsRecording(false);
            console.log('Voice recognition ended.');
        };

        setRecognition(recognitionInstance);
        } else {
        console.error('Web Speech API is not supported in this browser.');
        }
    }, []);

    const startRecording = () => {
        if (recognition) {
        recognition.start();
        } else {
        console.error('Recognition instance not initialized.');
        }
    };

    const stopRecording = () => {
        if (recognition) {
        recognition.stop();
        } else {
        console.error('Recognition instance not initialized.');
        }
    };

    return {
        startRecording,
        stopRecording,
        webkitTranscript,
        isRecording,
        recognition
    }

//   return (
//     <div>
//       <h1>Voice Recorder</h1>
//       <button onClick={startRecording} disabled={isRecording}>
//         Start Recording
//       </button>
//       <button onClick={stopRecording} disabled={!isRecording}>
//         Stop Recording
//       </button>
//       {transcript && (
//         <p>Current Transcript: {transcript}</p>
//       )}
//     </div>
//   );
};