import { Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearState } from "../User/UserSlice";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { userSelector } from "../User/UserSlice";

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(userSelector);

  const onLogOut = () => {
    localStorage.removeItem("token");
    dispatch(clearState());
    navigate("/login");
  };
  
  return (
    <Fragment>
      <nav>
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center justify-start w-1/4">
            <a href="#">
              <span className="sr-only">Home</span>
              <span className="text-2xl font-semibold">
                <span className="text-indigo-500">Redux</span>
                {"Stripe-Recurring"}
              </span>
            </a>
          </div>

          <div className="items-center justify-center hidden w-1/2 lg:flex">
            <a
              href="#"
              className="px-4 py-2 text-base font-medium text-gray-400 transition-colors rounded-full hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-700"
            >
              <Link to="/home">Home</Link>
            </a>
            <a
              href="#"
              className="px-4 py-2 text-base font-medium text-gray-900 transition-colors rounded-full hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-700"
            >
              <Link to="/">Pricing</Link>
            </a>
            {/* <a
              href="#"
              className="px-4 py-2 text-base font-medium text-gray-400 transition-colors rounded-full hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-700"
            >
              Services
            </a> */}
            <a
              href="#"
              className="px-4 py-2 text-base font-medium text-gray-400 transition-colors rounded-full hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-700"
            >
              <Link to="/blog">Blog</Link>
            </a>
          </div>

          <div className="items-center justify-end hidden w-1/4 space-x-2 lg:flex">
            {localStorage.getItem("token") ? null : (
              <>
                <a
                  href="#"
                  className="px-4 py-2 text-base font-medium text-gray-400 transition-colors rounded-full hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <Link to="/login">Login</Link>
                </a>
                <a
                  href="#"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-full shadow-sm whitespace-nowrap hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Link to="/signup">Register</Link>
                </a>
              </>
            )}
            {localStorage.getItem("token") ? (
              <>
                <a
                  href="#"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-full shadow-sm whitespace-nowrap hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={onLogOut}
                >
                  Logout
                </a>
                {/* dropdown starts */}
                <div class="dropdown inline-block relative">
                  <button class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-full shadow-sm whitespace-nowrap hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <span class="mr-1">{user.email}</span>
                    <svg
                      class="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />{" "}
                    </svg>
                  </button>
                  <ul class="dropdown-menu absolute hidden text-gray-700 pt-1">
                    <li class="">
                      <a
                        class="rounded-t bg-gray-200 hover: bg-gray-200 py-2 px-4 block whitespace-no-wrap"
                        href="#"
                      >
                        <Link to="/profile">My Profile</Link>
                      </a>
                    </li>
                  </ul>
                </div>
                {/* dropdown ends */}
              </>
            ) : null}
          </div>
        </div>
      </nav>
    </Fragment>
  );
};

export default NavBar;
