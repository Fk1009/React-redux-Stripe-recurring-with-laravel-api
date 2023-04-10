import { Fragment, useState } from "react";
import NavBar from "../features/layouts/NavBar";
import { fetchUserBytoken } from "../features/User/UserSlice";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userSelector } from "../features/User/UserSlice";

const Profile = () => {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const { isFetching, isError } = useSelector(userSelector);
  const user = useSelector(userSelector);

  useEffect(() => {
    if (token != null) {
      dispatch(fetchUserBytoken({ token: token }));
    }
  }, []);

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
            <div className="bg-gray-100">
              <div className="container mx-auto my-5 p-5">
                <div className="md:flex no-wrap md:-mx-2 ">
                  <div className="w-full md:w-3/12 md:mx-2">
                    <div className="bg-white p-3 border-t-4 border-green-400">
                      
                      <h1 className="text-gray-900 font-bold text-xl leading-8 my-1">
                        {user && user.name}
                      </h1>
                      <h3 className="text-gray-600 font-lg text-semibold leading-6">
                        Owner at Her Company Inc.
                      </h3>
                      <p className="text-sm text-gray-500 hover:text-gray-600 leading-6">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Reprehenderit, eligendi dolorum sequi illum qui unde
                        aspernatur non deserunt
                      </p>
                      <ul className="bg-gray-100 text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 mt-3 divide-y rounded shadow-sm">
                        <li className="flex items-center py-3">
                          <span>Status</span>
                          <span className="ml-auto">
                            <span className="bg-green-500 py-1 px-2 rounded text-white text-sm">
                              Active
                            </span>
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="my-4"></div>
                  </div>

                  <div className="w-full md:w-9/12 mx-2 h-64">
                    <div className="bg-white p-3 shadow-sm rounded-sm">
                      <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
                        <span clas="text-green-500">
                          <svg
                            className="h-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </span>
                        <span className="tracking-wide">About</span>
                      </div>
                      <div className="text-gray-700">
                        <div className="grid md:grid-cols-2 text-sm">
                          <div className="grid grid-cols-2">
                            <div className="px-4 py-2 font-semibold">Name</div>
                            <div className="px-4 py-2">{user && user.name}</div>
                          </div>

                          <div className="grid grid-cols-2">
                            <div className="px-4 py-2 font-semibold">
                              Email.
                            </div>
                            <div className="px-4 py-2">
                              <a
                                className="text-blue-800"
                                href={user && user.email}
                              >
                                {user && user.email}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="my-4"></div>
                  </div>
                </div>
              </div>
            </div>
          </Fragment>
        )}
      </div>
    </>
  );
};

export default Profile;
