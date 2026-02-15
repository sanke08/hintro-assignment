import {
  configureStore,
  Tuple,
  type ThunkMiddleware,
  type UnknownAction,
} from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    // add slices here
  },
  middleware: (
    getDefaultMiddleware: (arg0: {
      serializableCheck: false;
    }) => Tuple<[ThunkMiddleware<any, UnknownAction>]>
  ) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
