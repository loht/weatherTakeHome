import React, { Component } from "react";
import "./styles/TextMessage.css";

class TextMessage extends Component {
  render() {
    const { message } = this.props;
    return (
      <span className="text-message">
          {message}
      </span>
    );
  }
}

export default TextMessage;
