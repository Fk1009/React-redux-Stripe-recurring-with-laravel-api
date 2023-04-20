import React, { useEffect, Fragment, useState } from "react";
import NavBar from "../../components/layouts/NavBar";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addSubscription, clearState } from "../../features/slice/CheckoutSlice";
import { fetchUserPlanById } from "../../features/slice/FetchUserPlanByIdSlice";
import { checkoutState } from "../../features/slice/CheckoutSlice";
import { fetchUserPlanByIdState } from "../../features/slice/FetchUserPlanByIdSlice";
import { otpState } from "../../features/slice/OtpSlice";
import { fetchUserBytoken } from "../../features/slice/UserSlice";
import { userSelector } from "../../features/slice/UserSlice";
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
  PHONE_REQ,
} from "../../Constants";
import OtpDialog from "./OtpDialog";
import { sendOtp, verifyOtp } from "../../features/slice/OtpSlice";
import { clearOtpState } from "../../features/slice/OtpSlice";

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
  const { isFetching, errorMessage } = useSelector(checkoutState);
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
      phone: "",
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
      toast.success(stateForCheckout.data.message);
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

    if (stateForOtp.isError == true) {
      toast.error(stateForOtp.errorMessage);
      setDialogOpen(true);
      dispatch(clearOtpState());
    }
  }, [stateForOtp]);

  const handleOpenOtpDialog = () => {
    if (formik.values.phone == "") {
      toast.error(PHONE_REQ);
      return false;
    } else {
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
    }
  };

  const handleCloseOtpDialog = () => {
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
                    htmlFor="card-holder"
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
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <label
                    htmlFor="card-holder"
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
                    htmlFor="card-no"
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
                      {formik.touched.card_number &&
                      formik.errors.card_number ? (
                        <span className="text-red-500 text-xs italic">
                          {formik.errors.card_number}
                        </span>
                      ) : null}
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
                          className="mt-4 mb-8 w-full rounded-md bg-green-900 px-6 py-3 font-medium text-white"
                        >
                          Proceed To Buy Beneficiary Plan
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          variant="contained"
                          color="primary"
                          class=" mt-4 mb-8 w-full rounded-md bg-gray-900 px-6 py-3 font-medium  text-white bg-gray-900 items-center"
                          onClick={handleOpenOtpDialog}
                        >
                          {loading ? (
                            <svg
                              aria-hidden="true"
                              role="status"
                              class="inline w-6 h-6 mr-3 text-white animate-spin"
                              viewBox="0 0 100 101"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="#E5E7EB"
                              />
                              <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentColor"
                              />
                            </svg>
                          ) : null}{" "}
                          Buy Beneficiary Plan
                        </button>
                      </>
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
            onClose={handleCloseOtpDialog}
            onVerify={handleVerifyClick}
          />
        </Fragment>
      )}
    </div>
  );
}

export default Checkout;
