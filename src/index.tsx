import React, { useEffect, useRef, useState } from "react"
import { render } from "react-dom"
// import "@tensorflow/tfjs"
import * as mobilenet from "@tensorflow-models/mobilenet"
// @ts-ignore
import dog from "./dog.jpg"

import styled from "styled-components"

const Box = styled.div`
  border: 1px solid rgb(30%, 30%, 30%);
  border-radius: 10px;
  padding: 1em;
  margin: 1em;
`
const App = () => {
  const [result, setResult] = useState<any>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  useEffect(() => {
    if (imgRef.current === null) {
      return
    }
    const imgEl = imgRef.current
    imgEl.onload = () => {
      mobilenet
        .load()
        .then((net) => {
          return net.classify(imgEl)
        })
        .then((result) => {
          setResult(result)
        })
        .catch((e) => {
          setResult({
            isError: true,
            error: e
          })
        })
    }
  })
  return (
    <div>
      <Box>
        <div>input:</div>
        <img width="300" src={dog} ref={imgRef} />
      </Box>
      <Box>
        <pre>
          result: {result ? JSON.stringify(result, null, 2) : "loading..."}
        </pre>
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
