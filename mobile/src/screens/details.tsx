import { useState, useEffect } from "react";
import { Share } from "react-native";
import { useRoute } from "@react-navigation/native";
import { HStack, useToast, VStack } from "native-base";

import {
  EmptyMyPollList,
  Guesses,
  Header,
  Loading,
  Option,
  PollCardProps,
  PollHeader,
} from "../components";
import { api } from "../services/api";

interface DetailsParams {
  id: string;
}

type OptionSelected = "guesses" | "ranking";

export function Details() {
  const [isLoading, setIsLoading] = useState(true);
  const [poll, setPoll] = useState({} as PollCardProps);
  const [optionSelected, setOptionSelected] =
    useState<OptionSelected>("guesses");

  const toast = useToast();

  const route = useRoute();
  const { id } = route.params as DetailsParams;

  useEffect(() => {
    fetchPollDetails();
  }, [id]);

  async function fetchPollDetails() {
    try {
      setIsLoading(true);

      const { data } = await api.get(`/polls/${id}`);

      setPoll(data.poll);
    } catch (error) {
      console.error(error);

      toast.show({
        title: "Não foi possível carregar o bolão.",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCodeShare() {
    await Share.share({
      message: poll.code,
    });
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header
        title={poll.title}
        showBackButton
        showShareButton
        onShare={handleCodeShare}
      />

      {poll._count?.participants > 0 ? (
        <VStack px={5} flex={1}>
          <PollHeader data={poll} />

          <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
            <Option
              title="Seus palpites"
              isSelected={optionSelected === "guesses"}
              onPress={() => setOptionSelected("guesses")}
            />
            <Option
              title="Ranking do grupo"
              isSelected={optionSelected === "ranking"}
              onPress={() => setOptionSelected("ranking")}
            />
          </HStack>

          <Guesses pollId={poll.id} />
        </VStack>
      ) : (
        <EmptyMyPollList code={poll.code} />
      )}
    </VStack>
  );
}
