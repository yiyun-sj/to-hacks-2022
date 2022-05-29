import React, { useState } from 'react'
import RecordRTC, { StereoAudioRecorder } from 'recordrtc'

let transcription = 'none'
let isRecording = false
let socket
let recorder

const run = async (handleTranscribe, handleCohere) => {
  if (isRecording) {
    if (socket) {
      socket.send(JSON.stringify({ terminate_session: true }))
      socket.close()
      socket = null
    }

    if (recorder) {
      recorder.pauseRecording()
      recorder = null
    }
  } else {
    const response = await fetch('http://localhost:8000') // get temp session token from server.js (backend)
    const data = await response.json()

    if (data.error) {
      alert(data.error)
    }

    const { token } = data

    // establish wss with AssemblyAI (AAI)
    socket = await new WebSocket(
      `wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000&token=${token}`
    )

    const texts = {}
    socket.onmessage = (message) => {
      let msg = ''
      const res = JSON.parse(message.data)
      texts[res.audio_start] = res.text
      const keys = Object.keys(texts)
      keys.sort((a, b) => a - b)
      for (const key of keys) {
        if (texts[key]) {
          msg += ` ${texts[key]}`
        }
      }
      console.log(msg)
      handleTranscribe(msg)
      //handleCohere(msg)
    }

    socket.onerror = (event) => {
      console.error(event)
      socket.close()
    }

    socket.onclose = (event) => {
      console.log(event)
      socket = null
    }

    socket.onopen = () => {
      transcription = ''
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          recorder = new RecordRTC(stream, {
            type: 'audio',
            mimeType: 'audio/webm;codecs=pcm',
            recorderType: StereoAudioRecorder,
            timeSlice: 250,
            desiredSampRate: 16000,
            numberOfAudioChannels: 1,
            bufferSize: 4096,
            audioBitsPerSecond: 128000,
            ondataavailable: (blob) => {
              const reader = new FileReader()
              reader.onload = () => {
                const base64data = reader.result

                if (socket) {
                  socket.send(
                    JSON.stringify({
                      audio_data: base64data.split('base64,')[1],
                    })
                  )
                }
              }
              reader.readAsDataURL(blob)
            },
          })

          recorder.startRecording()
        })
        .catch((err) => console.error(err))
    }
  }

  isRecording = !isRecording
}

const Assembly = () => {
  const [transcription, setTranscription] = useState()
  const [data, setData] = useState(null);
  const API_URL = 'http://localhost:8000';

  const handleCohere = (msg) => {
    setData(null);
    fetch(`${API_URL}/api?input=${[msg]}`)
      .then((res) => res.json())
      .then((data) => console.log(data))
  };
  const handleTranscribe = (text) => {
    setTranscription(text)
  }

  return (
    <div>
      <button onClick={() => run(handleTranscribe, handleCohere)}>Record</button>
      {transcription}
      {data}
    </div>
  )
}

export default Assembly
