import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  combineReducers,
  configureStore,
  isRejectedWithValue,
  Tuple,
} from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";
import { setupListeners } from "@reduxjs/toolkit/query";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { api } from "@/api/api";
import { reduxStorage } from "../storage";
import authSlice from "../auth/auth-slice";

const persistConfig = {
  key: "root",
  version: 1,
  storage: reduxStorage,
  blacklist: ["auth", "clientApi", "_persist"],
};

// export const rtkQueryErrorLogger =
//   (_api: any) =>
//   (next: (arg0: any) => any) =>
//   (action: { error: any; payload: any }) => {
//     if (isRejectedWithValue(action)) {
//       console.log("isRejectWithValue", action.error, action.payload);
//       alert(JSON.stringify(action));
//     }
//     return next(action);
//   };

const reducer = combineReducers({
  auth: authSlice,
  [api.reducerPath]: api.reducer,
});

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REGISTER, REHYDRATE, PAUSE, PERSIST, PURGE],
      },
    }).concat(api.middleware);
  },
  enhancers: (getDefaultEnhancers) => {
    if (__DEV__) {
      const reactotoron =
        require("../../reactotronConfig/ReactotronConfig").default;
      return getDefaultEnhancers().concat(reactotoron.createEnhancer());
    }
    return getDefaultEnhancers();
  },
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
