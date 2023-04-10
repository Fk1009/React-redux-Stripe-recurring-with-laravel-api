import { Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearState } from "../User/UserSlice";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const NavBar = () => {
  const onLogOut = () => {
    localStorage.removeItem("token");
    dispatch(clearState());
    navigate("/login");
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <Fragment>
      <nav>
        <div class="flex items-center justify-between px-4 py-2">
          <div class="flex items-center justify-start w-1/4">
            <a href="#">
              <span class="sr-only">Home</span>
              <span class="text-2xl font-semibold">
                <span class="text-indigo-500">Redux</span>
                {"Stripe-Recurring"}
              </span>
            </a>
          </div>

          <div class="items-center justify-center hidden w-1/2 lg:flex">
            <a
              href="#"
              class="px-4 py-2 text-base font-medium text-gray-400 transition-colors rounded-full hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-700"
            >
              <Link to="/home">Home</Link>
            
            </a>
            <a
              href="#"
              class="px-4 py-2 text-base font-medium text-gray-900 transition-colors rounded-full hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-700"
            >
              <Link to="/">Pricing</Link>
            </a>
            {/* <a
              href="#"
              class="px-4 py-2 text-base font-medium text-gray-400 transition-colors rounded-full hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-700"
            >
              Services
            </a> */}
            <a
              href="#"
              class="px-4 py-2 text-base font-medium text-gray-400 transition-colors rounded-full hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-700"
            >
               <Link to="/blog">Blog</Link>
              
            </a>
          </div>

          <div class="items-center justify-end hidden w-1/4 space-x-2 lg:flex">
            {localStorage.getItem("token") ? null : (
              <>
                <a
                  href='#'
                  class="px-4 py-2 text-base font-medium text-gray-400 transition-colors rounded-full hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <Link to="/login">Login</Link>
                  
                </a>
                <a
                  href="#"
                  class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-full shadow-sm whitespace-nowrap hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Link to="/signup">Register</Link>
                </a>
              </>
            ) }
            { localStorage.getItem("token") ? (
              <>
                <a
                  href="#"
                  class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-full shadow-sm whitespace-nowrap hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={onLogOut}
                >
                  Logout
                </a>
              </>
            ) : null}
          </div>
        </div>
      </nav>
    </Fragment>
  );
};

export default NavBar;
