import React,{ useEffect,Fragment,useState} from "react";
import NavBar from "../layouts/NavBar";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addSubscription, clearState } from "./CheckoutSlice";
import { fetchUserPlanById } from "./FetchUserPlanByIdSlice";
import { checkoutState } from "./CheckoutSlice";
import { fetchUserPlanByIdState } from "./FetchUserPlanByIdSlice";
import { otpState } from "./OtpSlice";
import { fetchUserBytoken } from "../User/UserSlice";
import { userSelector } from "../User/UserSlice";
import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone";
import {
  CARD_CVV_REQ,
  CARD_INVALID,
  CARD_MONTH_INVALID,
  CARD_MONTH_REQ,
  CARD_NUMBER_REQ,
  CARD_YEAR_INVALID,
  CARD_YEAR_REQ,
  INVALID_CVV, 
  PHONE_REQ} from "../../Constants";
import OtpDialog from "./OtpDialog";
import { sendOtp, verifyOtp } from "./OtpSlice";
import { clearOtpState } from "./OtpSlice";

const validateCheckoutCard = (userData) => {
  const errors = {};
  if (!userData.card_number) {
    errors.card_number = CARD_NUMBER_REQ;
  } else if (
    !/^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/i.test(
      userData.card_number
    )
  ) {
    errors.card_number = CARD_INVALID;
  }

  if (!userData.exp_month) {
    errors.exp_month = CARD_MONTH_REQ;
  } else if (!/^(0?[1-9]|1[012])$/i.test(userData.exp_month)) {
    errors.exp_month = CARD_MONTH_INVALID;
  }

  if (!userData.exp_year) {
    errors.exp_year = CARD_YEAR_REQ;
  } else if (!/^20(1[1-9]|[2-9][0-9])$/i.test(userData.exp_year)) {
    errors.exp_year = CARD_YEAR_INVALID;
  }

  if (!userData.phone) {
    errors.phone = PHONE_REQ;
  }

  if (!userData.cvc) {
    errors.cvc = CARD_CVV_REQ;
  } else if (!/^[0-9]{3}$/i.test(userData.cvc)) {
    errors.cvc = INVALID_CVV;
  }

  return errors;
};

function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const { isFetching, isSuccess, isError, errorMessage } = useSelector(checkoutState);
  const stateForCheckout = useSelector(checkoutState);
  const stateForOtp = useSelector(otpState);
  const userInfo = useSelector(userSelector);
  const singlePlan = useSelector(fetchUserPlanByIdState);
  const [dialogOpen, setDialogOpen] = useState(false);
  let { plan_id } = useParams();

  const formik = useFormik({
    initialValues: {
      card_number: "",
      exp_month: "",
      exp_year: "",
      cvc: "",
    },

    validate: validateCheckoutCard,
    onSubmit: (values) => {
      if (token != "") {
        let params = {
          ...values,
          plan_id: plan_id,
          token: token,
        };
        dispatch(addSubscription(params));
     
      }
    },
  });

  useEffect(() => {
    if (stateForCheckout.isSuccess) {
      dispatch(clearState());
      navigate("/");
    }
    if (stateForCheckout.isError) {
      toast.error(errorMessage);
      dispatch(clearState());
    }
  }, [stateForCheckout]);

  

  useEffect(() => {
    if (token != null) {
    dispatch(
      fetchUserPlanById({
        token: localStorage.getItem("token"),
        planId: plan_id,
      })
    );
  }
  }, []);

  useEffect(() => {
    if (token != null) {
      dispatch(fetchUserBytoken({ token: token }));
    }
  }, []);

  const handleVerifyClick = (otp) => {
    // Implement your logic to verify the OTP here
    dispatch(
      verifyOtp({
        token: localStorage.getItem("token"),
        otp: otp,
      })
    );
    
  };

  useEffect(() => {
    if (stateForOtp.isSuccess == true) {
      toast.success(stateForOtp.data.message);
      setDialogOpen(false);
      dispatch(fetchUserBytoken({ token: token }));
      dispatch(clearOtpState());
    } 
    
    if  (stateForOtp.isError == true) {
      toast.error(stateForOtp.errorMessage);
      setDialogOpen(true);
     dispatch(clearOtpState());
    }
  }, [stateForOtp]);

  const handleOpenDialog = () => {
    setLoading(true);
    dispatch(
      sendOtp({
        token: localStorage.getItem("token"),
        phone: formik.values.phone,
      })
    ).then(() => {
      setLoading(false); // set loading state to false
      setDialogOpen(true);
      dispatch(clearOtpState());
    });
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <div className="container mx-auto">
      {isFetching ? (
        <div className="loading">
          <div className="loader"></div>
        </div>
      ) : (
        <Fragment>
          <NavBar />
          <div className="grid sm:px-10 lg:grid-cols-1 lg:px-20 xl:px-32">
            <div className="mt-12 bg-gray-50 px-4 pt-8 lg:mt-0">
              <p className="text-xl font-medium">Payment Details</p>
              <p className="text-gray-400">
                Complete your Subscription by providing your payment details.
              </p>

              <form onSubmit={formik.handleSubmit}>
                <div className="">
                  <label
                    for="card-holder"
                    className="mt-4 mb-2 block text-sm font-medium"
                  >
                    Card Holder(Optional)
                  </label>
                  <div className="relative ">
                    <input
                      className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm uppercase shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Your full name here"
                      type="text"
                      name="card_name"
                    />
                    <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <label
                    for="card-holder"
                    className="mt-4 mb-2 block text-sm font-medium"
                  >
                    Phone Number
                  </label>
                  <div className="relative ">
                    <input
                      className="w-full rounded-md border border-gray-200 px-4 py-3  text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="+91-xxxxxxxxxx"
                      type="numeric"
                      name="phone"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.phone && formik.errors.phone ? (
                      <span className="text-red-500 text-xs italic">
                        {formik.errors.phone}
                      </span>
                    ) : null}
                  </div>
                  <label
                    for="card-no"
                    className="mt-4 mb-2 block text-sm font-medium"
                  >
                    Card Details
                  </label>
                  <div className="flex">
                    <div className="relative w-7/12 flex-shrink-0">
                      <input
                        type="text"
                        id="card_number"
                        name="card_number"
                        className="w-full rounded-md border border-gray-200 px-2 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="xxxx-xxxx-xxxx-xxxx"
                        value={formik.values.card_number}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.card_number &&
                      formik.errors.card_number ? (
                        <span className="text-red-500 text-xs italic">
                          {formik.errors.card_number}
                        </span>
                      ) : null}

                      <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-2">
                        <svg
                          className="h-4 w-4 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <path d="M11 5.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1z" />
                          <path d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2zm13 2v5H1V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1zm-1 9H2a1 1 0 0 1-1-1v-1h14v1a1 1 0 0 1-1 1z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <input
                        type="text"
                        name="exp_month"
                        className="w-full rounded-md border border-gray-200 px-2 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="MM"
                        value={formik.values.exp_month}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.exp_month && formik.errors.exp_month ? (
                        <span className="text-red-500 text-xs italic">
                          {formik.errors.exp_month}
                        </span>
                      ) : null}
                    </div>
                    <div>
                      <input
                        type="text"
                        className="w-full rounded-md border border-gray-200 px-2 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="YYYY"
                        name="exp_year"
                        value={formik.values.exp_year}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.exp_year && formik.errors.exp_year ? (
                        <span className="text-red-500 text-xs italic">
                          {formik.errors.exp_year}
                        </span>
                      ) : null}
                    </div>
                    <div>
                      <input
                        type="text"
                        className="w-5/6 flex-shrink-0 rounded-md border border-gray-200 px-2 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="CVC"
                        name="cvc"
                        value={formik.values.cvc}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.cvc && formik.errors.cvc ? (
                        <span className="text-red-500 text-xs italic">
                          {formik.errors.cvc}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-6 border-t border-b py-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        Plan Name
                      </p>

                      <p className="font-semibold text-gray-900">
                        {singlePlan && singlePlan.data
                          ? singlePlan.data.name
                          : null}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        Plan Duration
                      </p>
                      <p className="font-semibold text-gray-900">
                        {singlePlan && singlePlan.data
                          ? singlePlan.data.interval
                          : null}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        Subtotal
                      </p>
                      <p className="font-semibold text-gray-900">
                        {singlePlan && singlePlan.data
                          ? singlePlan.data.currency
                          : null}
                        {singlePlan && singlePlan.data
                          ? singlePlan.data.price
                          : null}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">Total</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {singlePlan && singlePlan.data
                        ? singlePlan.data.currency
                        : null}
                      {singlePlan && singlePlan.data
                        ? singlePlan.data.price
                        : null}
                    </p>
                  </div>
                </div>

                {userInfo && userInfo.data ? (
                  userInfo.data.user ? (
                    userInfo.data.user.otp_verified == 1 ? (
                      <>
                        <CheckCircleTwoToneIcon
                          style={{ color: "green" }}
                        ></CheckCircleTwoToneIcon>{" "}
                        <span className="text-green-700 text-s italic">
                          Card Verified
                        </span>
                        <button
                          type="submit"
                          className="mt-4 mb-8 w-full rounded-md bg-gray-900 px-6 py-3 font-medium text-white"
                        >
                          Proceed To Buy Beneficiary Plan 
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        variant="contained"
                        color="primary"
                        onClick={handleOpenDialog}
                        className="mt-4 mb-8 w-full rounded-md bg-gray-900 px-6 py-3 font-medium text-white"
                      >
                        {loading ? (
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
                        ) : null}{" "}
                        Buy Beneficiary Plan
                      </button>
                    )
                  ) : null
                ) : null}
              </form>
            </div>
          </div>

          {/*open modal on click on buy plan  */}
          <OtpDialog
            loading={loading}
            open={dialogOpen}
            onClose={handleCloseDialog}
            onVerify={handleVerifyClick}
          />
        </Fragment>
      )}
    </div>
  );
}

export default Checkout;
