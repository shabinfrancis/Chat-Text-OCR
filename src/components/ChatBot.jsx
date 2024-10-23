import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import BotMessage from "./Chatbot/BotMessage";
import UserMessage from "./Chatbot/UserMessage";
import Messages from "./Chatbot/Messages";
import Input from "./Chatbot/Input";

import API from "./ChatbotAPI";

import "./chatBot.css";
import Header from "./Chatbot/Header";

function Chatbot() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    async function loadWelcomeMessage() {
      setMessages([
        <BotMessage
          key="0"
          fetchMessage={async () => await API.GetChatbotResponse("hi")}
        />
      ]);
    }
    loadWelcomeMessage();
  }, []);

  const send = async text => {
    const newMessages = messages.concat(
      <UserMessage key={messages.length + 1} text={text} />,
      <BotMessage
        key={messages.length + 2}
        fetchMessage={async () => await API.GetChatbotResponse(text)}
      />
    );
    setMessages(newMessages);
  };

  return (
    <div className="Bot">
      <div className="chatbot">
        <Header />
        <Messages messages={messages} />
        <Input onSend={send} />
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Chatbot />, rootElement);

export default Chatbot;
