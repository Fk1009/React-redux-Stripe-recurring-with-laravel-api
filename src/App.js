import React from 'react';
import './App.css';
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Dashboard from './components/Plan/PlanPricing';
import Protected from './helpers/Protected';
import Checkout from './components/checkout/Checkout';
import Blog from './components/Blog';
import Home from './components/Home';
import Profile from './components/User/Profile';
import Users from './components/User/UserList';
import NotFound from './components/NotFound';

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
        <Route path="/Users"  element={<Protected cmp = {Users} />}/>
        <Route path="/" element={ <Protected cmp = {Dashboard} /> } />
        <Route path="/profile" element={ <Protected cmp = {Profile} /> } />
        <Route path="/checkout/:plan_id" element={ <Protected cmp = {Checkout} /> } />
        <Route path='*' element={<NotFound />}/>
        </Routes>
      </Router>
    </div>
  );
}


export default App;