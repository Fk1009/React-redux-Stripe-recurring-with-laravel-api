import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PLANS_API } from '../../Constants';

export const fetchUserPlans = createAsyncThunk(
  'users/fetchPlans',
  async ({ token }, thunkAPI) => {
    try {
      const response = await fetch(
        PLANS_API,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      let data = await response.json();
      //console.log('data', data, response.status);

      if (response.status === 200) {
        return data; 
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      //console.log('Error', e.response.data);
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);


export const planListSlice = createSlice({
  name: 'plans',
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
    [fetchUserPlans.pending]: (state) => {
      state.isFetching = true;
    },
    [fetchUserPlans.fulfilled]: (state, { payload }) => {
      state.isFetching = false;
      state.isSuccess = true;
      state.data = payload.data;
    },
    [fetchUserPlans.rejected]: (state) => {
      //console.log('fetchUserPlans');
      state.isFetching = false;
      state.isError = true;
    },
  },
});

export const { clearState } = planListSlice.actions;

export const planSelector = (state) => state.plans;
