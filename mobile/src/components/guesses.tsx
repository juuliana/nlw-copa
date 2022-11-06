import { useState, useEffect } from "react";
import { FlatList, useToast } from "native-base";

import { api } from "../services/api";
import { Loading } from ".";
import { Game, GameProps } from "./game";

interface Props {
  pollId: string;
}

export function Guesses({ pollId }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [games, setGames] = useState<GameProps[]>([]);
  const [firstTeamPoints, setFirstTeamPoints] = useState("");
  const [secondTeamPoints, setSecondTeamPoints] = useState("");

  const toast = useToast();

  useEffect(() => {
    fetchGames();
  }, [pollId]);

  async function fetchGames() {
    try {
      setIsLoading(true);

      const { data } = await api.get(`/polls/${pollId}/games`);

      setGames(data.games);
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

  if (isLoading) {
    return <Loading />;
  }

  return (
    <FlatList
      data={games}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Game
          key={item.id}
          data={item}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
          onGuessConfirm={() => {}}
        />
      )}
    />
  );
}
