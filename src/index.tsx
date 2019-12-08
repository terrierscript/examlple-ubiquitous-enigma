import React, { useEffect, useRef, useState } from "react"
import { render } from "react-dom"
import { Box } from "./Box"
import * as mobilenet from "@tensorflow-models/mobilenet"

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
        <img
          width="300"
          src={
            "https://user-images.githubusercontent.com/13282103/70384565-b5584700-19c3-11ea-90e0-c079583781c3.jpg"
          }
          ref={imgRef}
        />
      </Box>
      <Box>
        <pre>
          Result: {result ? JSON.stringify(result, null, 2) : "loading..."}
        </pre>
        <div>Expect: Norfolk terrier </div>
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
