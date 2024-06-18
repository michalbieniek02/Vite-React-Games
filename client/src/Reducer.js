import { createReducer } from "@reduxjs/toolkit";

const initialState = {};

export const userReducer = createReducer(initialState, builder => {
  builder
    .addCase('AddUser', (state, action) => {
      state.user = action.payload;
    });
});
