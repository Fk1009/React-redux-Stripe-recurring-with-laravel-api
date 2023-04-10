import { configureStore } from '@reduxjs/toolkit';
import { userSlice } from '../features/User/UserSlice';
import { checkoutSlice } from '../features/checkout/CheckoutSlice';
export default configureStore({
  reducer: {
    user: userSlice.reducer,
    checkout: checkoutSlice.reducer,
  },
});