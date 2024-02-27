import React from 'react'
import bg from "../assets/bg.jpg"; // Import the image
import { useNavigate } from "react-router-dom";
const HomeScreen = () => {
  const navigate = useNavigate()
  return (
<div className="flex justify-center items-center h-screen flex-col bg-black  gap-3 bg-cover bg-center" style={{backgroundImage: `url(${bg})`}}>

<div className="flex  items-center justify-center ">
<h1 className=" font-extrabold md:text-8xl text-6xl text-orange-500  text-center uppercase ">Campus Omegal</h1>
</div>
<h5 className="font-medium md:text-4xl text-sm text-gray-600 ">Video stream  comingsoon...</h5>
<div>

<button
  className="text-white bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-orange-300  shadow-lg shadow-orange-500/50 font-bold rounded-md text-xl px-5 py-2.5 text-center me-2 mb-2 mt-5  "
  onClick={() => navigate("/chatroom")}
>
  chat
</button>

  {/*<button type="button" class="text-white bg-gray-900 font-bold rounded-md text-xl px-5 py-2.5 text-center me-2 mb-2   mt-5 " disabled>Video</button>*/}
</div>

</div>
  )
}

export default HomeScreen
