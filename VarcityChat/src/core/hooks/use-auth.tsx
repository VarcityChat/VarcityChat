import { api } from "@/api/api";
import { logout as logoutUser } from "../auth/auth-slice";
import { useAppDispatch, useAppSelector } from "../store/store";
import { useRealm } from "@realm/react";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const realm = useRealm();
  const { token, user, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );
  const logout = () => {
    realm.write(() => {
      realm.delete(realm.objects("Message"));
    });
    dispatch(logoutUser());
    dispatch(api.util.resetApiState());
  };

  return {
    isAuthenticated: token != null && user != null && isAuthenticated,
    token,
    user,
    logout,
  };
};
