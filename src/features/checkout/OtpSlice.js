import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { SEND_OTP_API, VERIFY_OTP_API } from '../../Constants';


export const sendOtp = createAsyncThunk(
  'users/sendOtp',
  async ({ token, phone }, thunkAPI) => {
    try {
      const response = await fetch(
        SEND_OTP_API,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone,
          }),
        }
      );
      let data = await response.json();
      console.log('data', data, response.status);
      if (response.status === 200) {
        return data
      } else {
        console.log('data', data, response.status);
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      console.log('Error', e.response.data);
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'users/verifyOtp',
  async ({ token, otp }, thunkAPI) => {
    try {
      const response = await fetch(
        VERIFY_OTP_API,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            otp,
          }),
        }
      );
      let data = await response.json();
      console.log('data', data, response.status);
      if (response.status === 200) {
        return data
      } else {
        console.log('data', data, response.status);
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      console.log('Error', e.response.data);
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);



export const otpSlice = createSlice({
  name: 'otp',
  initialState: {
    isFetching: false,
    isSuccess: false,
    isError: false,
    errorMessage: '',
  },
  reducers: {
    clearOtpState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isFetching = false;
      return state;
    },
  },
  extraReducers: {
    [sendOtp.pending]: (state) => {
      state.isFetching = true;
    },
    [sendOtp.fulfilled]: (state, { payload }) => {
      state.isFetching = false;
      state.isSuccess = true;
      state.data = payload;
    },
    [sendOtp.rejected]: (state, { payload }) => {
      console.log(payload.message)
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    },
    [verifyOtp.pending]: (state) => {
      state.isFetching = true;
    },
    [verifyOtp.fulfilled]: (state, { payload }) => {
      state.isFetching = false;
      state.isSuccess = true;
      state.data = payload;
    },
    [verifyOtp.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    },
  },
});

export const { clearOtpState } = otpSlice.actions;

export const otpState = (state) => state.otp;
