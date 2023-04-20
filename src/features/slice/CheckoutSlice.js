import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { SUBSCRIPTION_API } from '../../Constants';

export const addSubscription = createAsyncThunk(
  'users/addSubscription',
  async ({ token, card_number, exp_month, exp_year,cvc,plan_id }, thunkAPI) => {
    try {
      const response = await fetch(
        SUBSCRIPTION_API,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            card_number,
            exp_month,
            exp_year,
            cvc,
            plan_id,
          }),
        }
      );
      let data = await response.json();
      //console.log('data', data, response.status);
      if (response.status === 200) {
        return data
      } else {
       // console.log('data', data, response.status);
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      //console.log('Error', e.response.data);
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);



export const checkoutSlice = createSlice({
  name: 'checkout',
  initialState: {
    isFetching: false,
    isSuccess: false,
    isError: false,
    errorMessage: '',
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
    [addSubscription.pending]: (state) => {
      state.isFetching = true;
    },
    [addSubscription.fulfilled]: (state, { payload }) => {
      state.isFetching = false;
      state.isSuccess = true;
      state.data = payload;
    },
    [addSubscription.rejected]: (state, { payload }) => {
      //console.log(payload.message)
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    },
  },
});

export const { clearState } = checkoutSlice.actions;

export const checkoutState = (state) => state.checkout;
