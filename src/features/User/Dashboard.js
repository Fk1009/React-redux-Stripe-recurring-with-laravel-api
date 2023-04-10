import React, { Fragment, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { userSelectorPlan, userSelector, fetchUserBytoken, clearState,fetchUserPlans } from './UserSlice';
import {RotatingLines} from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';
import NavBar from '../layouts/NavBar';
import Plans from './Plans';



const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isFetching, isError } = useSelector(userSelector);
  const token = localStorage.getItem('token');
  const user = useSelector(userSelector);
  const planData = user.data;
 
  useEffect(() => {
    if (token != null) {
    dispatch(fetchUserBytoken({ token: token }));
  }
  }, []);

  useEffect(() => {
    if (token != null) {
    dispatch(fetchUserPlans({ token: token }));
  }
 }, []);

  useEffect(() => {
    if (isError) {
      dispatch(clearState());
      navigate('/login');
    }
  }, [isError]);

  const onLogOut = () => {
    localStorage.removeItem('token');
    dispatch(clearState());
    navigate('/login');
  };
  
//console.log(user.data);
  return (
      <>
    <div className="container mx-auto">
      {isFetching ? (
       <div className="loading">
       <div className="loader"></div>
   </div>
      ) : (
        <Fragment>
          <NavBar />
          <div className="h-screen flex justify-center items-center bg-gradient-to-t from-indigo-600 via-indigo-700 to-indigo-700">
          {planData?.length>0 && planData.map((each,index)=>{
	   			return <Plans plandata={each} key={index} />
	   		})}

      </div>
        </Fragment>
      )}
    </div>
    </>
  );
};

export default Dashboard;