import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import io from "socket.io-client";
import AuthContext from "../context/AuthContext";
import "./Chat.css";

const socket = io.connect("http://localhost:5001");

function Chat() {
    const { receiverId } = useParams(); // This would be the CA's ID (or User ID if CA is logged in)
    const { state } = useLocation();
    const caName = state?.caName || "User";
    const { user } = useContext(AuthContext);
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (user) {
            socket.emit("join_room", user.id);
        }
    }, [user]);

    useEffect(() => {
        if (!user || !receiverId) return;

        const fetchMessages = async () => {
            try {
                const response = await fetch(`http://localhost:5001/api/chat/${user.id}/${receiverId}`);
                if (response.ok) {
                    const data = await response.json();
                    setMessageList(data);
                } else {
                    console.error("Failed to fetch messages");
                }
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        fetchMessages();
    }, [user, receiverId]);

    useEffect(() => {
        const receiveMessageListener = (data) => {
            setMessageList((list) => {
                // Prevent duplicate messages if any
                if (list.some(msg => msg.timestamp === data.timestamp && msg.content === data.content)) {
                    return list;
                }
                return [...list, data];
            });
        };
        socket.on("receive_message", receiveMessageListener);

        return () => {
            socket.off("receive_message", receiveMessageListener);
        };
    }, []);

    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                sender: user.id,
                receiver: receiverId, // In a real app, this should be a valid User ID from DB
                content: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
                author: user.email,
                type: "sent"
            };

            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messageList]);

    return (
        <div className="chat-window">
            <div className="chat-header">
                <p>Live Chat with {caName}</p>
            </div>
            <div className="chat-body">
                {messageList.map((messageContent, index) => {
                    return (
                        <div
                            className="message"
                            id={user.email === messageContent.author ? "you" : "other"}
                            key={index}
                        >
                            <div>
                                <div className="message-content">
                                    <p>{messageContent.content}</p>
                                </div>
                                <div className="message-meta">
                                    <p id="time">{messageContent.time}</p>
                                    <p id="author">{messageContent.author?.split("@")[0]}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>
            <div className="chat-footer">
                <input
                    type="text"
                    value={currentMessage}
                    placeholder="Type a message..."
                    onChange={(event) => {
                        setCurrentMessage(event.target.value);
                    }}
                    onKeyPress={(event) => {
                        event.key === "Enter" && sendMessage();
                    }}
                />
                <button onClick={sendMessage}>&#9658;</button>
            </div>
        </div>
    );
}

export default Chat;
