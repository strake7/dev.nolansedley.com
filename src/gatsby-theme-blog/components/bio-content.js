import React from "react"
import { Styled } from "theme-ui"

/**
 * Change the content to add your own bio
 */

export default function Bio() {
  return (
    <>
      I am Nolan and currently develop as a software engineering manager at{" "}
      <Styled.a href="https://mindbody.io" target="blank">Mindbody</Styled.a>. We build
      software to connect the world to wellness.
      <br />
      The majority of my articles are regarding .NET and JavaScript development
      though I also dabble in Java, Ruby and Python. Find more about my career
      experience and ongoing projects on{" "}
      <Styled.a href="https://www.linkedin.com/in/nsedley/" target="blank">
        LinkedIn
      </Styled.a>{" "}
      and <Styled.a href="https://github.com/strake7" target="blank">GitHub</Styled.a>.      
    </>
  )
}
