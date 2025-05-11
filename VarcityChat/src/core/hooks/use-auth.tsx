import { api } from "@/api/api";
import { logout as logoutUser } from "../auth/auth-slice";
import { useAppDispatch, useAppSelector } from "../store/store";
import { useRealm } from "@realm/react";
import { useSocket } from "@/context/useSocketContext";
import { useMemo } from "react";
import { getItem } from "../storage";
import { IsFirstLaunchKey } from "@/types/user";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const realm = useRealm();
  const { disconnect } = useSocket();
  const { token, user, isAuthenticated, isLoading } = useAppSelector(
    (state) => state.auth
  );
  const logout = () => {
    realm.write(() => {
      realm.delete(realm.objects("Message"));
    });
    // Disconnect from socket
    disconnect();
    dispatch(logoutUser());
    dispatch(api.util.resetApiState());
  };

  const isFirstLaunch = useMemo(() => {
    return getItem(IsFirstLaunchKey) === null;
  }, []);

  return {
    isAuthenticated: token !== null && user !== null && isAuthenticated,
    isFirstLaunch,
    isLoading,
    token,
    user,
    logout,
  };
};
