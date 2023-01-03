import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import instance from '../../axios';


export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const { data } = await instance.get('/posts');
  return data;
});

export const fetchTags = createAsyncThunk('tags/fetchPosts', async () => {
  const { data } = await instance.get('/tags');
  return data;
});

export const fetchRemovePost = createAsyncThunk('posts/fetchRemovePost', async (id) => {
  instance.delete(`/posts/${id}`);
});

const initialState = {
  posts: {
    items: [],
    status: 'loading'
  },
  tags: {
    items: [],
    status: 'loading'
  },
};

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducer: {},
  extraReducers: {
    // get posts
    [fetchPosts.pending]: (state) => {
      state.posts.items = [];
      state.posts.status = 'loading';
    },
    [fetchPosts.fulfilled]: (state, action) => {
      state.posts.items = action.payload;
      state.posts.status = 'loaded';
    },
    [fetchPosts.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = 'error';
    },

    // get tags
    [fetchTags.pending]: (state) => {
      state.tags.items = [];
      state.tags.status = 'loading';
    },
    [fetchTags.fulfilled]: (state, action) => {
      state.tags.items = action.payload;
      state.tags.status = 'loaded';
    },
    [fetchTags.rejected]: (state) => {
      state.tags.items = [];
      state.tags.status = 'error';
    },

    // delete post 
    [fetchRemovePost.pending]: (state, action) => {
      state.posts.items = state.posts.items.filter((obj) => obj._id !== action.meta.arg);
    },
  }
})

export const postsReducer = postSlice.reducer;