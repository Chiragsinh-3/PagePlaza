import React from "react";
import "./styles/bookLoader.css"; // Make sure the path is correct for your project

const BookLoader = () => {
  return (
    <div className='fixed inset-0 z-50 h-full w-screen flex flex-col items-center justify-center bg-black  backdrop-blur-md'>
      <div className='loader'>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default BookLoader;
