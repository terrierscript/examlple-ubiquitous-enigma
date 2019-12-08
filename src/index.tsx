import React, { useEffect, useRef, useState } from "react"
import { render } from "react-dom"
import * as tf from "@tensorflow/tfjs"
import { Box } from "./Box"
import * as mobilenet from "@tensorflow-models/mobilenet"
import styled from "styled-components"

const CloakVideo = styled.video`
  display: none;
`

const Hit = styled.pre`
  color: red;
  font-weight: bold;
`
const App = () => {
  const [rawResult, setRawResult] = useState<any>(null)
  const [result, setResult] = useState<any>([])
  const [net, setNet] = useState<any>(null)
  const [cam, setCam] = useState<any>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    mobilenet.load().then((net) => setNet(net))
  }, [])
  useEffect(() => {
    if (net == null) {
      return
    }
    if (videoRef.current === null) {
      return
    }
    const videoEl = videoRef.current
    tf.data.webcam(videoEl).then((cam) => {
      console.log("set")
      setCam(cam)
    })
  }, [net])
  useEffect(() => {
    if (cam === null) {
      return
    }
    setInterval(() => {
      cam.capture().then((img) => {
        net.classify(img).then((result) => {
          setRawResult(result)
          img.dispose()
          return tf.nextFrame()
        })
      })
    }, 500)
  }, [cam])

  useEffect(() => {
    const r = (rawResult || []).map((r) => {
      return {
        data: JSON.stringify(r, null, 2),
        hit: r.className === "Norfolk terrier"
      }
    })
    setResult(r)
  }, [rawResult])

  return (
    <div>
      <Box>
        <div>input:</div>
        <video
          autoPlay
          playsInline
          muted
          width="224"
          height="224"
          ref={videoRef}
        ></video>
      </Box>
      <Box>
        <div>
          Result:
          {result.map((r, i) => (
            <div key={i}>
              {r.hit ? <Hit>{r.data}</Hit> : <pre>{r.data}</pre>}
            </div>
          ))}
        </div>
      </Box>
      <div>
        <a href="https://codelabs.developers.google.com/codelabs/tensorflowjs-teachablemachine-codelab/index.html?hl=ja">
          codelabs
        </a>
        |
        <a href="https://github.com/terrierscript/examlple-ubiquitous-enigma">
          source code
        </a>
      </div>
    </div>
  )
}

render(<App />, document.querySelector("#root"))
