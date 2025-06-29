import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import userReducer from "./slice/userSlice";
import { api } from "./api";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PURGE,
  PERSIST,
  REGISTER,
} from "redux-persist";

const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

// Persist configuration for user
const userPersistConfig = {
  key: "user",
  storage,
  whitelist: ["user", "isEmailVerified", "isLoggedin"],
};

// wrap reducers with 'persist config'
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);
export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer, //rtk query
    user: persistedUserReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware),
});
setupListeners(store.dispatch);

// create a persister
export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
