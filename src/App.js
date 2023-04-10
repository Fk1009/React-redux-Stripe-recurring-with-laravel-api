import React from 'react';
import './App.css';
import { BrowserRouter as Router,Routes, Route, Link } from 'react-router-dom';
import Login from './features/User/Login';
import Signup from './features/User/Signup';
import Dashboard from './features/User/Dashboard';
import Protected from './helpers/Protected';
import Checkout from './features/checkout/Checkout';
import Blog from './components/Blog';
import Home from './components/Home';
import Profile from './components/Profile';


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
        <Route path="/login"  element={<Login/>}/>
        <Route path="/signup"  element={<Signup/>}/>
        <Route path="/blog"  element={<Blog/>}/>
        <Route path="/home"  element={<Home/>}/>
        {/* <Route path="/"  element={<Dashboard/>}/> */}
        <Route path="/" element={ <Protected cmp = {Dashboard} /> } />
        <Route path="/profile" element={ <Protected cmp = {Profile} /> } />
        <Route path="/checkout/:plan_id" element={ <Protected cmp = {Checkout} /> } />
        </Routes>
      </Router>
    </div>
  );
}


export default App;