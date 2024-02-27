import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { IoSend } from "react-icons/io5";
import Loading from "./Loading";

function ChatRoom() {
  const URL = "https://collage-omegal.onrender.com";
  const [socket, setSocket] = useState(null);
  const [roomid, setRoomid] = useState(null);
  const [userid, setUserid] = useState(null);
  const [waiting, setWaiting] = useState(true);
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
useEffect(() => {
    const timer = setTimeout(() => {
      // Redirect the user to '/'
      window.location.href = '/';
    }, 220000); // 2 minutes in milliseconds

    // Clear the timer if the input changes
    return () => clearTimeout(timer);
  }, [messageInput]);

  // Update the message input state when it changes
  const handleMessageInputChange = (e) => {
    setMessageInput(e.target.value);
  };
  useEffect(() => {
    const socket = new io(URL);
    setSocket(socket);
    return () => {
      socket.disconnect(roomid);
    };
  }, []);

  useEffect(() => {
    if (socket) {
      const handlewating = () => {
        setWaiting(false);
      };
      socket.on("room", (room) => {
        setRoomid(room.id);
        setUserid(socket.id);
        if (room.user2) {
          handlewating();
        }
      });
      socket.on("user2Joined", (room) => {
        setRoomid(room.id);
        setUserid(socket.id);
        if (room.user2) {
          handlewating();
        }
      });

      socket.on("chat-message", (message, id) => {
        setMessages((prevMessages) => [...prevMessages, { id, message }]);
      });
      socket.on("userLeft", () => {
        window.location.reload();
        handlewating();
      });
      return () => {
        socket.off("room", handlewating());
        socket.off("user2Joined", handlewating());
        socket.off("userLeft", handlewating());
        socket.off("chat-message");
      };
    }
  }, [socket]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    socket.emit("chat-message", roomid, messageInput);
    setMessageInput("");
  };

  return (
    <>
      {waiting ? (
        <Loading/>
      ) : (
        <div className="bg-black">
          <div className="h-[7vh] bg-gray-900 p-1 flex justify-between items-center px-2 font-bold uppercase">
          <a className="text-white bg-orange-500 p-2 rounded-sm " href="/">Leave</a>
            <a className="text-white bg-orange-500 p-2 rounded-sm " href="/chatroom">next</a>
          </div>
          <div className="h-[79.5vh] overflow-scroll ">
            {messages &&
              messages.map((msg, index) => {
                const isUserMessage = userid === msg.id;
                const messageClassNames = isUserMessage
                  ? "bg-green-600 text-white self-end rounded-lg mb-1 max-w-[70%]"
                  : "bg-gray-200 text-black self-start rounded-lg mb-1 max-w-[70%]";

                return (
                  <div
                    key={index}
                    className={`flex ${
                      isUserMessage ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div className={messageClassNames}>
                      <p className="px-3 py-2">{msg.message}</p>
                    </div>
                  </div>
                );
              })}
            <div ref={messagesEndRef} />
          </div>

          <form className="w-full bg-gray-900 flex items-center px-2 h-[8vh] ">
            <textarea
              id="message-input"
              type="text"
              value={messageInput}
              onChange={handleMessageInputChange}
              className="rounded-md w-full flex-grow p-1"
              placeholder="Type your message here..."
            />
            <button
              onClick={handleSendMessage}
              className="p-3 m-2 rounded-full bg-orange-500 flex justify-center items-center flex-shrink-0"
            >
              <IoSend color="white" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default ChatRoom;
