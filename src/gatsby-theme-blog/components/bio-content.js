import React from "react"
import { Styled } from "theme-ui"

/**
 * Change the content to add your own bio
 */

export default function Bio() {
  return (
    <>
      Hello, I am Nolan! I currently develop as a software engineering manager
      at {" "}
      <Styled.a href="https://www.appfolioinvestmentmanagement.com/" target="blank">
        Appfolio Investment Management
      </Styled.a>
      . I am especially well-versed in .NET and JavaScript development and have been recently making strides in Ruby. Find more information about my career experience at {" "}
      <Styled.a href="https://www.linkedin.com/in/nsedley/" target="blank">
        LinkedIn
      </Styled.a>{" "}
      and{" "}
      <Styled.a href="https://github.com/strake7" target="blank">
        GitHub
      </Styled.a>
      .
    </>
  )
}
