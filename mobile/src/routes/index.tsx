import React from "react";
import { Box } from "native-base";
import { NavigationContainer } from "@react-navigation/native";

import { SignIn } from "../screens";
import { useAuth } from "../hooks/use-auth";

import { AppRoutes } from "./app.routes";

export function Routes() {
  const { user } = useAuth();

  return (
    <Box flex={1} bg="gray.900">
      <NavigationContainer>
        {!user.name ? <SignIn /> : <AppRoutes />}
      </NavigationContainer>
    </Box>
  );
}
