import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import bg from "../assets/bg.jpg"; 

const Auth = () => {
  const [email, setEmail] = useState();
  const [otp, setOtp] = useState();
  const [otpStatus, setOtpStatus] = useState(false);
  const [error, setError] = useState();
  const navigate = useNavigate();
  const handelSendOtp = async () => {
    try {
      const response = await axios.post(`https://collage-omegal.onrender.com/auth`, {
        email,
      });
      console.log(response);
      setOtpStatus(true);
      setError('')
    } catch (error) {
      console.log(error)
      // setError(error.response.data.error);
    }
  };
  const verifyOtp = async () => {
    try {
      const response = await axios.post(`https://collage-omegal.onrender.com/auth/verify`, {
        email,
        otp,
      });
      console.log(response.data.user.isAdmin);
      localStorage.setItem("token", response.data.token);
       navigate('/')
       window.location.reload()
    } catch (error) {
      console.log(error)
      setError(error.response.data.message);
    }
  };
  return (
    <div
      className="flex justify-center items-center h-screen flex-col bg-black  gap-3 bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form className="flex justify-center items-center flex-col h-screen gap-5 md:w-1/5 w-full p-5">
        {error ? (
          <h1 className="text-red-500 text-xl font-medium p-2 uppercase">
            {error}
          </h1>
        ) : (
          <h1></h1>
        )}

        <input
          type="email"
          placeholder="email"
          class="block w-full py-3 px-2  text-lg text-gray-900 border border-gray-300 rounded-lg focus:border-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Link
          onClick={handelSendOtp}
          className="text-white bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-orange-300  shadow-lg shadow-orange-500/50 font-medium rounded-md text-xl px-5 py-2.5 text-center me-2 mb-2   my-5 "
        >
          {otpStatus ? "resend" : "GET-OTP"}
        </Link>

        {otpStatus && (
          <>
            <input
              type="number"
              placeholder="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              class="block w-full p-4  text-xl text-gray-900 border border-gray-300 rounded-lg focus:border-none"
            />
            <Link
              onClick={verifyOtp}
              className="text-white bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-orange-300  shadow-lg shadow-orange-500/50 font-medium rounded-md text-xl px-5 py-2.5 text-center me-2 mb-2   mt-5 "
            >
              submit
            </Link>
          </>
        )}
      </form>
    </div>
  );
};

export default Auth;
