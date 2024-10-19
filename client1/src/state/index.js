import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: localStorage.getItem('mode') || "dark", // Load mode from local storage
  user: null,
  token: localStorage.getItem('token') || null, // Load token from local storage
  posts: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
      localStorage.setItem('mode', state.mode); // Save mode to local storage
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token); // Save token to local storage
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token'); // Remove token from local storage
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("user friends non exist");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },
  },
});

export const { setMode, setLogin, setPost, setPosts, setFriends, setLogout } = authSlice.actions;
export default authSlice.reducer;
