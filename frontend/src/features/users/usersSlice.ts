import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import {fetchOneUser, googleLogin, login, register} from './usersThunk';
import {GlobalError, UserDetails, ValidationError} from "../../types";

interface UsersState {
  user: UserDetails | null;
  registerLoading: boolean;
  registerError: ValidationError | null;
  loginLoading: boolean;
  loginError: GlobalError | null;
  oneUser: UserDetails | null;
  fetchOneUserLoading: boolean;
}

const initialState: UsersState = {
  user: null,
  registerLoading: false,
  registerError: null,
  loginLoading: false,
  loginError: null,
  oneUser: null,
  fetchOneUserLoading: false,
};

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    unsetUser: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(register.pending, (state) => {
      state.registerLoading = true;
      state.registerError = null;
    });

    builder.addCase(register.fulfilled, (state, { payload: userResponse }) => {
      state.registerLoading = false;
      state.user = userResponse.user;
    });

    builder.addCase(register.rejected, (state, { payload: error }) => {
      state.registerLoading = false;
      state.registerError = error || null;
    });

    builder.addCase(login.pending, (state) => {
      state.loginLoading = true;
      state.loginError = null;
    });

    builder.addCase(login.fulfilled, (state, { payload: userResponse }) => {
      state.loginLoading = false;
      state.user = userResponse.user;
    });

    builder.addCase(login.rejected, (state, { payload: error }) => {
      state.loginLoading = false;
      state.loginError = error || null;
    });

    builder.addCase(googleLogin.pending, (state) => {
      state.loginLoading = true;
    });
    builder.addCase(googleLogin.fulfilled, (state, { payload: userResponse }) => {
      state.loginLoading = false;
      state.user = userResponse;
    });

    builder.addCase(googleLogin.rejected, (state, { payload: error }) => {
      state.loginLoading = false;

      state.loginError = error || null;
    });

    builder.addCase(fetchOneUser.pending, (state) => {
      state.fetchOneUserLoading = true;
    });

    builder.addCase(fetchOneUser.fulfilled, (state, action) => {
      state.fetchOneUserLoading = false;
      state.oneUser = action.payload;
    });

    builder.addCase(fetchOneUser.rejected, (state) => {
      state.fetchOneUserLoading = false;
    });
  },
});

export const usersReducer = usersSlice.reducer;
export const { unsetUser } = usersSlice.actions;
export const selectUser = (state: RootState) => state.users.user;
export const selectRegisterLoading = (state: RootState) => state.users.registerLoading;
export const selectRegisterError = (state: RootState) => state.users.registerError;
export const selectLoginLoading = (state: RootState) => state.users.loginLoading;
export const selectLoginError = (state: RootState) => state.users.loginError;
export const selectOneUser = (state: RootState) => state.users.oneUser;
