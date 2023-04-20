import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { SINGLE_PLAN_API } from '../../Constants';

export const fetchUserPlanById = createAsyncThunk(
  'users/fetchPlan',
  async ({ token,planId }, thunkAPI) => {
    try {
      const response = await fetch(
        SINGLE_PLAN_API+'/'+ planId,
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

export const fetchUserPlanByIdSlice = createSlice({
  name: 'fetchUserPlanById',
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
    [fetchUserPlanById.pending]: (state) => {
      state.isFetching = true;
    },
    [fetchUserPlanById.fulfilled]: (state, { payload }) => {
      state.isFetching = false;
      state.isSuccess = true;
      state.data = payload;
    },
    [fetchUserPlanById.rejected]: (state) => {

      state.isFetching = false;
      state.isError = true;
      
    },

  },
});

export const { clearState } = fetchUserPlanByIdSlice.actions;
export const fetchUserPlanByIdState = (state) => state.fetchUserPlanById;
