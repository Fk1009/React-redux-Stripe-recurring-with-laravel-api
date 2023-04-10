import React from "react";
import { Link } from "react-router-dom";

function Plans(props) {
  return (
    <card class="rounded w-72 shadow-xl flex flex-col text-gray-200 ml-4">
      {/* <p class="font-semibold bg-white bg-opacity-20 rounded-t px-4 py-2">PRO</p> */}
      <div class="flex flex-row items-center pt-8 bg-white bg-opacity-10 pl-12 pr-10 gap-3">
        <div class="flex flex-row gap-1">
          <span class="text-base"> {props.plandata.currency} </span>
          <p class="text-5xl font-semibold">{props.plandata.price}</p>
        </div>
        <p class="font-light text-xs">{props.plandata.name}</p>
      </div>

      <div class="flex flex-row items-center justify-center bg-white bg-opacity-10 pt-5 pb-10">
        <p class="text-xs text-gray-300 border border-gray-50 border-opacity-20 rounded-full py-1 px-2">
          {props.plandata.currency}
          {props.plandata.price} billed in a {props.plandata.interval}
        </p>
      </div>

      <div class="grid grid-cols-12 bg-white bg-opacity-20 px-4 gap-y-3 pt-10">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <div class="col-span-11 text-sm flex items-center font-semibold pl-2">
          Unlimited items per workspace
        </div>

        <div class="col-span-12 h-[1px] bg-white bg-opacity-20"></div>

        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </div>

        <div class="col-span-11 text-sm flex items-center font-light pl-2">
          Everything in Starter
        </div>

        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <div class="col-span-11 text-sm flex items-center font-light pl-2">
          10+ free guests per file or folder
        </div>

        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <div class="col-span-11 text-sm flex items-center font-light pl-2">
          Priority support
        </div>

        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <div class="col-span-11 text-sm flex items-center font-light pl-2">
          Unlimited free viewers
        </div>

        <div class="col-span-12 mt-20 mb-5 text-gray-100">
          <button class="rounded hover:bg-teal-400 bg-teal-500 w-full py-3">
            
          <Link  to={`/checkout/${props.plandata.id}`} className="btn btn-primary btn-block p-2 shadow rounded-pill"> Choose your Plan</Link>
          </button>
        </div>
      </div>
    </card>
  );
}

export default Plans;
