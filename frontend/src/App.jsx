import { Route, Routes } from "react-router-dom";
import ChatRoom from "./screens/ChatRoom";
import HomeScreen from "./screens/HomeScreen";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Auth from "./screens/AuthRoom";
import AuthHome from "./screens/AuthHome";
import NotFound from "./screens/NotFound";
const App = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const getAuthstatus = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.get(
        `http://192.168.55.107:8080/auth/checktoken`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setAuthenticated(true);
      setLoading(false);
    } catch (error) {
      if (token) {
        localStorage.removeItem("token");
      }
      setLoading(false);
    }
  };
  useEffect(() => {
    getAuthstatus();
  }, [authenticated]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      {authenticated ? (
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/chatroom" element={<ChatRoom />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<AuthHome />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
    </>
  );
};

export default App;