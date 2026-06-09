/** @jsx jsx */
import React from "react"
import { jsx } from "theme-ui"

/**
 * Change the content to add your own bio
 */

export default function Bio() {
  return (
    <>
      Hello, I am Nolan! I currently develop as a software engineering manager
      at {" "}
      <a sx={{ color: "primary" }} href="https://www.appfolioinvestmentmanagement.com/" target="blank">
        Appfolio Investment Management
      </a>
      . I am especially well-versed in .NET and JavaScript development and have been recently making strides in Ruby. Find more information about my career experience at {" "}
      <a sx={{ color: "primary" }} href="https://www.linkedin.com/in/nsedley/" target="blank">
        LinkedIn
      </a>{" "}
      and{" "}
      <a sx={{ color: "primary" }} href="https://github.com/strake7" target="blank">
        GitHub
      </a>
      .
    </>
  )
}
