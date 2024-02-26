import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { IoSend } from "react-icons/io5";
import Peer from "simple-peer"; // Import simple-peer for WebRTC functionality

function VideoRoom() {
  const URL = "http://192.168.55.107:8080";
  const [socket, setSocket] = useState(null);
  const [roomid, setRoomid] = useState(null);
  const [userid, setUserid] = useState(null);
  const [waiting, setWaiting] = useState(true);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [peer, setPeer] = useState(null); // Peer for WebRTC connection
  const userVideoRef = useRef(); // Ref for user's video element
  const partnerVideoRef = useRef(); // Ref for partner's video element

  useEffect(() => {
    // Initialize socket connection
    const socket = io(URL);
    setSocket(socket);
    
    // Clean up on component unmount
    return () => {
      socket.disconnect(roomid);
    };
  }, []);

  useEffect(() => {
    if (socket) {
      // Socket event listeners
      socket.on("room", (room) => {
        setRoomid(room.id);
        setUserid(socket.id);
        if (room.user2) {
          setWaiting(false);
          initiatePeerConnection(false);
        }
      });

      socket.on("user2Joined", (room) => {
        setRoomid(room.id);
        setUserid(socket.id);
        if (room.user2) {
          setWaiting(false);
          initiatePeerConnection(true);
        }
      });

      socket.on("chat-message", (message, id) => {
        setMessages((prevMessages) => [...prevMessages, { id, message }]);
      });

      socket.on("userLeft", () => {
        window.location.reload();
        setWaiting(true);
      });

      return () => {
        // Clean up socket event listeners
        socket.off("room");
        socket.off("user2Joined");
        socket.off("chat-message");
        socket.off("userLeft");
      };
    }
  }, [socket]);

  const initiatePeerConnection = (initiator) => {
    // Initialize WebRTC peer connection
    const peer = new Peer({ initiator: initiator, trickle: false });

    peer.on("signal", (data) => {
      socket.emit("offer", data, roomid);
    });

    peer.on("stream", (stream) => {
      // When receiving a stream, display it in the partner's video element
      if (partnerVideoRef.current) {
        partnerVideoRef.current.srcObject = stream;
      }
    });

    // Set the peer object
    setPeer(peer);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    socket.emit("chat-message", roomid, messageInput);
    setMessageInput("");
  };

  return (
    <>
      {waiting ? (
        <h1>Waiting for another user to join...</h1>
      ) : (
        <div className="bg-black">
          <div className="h-[7vh] bg-gray-900 p-1 flex justify-between items-center px-2 font-bold uppercase">
            <a className="text-white bg-orange-500 p-2 rounded-sm " href="/">
              Leave
            </a>
            <a className="text-white bg-orange-500 p-2 rounded-sm " href="/chatroom">
              Next
            </a>
          </div>
          <div className="h-[79.5vh] flex">
            <div className="w-1/2">
              {/* User's video element */}
              <video ref={userVideoRef} autoPlay muted className="w-full h-full"></video>
            </div>
            <div className="w-1/2">
              {/* Partner's video element */}
              <video ref={partnerVideoRef} autoPlay className="w-full h-full"></video>
            </div>
          </div>

          <form className="w-full bg-gray-900 flex items-center px-2 h-[8vh] ">
            <textarea
              id="message-input"
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
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

export default VideoRoom;
