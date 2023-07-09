import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentChannel: null,
  loading: false,
  error: false,
};

export const channelSlice = createSlice({
  name: "channel",
  initialState,

  reducers: {
    loadStart: (state) => {
      state.loading = true;
    },
    loadSuccess: (state, action) => {
      state.loading = false;
      state.currentChannel = action.payload;
    },
    loadFailure: (state) => {
      state.loading = false;
      state.error = true;
    },
    subscribed: (state) => {
      state.currentChannel.subscribers += 1;
    },
    unsubscribed: (state) => {
      state.currentChannel.subscribers -= 1;
    },
  },
});

export const { loadStart, loadSuccess, loadFailure, subscribed, unsubscribed } =
  channelSlice.actions;

export default channelSlice.reducer;
