import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Heading, useToast, VStack } from "native-base";

import { api } from "../services/api";
import { Input, Button, Header } from "../components";

export function Find() {
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState("");

  const toast = useToast();
  const { navigate } = useNavigation();

  async function handleJoinPoll() {
    try {
      setIsLoading(true);

      if (!code.trim()) {
        return toast.show({
          title: "Informe o código",
          placement: "top",
          bgColor: "red.500",
        });
      }

      await api.post("/polls/join", { code });

      toast.show({
        title: "Você entrou no bolão com sucesso.",
        placement: "top",
        bgColor: "green.500",
      });

      navigate("polls");
    } catch (error) {
      console.error(error);
      setIsLoading(false);

      if (error.response?.data?.message) {
        return toast.show({
          title: error.response?.data?.message,
          placement: "top",
          bgColor: "red.500",
        });
      }

      toast.show({
        title: "Não foi possível encontrar o bolão.",
        placement: "top",
        bgColor: "red.500",
      });
    }
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Buscar código" showBackButton />

      <VStack mt={8} mx={5} alignItems="center">
        <Heading
          fontFamily="heading"
          color="white"
          fontSize="xl"
          mb={8}
          textAlign="center"
        >
          Encontre um bolão através de {"\n"} seu código único
        </Heading>

        <Input
          mb={2}
          placeholder="Qual o código do bolão?"
          onChangeText={setCode}
          value={code}
          autoCapitalize="characters"
        />

        <Button
          title="BUSCAR BOLÃO"
          isLoading={isLoading}
          onPress={handleJoinPoll}
        />
      </VStack>
    </VStack>
  );
}
