import { useCallback, useState } from "react";
import { Octicons } from "@expo/vector-icons";
import { VStack, Icon, useToast, FlatList } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";

import { api } from "../services/api";
import {
  Button,
  Header,
  PollCard,
  Loading,
  PollCardProps,
  EmptyPollList,
} from "../components";

export function Polls() {
  const [polls, setPolls] = useState<PollCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { navigate } = useNavigation();
  const toast = useToast();

  useFocusEffect(
    useCallback(() => {
      fetchPolls();
    }, [])
  );

  async function fetchPolls() {
    try {
      setIsLoading(true);
      const { data } = await api.get("/polls");

      setPolls(data.polls);
    } catch (error) {
      toast.show({
        title: "Não foi possível carregar os bolões.",
        placement: "top",
        bgColor: "red.500",
      });

      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Meus bolões" />

      <VStack
        mt={6}
        mx={5}
        borderBottomWidth={1}
        borderBottomColor="gray.600"
        pb={4}
        mb={4}
      >
        <Button
          title="BUSCAR BOLÃO POR CÓDIGO"
          leftIcon={
            <Icon as={Octicons} name="search" color="black" size="md" />
          }
          onPress={() => navigate("find")}
        />
      </VStack>

      {isLoading && <Loading />}

      <FlatList
        data={polls}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PollCard data={item} />}
        ListEmptyComponent={() => <EmptyPollList />}
        _contentContainerStyle={{ pb: 10 }}
        px={5}
      />
    </VStack>
  );
}
