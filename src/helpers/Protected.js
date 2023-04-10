import React, { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const Protected = (props) => {
let Cmp = props.cmp
const navigate = useNavigate();

useEffect(()=>{
  if (!localStorage.getItem('token')) {
    navigate('/signup');
  } 
},[]);

  return (
    <div>
      <Cmp/>
    </div>
  )
}

export default Protected;
