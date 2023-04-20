import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { USER_LIST } from "../../Constants";

export const fetchUserList = createAsyncThunk(
  "users/fetchUserList",
  async ({ token }, thunkAPI) => {
    try {
      const response = await fetch(USER_LIST, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      let data = await response.json();
      //console.log('data', data, response.status);

      if (response.status === 200) {
        return data;
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      //console.log("Error", e.response.data);
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

export const userListSlice = createSlice({
  name: "userList",
  initialState: {
    isFetching: false,
    isSuccess: false,
    isError: false,
  },
  reducers: {
    clearState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isFetching = false;
      return state;
    },
  },
  extraReducers: {
    [fetchUserList.pending]: (state) => {
      state.isFetching = true;
    },
    [fetchUserList.fulfilled]: (state, { payload }) => {
      state.isFetching = false;
      state.isSuccess = true;
      state.data = payload.data;
    },
    [fetchUserList.rejected]: (state) => {
      state.isFetching = false;
      state.isError = true;
    },
  },
});

export const { clearState } = userListSlice.actions;

export const userListSelector = (state) => state.userList;
