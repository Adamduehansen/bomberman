import {
  configureStore,
  createSlice,
  PayloadAction,
} from "https://esm.sh/@reduxjs/toolkit@2.2.6";

interface TimerState {
  timeLeft: number;
}

const timerInitialState: TimerState = {
  timeLeft: 100,
};

export const timerSlice = createSlice({
  name: "timer",
  initialState: timerInitialState,
  reducers: {
    decreaseTimeLeft: function (state) {
      state.timeLeft -= 1;
    },
  },
});

interface ScoreState {
  score: number;
}

const scoreInitialState: ScoreState = {
  score: 0,
};

export const scoreSlice = createSlice({
  name: "score",
  initialState: scoreInitialState,
  reducers: {
    addToScore: function (state, action: PayloadAction<number>) {
      state.score += action.payload;
    },
  },
});

export const { addToScore } = scoreSlice.actions;

export const { decreaseTimeLeft } = timerSlice.actions;

export const store = configureStore({
  reducer: {
    timer: timerSlice.reducer,
    score: scoreSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
