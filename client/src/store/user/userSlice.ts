import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ICurrentUserInfo {
  __v: number;
  _id: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICurrentUser {
  currentUser: ICurrentUserInfo | null;
}

const initialState: ICurrentUser = {
  currentUser: null,
};

export const userSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    signInUser: (state, action: PayloadAction<ICurrentUserInfo | null>) => {
      state.currentUser = action.payload;
    },
    signOutUser: (state) => {
      state.currentUser = null;
    },
  },
});

export const { signInUser, signOutUser } = userSlice.actions;
export default userSlice.reducer;
