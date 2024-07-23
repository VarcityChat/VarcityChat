import React, { useCallback, useEffect, useState } from "react";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { messages as messagesData } from "../../../constants/message";

export default function ChatMessage() {
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    setMessages([
      ...messagesData.map((message) => {
        return {
          _id: message._id,
          text: message.text,
          createdAt: new Date(),
          user: {
            _id: message.from,
            name: message.from ? "You" : "Bob",
          },
        };
      }),
    ]);
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages: any) => onSend(messages)}
      user={{ _id: 1 }}
    />
  );
}
