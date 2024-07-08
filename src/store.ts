import { configureStore, createSlice } from "@reduxjs/toolkit";

interface TimerState {
  timeLeft: number;
}

const initialState: TimerState = {
  timeLeft: 100,
};

export const timerSlice = createSlice({
  name: "timer",
  initialState: initialState,
  reducers: {
    decreaseTimeLeft: (state) => {
      state.timeLeft -= 1;
    },
  },
});

export const { decreaseTimeLeft } = timerSlice.actions;

export const store = configureStore({
  reducer: {
    timer: timerSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
