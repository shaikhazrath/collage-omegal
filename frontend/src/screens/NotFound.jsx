import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-5xl mb-4">404 - Page Not Found</h1>
      <p className="text-lg mb-8">
        Uh oh! Looks like you've reached a mysterious place.
      </p>
      <p className="text-lg mb-8">
        Don't worry, the unicorns are working hard to bring this page back!
      </p>
      <Link
        to="/"
        className="text-lg bg-white text-black px-6 py-3 rounded-md font-semibold hover:bg-gray-300 transition duration-300"
      >
        Return Home
      </Link>
    </div>
  );
};

export default NotFound;
