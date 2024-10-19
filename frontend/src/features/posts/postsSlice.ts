import {PostsDetails} from "../../types";
import {createSlice} from "@reduxjs/toolkit";
import {fetchPosts} from "./postsThunk.ts";
import {RootState} from "../../app/store.ts";

interface PostsState {
  posts: PostsDetails[];
  fetchLoading: boolean;
}

const initialState: PostsState = {
  posts: [],
  fetchLoading: false,
};

export const PostsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPosts.pending, (state) => {
      state.fetchLoading = true;
    });

    builder.addCase(fetchPosts.fulfilled, (state, { payload: posts }) => {
      state.fetchLoading = false;
      state.posts = posts;
    });

    builder.addCase(fetchPosts.rejected, (state) => {
      state.fetchLoading = false;
    });
  }
});

export const postsReducer = PostsSlice.reducer;
export const selectPosts = (state: RootState) => state.posts.posts;
export const selectLoading = (state: RootState) => state.posts.fetchLoading;
