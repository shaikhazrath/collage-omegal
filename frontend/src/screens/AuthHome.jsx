import React from "react";
import bg from "../assets/bg.jpg"; // Import the image
import { useNavigate } from "react-router-dom";

const AuthHome = () => {
  const navigate = useNavigate();

  return (
<div className="flex justify-center items-center h-screen flex-col bg-black  gap-3 bg-cover bg-center" style={{backgroundImage: `url(${bg})`}}>

      <div className="flex  items-center justify-center ">
      <h1 className=" font-extrabold md:text-8xl text-6xl text-orange-500  text-center uppercase ">Campus Omegal</h1>
      {/* <img src={logo} className=" w-16 h-auto" /> */}
      </div>
      <h5 className="font-medium md:text-4xl text-2xl text-white ">exclusive only for ANITS</h5>

      <button
        className="text-white bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-orange-300  shadow-lg shadow-orange-500/50 font-medium rounded-md text-xl px-5 py-2.5 text-center me-2 mb-2 animate-bounce  mt-5 "
        onClick={() => navigate("/auth")}
      >
        Lets go
      </button>
    </div>
  );
};

export default AuthHome;
