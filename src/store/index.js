import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import updateSlice from "./updateSlice";
import categorySlice from "./categorySlice";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    categories: categorySlice.reducer,
    updates: updateSlice.reducer,
  },
});

export default store;
