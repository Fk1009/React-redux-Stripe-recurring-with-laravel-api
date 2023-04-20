import { configureStore } from '@reduxjs/toolkit';
import { userSlice } from '../features/slice/UserSlice';
import { checkoutSlice } from '../features/slice/CheckoutSlice';
import { userListSlice } from '../features/slice/UserListSlice';
import { otpSlice } from '../features/slice/OtpSlice';
import { fetchUserPlanByIdSlice } from '../features/slice/FetchUserPlanByIdSlice';
import { planListSlice } from '../features/slice/PlanListSlice';

export default configureStore({
  reducer: {
    user: userSlice.reducer,
    checkout: checkoutSlice.reducer,
    userList: userListSlice.reducer,
    otp:otpSlice.reducer,
    fetchUserPlanById:fetchUserPlanByIdSlice.reducer,
    plans:planListSlice.reducer
  },
});