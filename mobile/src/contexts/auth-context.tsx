import React, { createContext, useState, useEffect } from "react";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { GOOGLE_AUTH_ID } from "@env";

import { api } from "../services/api";

WebBrowser.maybeCompleteAuthSession();

interface UserProps {
  name: string;
  avatarUrl: string;
}

export interface AuthContextProps {
  user: UserProps;
  isUserLoading: boolean;
  signIn: () => Promise<void>;
}

export const authContext = createContext({} as AuthContextProps);

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState({} as UserProps);
  const [isUserLoading, setIsUserLoading] = useState(false);

  const [_, response, promptAsync] = Google.useAuthRequest({
    clientId: GOOGLE_AUTH_ID,
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    scopes: ["profile", "email"],
  });

  useEffect(() => {
    if (response?.type === "success" && response?.authentication?.accessToken) {
      signInWithGoogle(response.authentication.accessToken);
    }
  }, [response]);

  async function signInWithGoogle(access_token: string) {
    try {
      setIsUserLoading(true);

      const { data } = await api.post("/users", {
        access_token,
      });

      api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      const { data: userInfo } = await api.get("/me");
      setUser(userInfo.user);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUserLoading(false);
    }
  }

  async function signIn() {
    try {
      setIsUserLoading(true);

      await promptAsync();
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsUserLoading(false);
    }
  }

  return (
    <authContext.Provider value={{ signIn, user, isUserLoading }}>
      {children}
    </authContext.Provider>
  );
}
