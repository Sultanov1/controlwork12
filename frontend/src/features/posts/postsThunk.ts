import axiosApi from "../../axiosApi.ts";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {PostsDetails} from "../../types.ts";

export const fetchPosts = createAsyncThunk<PostsDetails[], string | undefined>(
  'cocktails/fetchCocktails',
  async (user) => {
    const url = user ? `/posts?user=${user}` : '/posts';
    const response = await axiosApi.get<PostsDetails[]>(url);
    return response.data;
  }
);