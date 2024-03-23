import { createSlice } from "@reduxjs/toolkit";

export interface ILoading {
  loading: boolean;
}
const initialState: ILoading = {
  loading: false,
};

export const loadingSlice = createSlice({
  name: "Loading",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
