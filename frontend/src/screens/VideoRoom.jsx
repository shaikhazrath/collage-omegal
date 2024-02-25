import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

function VideoRoom() {
  const URL = "http://localhost:8080";
  const [socket, setSocket] = useState(null);
  const [roomid, setRoomid] = useState(null);
  const [userid, setUserid] = useState(null);
  const [waiting, setWaiting] = useState(true);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  useEffect(() => {
    const socket = io(URL);
    setSocket(socket);

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);
      })
      .catch((error) => {
        console.error('Error accessing media devices:', error);
      });

    return () => {
      socket.disconnect(roomid);
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("room", (room) => {
        setRoomid(room.id);
        setUserid(socket.id);
        if (room.user2) {
          setWaiting(false);
        }
      });
      
      socket.on("user2Joined", (room) => {
        setRoomid(room.id);
        setUserid(socket.id);
        setWaiting(false);
      });

      socket.on("chat-message", (message, id) => {
        setMessages((prevMessages) => [...prevMessages, { id, message }]);
      });

      socket.on("userLeft", () => {
        window.location.reload();
      });

      return () => {
        socket.off("room");
        socket.off("user2Joined");
        socket.off("userLeft");
        socket.off("chat-message");
      };
    }
  }, [socket]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    socket.emit("chat-message", roomid, messageInput);
    setMessageInput("");
  };

  const handleCall = () => {
    const peerConnection = new RTCPeerConnection();
    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

    peerConnection.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    peerConnection.createOffer()
      .then((offer) => peerConnection.setLocalDescription(offer))
      .then(() => {
        socket.emit("offer", roomid, peerConnection.localDescription);
      })
      .catch((error) => {
        console.error("Error creating offer:", error);
      });

    socket.on("answer", (answer) => {
      peerConnection.setRemoteDescription(answer);
    });

    socket.on("ice-candidate", (candidate) => {
      peerConnection.addIceCandidate(candidate);
    });
  };

  return (
    <>
      {waiting ? (
        <h1>Waiting for connection...</h1>
      ) : (
        <>
          <h1>Hello!</h1>
          {remoteStream && <video srcObject={remoteStream} autoPlay />}
          {messages ? (
            messages.map((msg, index) => (
              <div key={index}>
                <h1 style={{ color: userid === msg.id ? "green" : "black" }}>{msg.message}</h1>
              </div>
            ))
          ) : (
            <h1>No messages</h1>
          )}

          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
          <button onClick={handleSendMessage}>Send</button>
          <button onClick={handleCall}>Start Video Call</button>
          <button onClick={() => window.location.reload()}>Next</button>
        </>
      )}
    </>
  );
}

export default VideoRoom;
