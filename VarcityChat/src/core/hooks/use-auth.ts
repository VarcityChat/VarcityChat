import { logout as logoutUser } from "../auth/auth-slice";
import { useAppDispatch, useAppSelector } from "../store/store";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { token, user, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  const logout = () => dispatch(logoutUser());

  return {
    isAuthenticated: token != null && user != null && isAuthenticated,
    token,
    user,
    logout,
  };
};
