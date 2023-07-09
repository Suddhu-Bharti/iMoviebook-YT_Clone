import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentComments: [],
};

export const commentSlice = createSlice({
  name: "comments",
  initialState,

  reducers: {
    commentFetchSuccess: (state, action) => {
      state.currentComments = action.payload;
    },
    addComment: (state, action) => {
      state.currentComments.push(action.payload);
    },
    deleteComment: (state, action) => {
      state.currentComments.splice(
        state.currentComments.findIndex(
          (comment) => comment._id === action.payload
        ),
        1
      );
    },
  },
});

export const { commentFetchSuccess, addComment, deleteComment } =
  commentSlice.actions;

export default commentSlice.reducer;
