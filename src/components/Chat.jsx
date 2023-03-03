import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = { current: io("https://socket-chat-dvvh.onrender.com") };

export const Chat = () => {
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [user, setUser] = useState("");

  useEffect(() => {
    socket.current.on("changeOnline", (data) => {
      setOnlineUsers(data);
    });
    return () => {
      socket.current.off("disconnect");
    };
  }, []);

  useEffect(() => {
    socket.current.on("allMessages", (data) => {
      setAllMessages([...data, ...allMessages]);
    });
  }, [allMessages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.current.emit("addUser", user);
    socket.current.on("allMessages", (data) => {
      setAllMessages([...data, ...allMessages]);
    });
  };
    
  const handleMessage = (e) => {
    e.preventDefault();
    socket.current.emit("newMessage", { name: user, text: message });
    setAllMessages([{ name: user, text: message }, ...allMessages]);
  };

  return (
    <>
      <p>online users:{onlineUsers}</p>
      <form>
        <label>enter your name</label>
        <input
          value={user}
          onChange={(e) => {
            setUser(e.target.value);
          }}
        />
        <button onClick={handleSubmit}> submit</button>
      </form>
      <ul>
        {allMessages.map((item, index) => {
          return (
            <li key={index}>
              <span>{item.name}</span>:<span>{item.text}</span>
            </li>
          );
        })}
      </ul>
      <form>
        <label>enter your message</label>
        <input
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
        <button onClick={handleMessage}> submit</button>
      </form>
    </>
  );
};
