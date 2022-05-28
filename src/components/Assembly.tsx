import React from 'react'
import axios from "axios"

const assembly = axios.create({
  baseURL: "https://api.assemblyai.com/v2",
  headers: {
    authorization: "459f0cb64fc7430e958e6ec7778417bc",
    "content-type": "application/json",
    "transfer-encoding": "chunked",
  },
})

assembly
    .post("/transcript", {
        audio_url: "https://bit.ly/3yxKEIY"
    })
    .then((res) => console.log(res.data))
    .catch((err) => console.error(err))

const Assembly = () => {

  return (
    <div>
      Assemble
    </div>
  )
}

export default Assembly