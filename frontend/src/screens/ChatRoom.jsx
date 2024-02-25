import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { IoSend } from "react-icons/io5";

function ChatRoom() {
  const URL = "http://192.168.55.107:8080";
  const [socket, setSocket] = useState(null);
  const [roomid, setRoomid] = useState(null);
  const [userid, setUserid] = useState(null);
  const [waiting, setWaiting] = useState(true);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);

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
    document.getElementById('message-input').focus();

  };

  return (
    <>
      {waiting ? (
        <h1>waiting</h1>
      ) : (
        <div className="">
          <div className=" ">
          {messages && (
            messages.map((msg, index) => {
              return (
                <div key={index} className="">
                  <h1 style={{ color: userid === msg.id ? "green" : "black"  }}>
                    {msg.message}
                  </h1>
                </div>
              );
            })
            
          )}
          </div>
          <form className="w-full bg-gray-900 flex p-2" >
            <textarea
              id="message-input"

              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="rounded-md w-full  p-1"
            />
            <button onClick={handleSendMessage} className="p-3 m-2 rounded-full bg-orange-500">
              <IoSend  color="white"/>
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default ChatRoom;
{
  /* <button
onClick={(e) => {
  e.preventDefault();
  window.location.reload();
}}
>
next
</button> */
}
