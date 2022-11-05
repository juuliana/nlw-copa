import { useContext } from "react";

import { authContext, AuthContextProps } from "../contexts/auth-context";

export function useAuth(): AuthContextProps {
  return useContext(authContext);
}
