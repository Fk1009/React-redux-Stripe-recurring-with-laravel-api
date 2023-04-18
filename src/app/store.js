import { configureStore } from '@reduxjs/toolkit';
import { userSlice } from '../features/User/UserSlice';
import { checkoutSlice } from '../features/checkout/CheckoutSlice';
import { userListSlice } from '../features/User/UserListSlice';
import { otpSlice } from '../features/checkout/OtpSlice';
import { fetchUserPlanByIdSlice } from '../features/checkout/FetchUserPlanByIdSlice';
export default configureStore({
  reducer: {
    user: userSlice.reducer,
    checkout: checkoutSlice.reducer,
    userList: userListSlice.reducer,
    otp:otpSlice.reducer,
    fetchUserPlanById:fetchUserPlanByIdSlice.reducer
  },
});