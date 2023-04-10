import React from "react";
import NavBar from "../layouts/NavBar";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addSubscription, clearState } from "./CheckoutSlice";
import { useParams } from "react-router";
import { useEffect } from "react";
import { fetchUserPlanById } from "./CheckoutSlice";
import { checkoutState } from "./CheckoutSlice";
import { Fragment } from "react";
import { useFormik } from "formik";
import toast from 'react-hot-toast';
import { CARD_CVV_REQ, CARD_INVALID, CARD_MONTH_INVALID, CARD_MONTH_REQ, CARD_NUMBER_REQ, CARD_YEAR_INVALID, CARD_YEAR_REQ } from "../../Constants";

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

  if (!userData.cvc) {
    errors.cvc = CARD_CVV_REQ;
  }

  return errors;
};

function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isFetching, isSuccess, isError, errorMessage,successMesssage } = useSelector(
    checkoutState
  );
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
      let params = {
        ...values,
        plan_id: plan_id,
        token: localStorage.getItem("token"),
       
      }
      dispatch(
        addSubscription(params) 
      );
      if (isSuccess) {
        dispatch(clearState());
       navigate('/');
      }
      if (isError) {
        toast.error(errorMessage);
        dispatch(clearState());
      }
    },
  });

  useEffect(() => {
    dispatch(
      fetchUserPlanById({
        token: localStorage.getItem("token"),
        planId: plan_id,
      })
    );
  }, []);

  // useEffect(() => {
  //   if (isError) {
  //     dispatch(clearState());
  //     navigate("/login");
  //   }
  // }, [isError]);

  const singlePlan = useSelector(checkoutState);

  return (
    <div className="container mx-auto">
      {isFetching ? (
        <div class="loading">
          <div class="loader"></div>
        </div>
      ) : (
        <Fragment>
          <NavBar />
          <div class="grid sm:px-10 lg:grid-cols-1 lg:px-20 xl:px-32">
            <div class="mt-12 bg-gray-50 px-4 pt-8 lg:mt-0">
              <p class="text-xl font-medium">Payment Details</p>
              <p class="text-gray-400">
                Complete your Subscription by providing your payment details.
              </p>

              <form onSubmit={formik.handleSubmit}>
                <div class="">
                  <label
                    for="card-holder"
                    class="mt-4 mb-2 block text-sm font-medium"
                  >
                    Card Holder(Optional)
                  </label>
                  <div class="relative">
                    <input
                      class="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm uppercase shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Your full name here"
                      type="text"
                      name="card_name"
                    />
                    <div class="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 text-gray-400"
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
                    for="card-no"
                    class="mt-4 mb-2 block text-sm font-medium"
                  >
                    Card Details
                  </label>
                  <div class="flex">
                    <div class="relative w-7/12 flex-shrink-0">
                      <input
                        type="text"
                        id="card_number"
                        name="card_number"
                        class="w-full rounded-md border border-gray-200 px-2 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="xxxx-xxxx-xxxx-xxxx"
                        value={formik.values.card_number}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.card_number &&
                      formik.errors.card_number ? (
                        <span class="text-red-500 text-xs italic">
                          {formik.errors.card_number}
                        </span>
                      ) : null}

                      <div class="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                        <svg
                          class="h-4 w-4 text-gray-400"
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
                    <input
                      type="text"
                      name="exp_month"
                      class="w-full rounded-md border border-gray-200 px-2 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="MM"
                      value={formik.values.exp_month}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.exp_month && formik.errors.exp_month ? (
                      <span class="text-red-500 text-xs italic">
                        {formik.errors.exp_month}
                      </span>
                    ) : null}
                    <input
                      type="text"
                      class="w-full rounded-md border border-gray-200 px-2 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="YYYY"
                      name="exp_year"
                      value={formik.values.exp_year}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.exp_year && formik.errors.exp_year ? (
                      <span class="text-red-500 text-xs italic">
                        {formik.errors.exp_year}
                      </span>
                    ) : null}
                    <input
                      type="text"
                      class="w-1/6 flex-shrink-0 rounded-md border border-gray-200 px-2 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="CVC"
                      name="cvc"
                      value={formik.values.cvc}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.cvc && formik.errors.cvc ? (
                      <span class="text-red-500 text-xs italic">{formik.errors.cvc}</span>
                    ) : null}
                  </div>

                  <div class="mt-6 border-t border-b py-2">
                    <div class="flex items-center justify-between">
                      <p class="text-sm font-medium text-gray-900">Plan Name</p>

                      <p class="font-semibold text-gray-900">
                        {singlePlan && singlePlan.data
                          ? singlePlan.data.name
                          : null}
                      </p>
                    </div>
                    <div class="flex items-center justify-between">
                      <p class="text-sm font-medium text-gray-900">
                        Plan Duration
                      </p>
                      <p class="font-semibold text-gray-900">
                        {singlePlan && singlePlan.data
                          ? singlePlan.data.interval
                          : null}
                      </p>
                    </div>
                    <div class="flex items-center justify-between">
                      <p class="text-sm font-medium text-gray-900">Subtotal</p>
                      <p class="font-semibold text-gray-900">
                        {singlePlan && singlePlan.data
                          ? singlePlan.data.currency
                          : null}
                        {singlePlan && singlePlan.data
                          ? singlePlan.data.price
                          : null}
                      </p>
                    </div>
                  </div>
                  <div class="mt-6 flex items-center justify-between">
                    <p class="text-sm font-medium text-gray-900">Total</p>
                    <p class="text-2xl font-semibold text-gray-900">
                      {singlePlan && singlePlan.data
                        ? singlePlan.data.currency
                        : null}
                      {singlePlan && singlePlan.data
                        ? singlePlan.data.price
                        : null}
                    </p>
                  </div>
                </div>
                <button
                  type="submit"
                  class="mt-4 mb-8 w-full rounded-md bg-gray-900 px-6 py-3 font-medium text-white"
                >
                  Buy Beneficiary Plan
                </button>
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
}

export default Checkout;