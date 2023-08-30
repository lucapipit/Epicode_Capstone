import React from 'react';
import img from "../assets/notFound.jpg";

const ErrorPage = () => {
  return (
    <div className='d-flex justify-content-center'>
        <img src={img} alt="" style={{width: "50%"}}/>
    </div>
  )
}

export default ErrorPage