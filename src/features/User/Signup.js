import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signupUser, userSelector, clearState } from './UserSlice';
import { useNavigate } from 'react-router-dom';
import NavBar from '../layouts/NavBar';
import toast from 'react-hot-toast';
import { useFormik } from 'formik';
import { NAME_REQ,MAX_LENGTH,EMAIL_REQ,EMAIL_INVALID,PASS_INVALID,PASS_REQ} from '../../Constants';


const validateRegisterUser = userData => {
  const errors = {};
  if (!userData.name) {
    errors.name = NAME_REQ;
  } else if (userData.name.length > 20) {
    errors.Name = MAX_LENGTH;
  }
  if (!userData.email) {
    errors.email = EMAIL_REQ;
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(userData.email)) {
    errors.email = EMAIL_INVALID;
  }

  if (!userData.password) {
    errors.password = PASS_REQ;
  } else if (!/^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8}$/i.test(userData.password)) {
    errors.password = PASS_INVALID;
  }

  if (!userData.c_password) {
    errors.c_password = PASS_REQ;
  } 
  return errors;
};


const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isFetching, isSuccess, isError, errorMessage } = useSelector(
    userSelector
  );



  const formik=useFormik({
    initialValues:{
      name:'',
      email:'',
      password:'',
      c_password:''
    },
  
    validate:validateRegisterUser,
    onSubmit:(data)=>{
      //console.log(data);
      dispatch(signupUser(data));
      
    }
  });

  useEffect(() => {
    return () => {
      dispatch(clearState());
    };
  }, []);

  useEffect(() => {
    if (isSuccess) {
      dispatch(clearState());
      navigate('/');
    }

    if (isError) {
        console.log(errorMessage);
      toast.error(errorMessage);
      dispatch(clearState());
    }
  }, [isSuccess, isError]);

  return (
    <Fragment>
      <NavBar/>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign Up to your account
          </h2>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form
              className="space-y-6"
              onSubmit={formik.handleSubmit}
              method="POST"
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange} onBlur={formik.handleBlur}
                    autoComplete="name"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                    {formik.touched.name &&
                      formik.errors.name ? (
                        <span className="text-red-500 text-xs italic">
                          {formik.errors.name}
                        </span>
                      ) : null}
                </div>
              </div>
              <div>
                {/* <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label> */}
                <div className="mt-1">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formik.values.email}
                    onChange={formik.handleChange} onBlur={formik.handleBlur}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  {formik.touched.email &&
                      formik.errors.email ? (
                        <span className="text-red-500 text-xs italic">
                          {formik.errors.email}
                        </span>
                      ) : null}
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formik.values.password}
                    onChange={formik.handleChange} onBlur={formik.handleBlur}
                    autoComplete="current-password"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  {formik.touched.password &&
                      formik.errors.password ? (
                        <span className="text-red-500 text-xs italic">
                          {formik.errors.password}
                        </span>
                      ) : null}
                </div>
              </div>

              <div>
                <label
                  htmlFor="c_password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <div className="mt-1">
                  <input
                    id="c_password"
                    name="c_password"
                    type="password"
                    value={formik.values.c_password}
                    onChange={formik.handleChange} onBlur={formik.handleBlur}
                    autoComplete="current-password"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                   {formik.touched.c_password &&
                      formik.errors.c_password ? (
                        <span className="text-red-500 text-xs italic">
                          {formik.errors.c_password}
                        </span>
                      ) : null}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {isFetching ? (
                    <Fragment>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          stroke-width="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>

                      <p>Signing up</p>
                    </Fragment>
                  ) : (
                    <p> Sign up</p>
                  )}
                </button>
              </div>
            </form>
            <div className="mt-6">
              <div className="relative">
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or <Link to="/login"> Login</Link>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Signup;