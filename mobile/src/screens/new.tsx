import { useState } from "react";
import { Heading, Text, VStack, useToast } from "native-base";

import Logo from "../assets/logo.svg";
import { api } from "../services/api";
import { Input, Button, Header } from "../components";

export function New() {
  const [title, setTitle] = useState("");
  const [isLoading, setisLoading] = useState(false);

  const toast = useToast();

  async function handleCreate() {
    if (!title.trim()) {
      toast.show({
        title: "Informe um nome para o seu bolão",
        placement: "top",
        bgColor: "red.500",
      });

      return;
    }

    try {
      setisLoading(true);

      await api.post("/polls", {
        title: title.toUpperCase(),
      });

      toast.show({
        title: "Bolão criado com sucesso.",
        placement: "top",
        bgColor: "green.500",
      });

      setTitle("");
    } catch (error) {
      toast.show({
        title: "Não foi possível criar o bolão.",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setisLoading(false);
    }
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Novo bolão" />

      <VStack mt={8} mx={5} alignItems="center">
        <Logo />

        <Heading
          fontFamily="heading"
          color="white"
          fontSize="xl"
          my={8}
          textAlign="center"
        >
          Crie seu bolão da copa {"\n"} e compartilhe entre amigos!
        </Heading>

        <Input
          mb={2}
          placeholder="Qual nome do seu bolão?"
          value={title}
          onChangeText={setTitle}
        />

        <Button
          title="CRIAR MEU BOLÃO"
          onPress={handleCreate}
          isLoading={isLoading}
        />

        <Text color="gray.200" fontSize="sm" textAlign="center" px={10} mt={4}>
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas.
        </Text>
      </VStack>
    </VStack>
  );
}
