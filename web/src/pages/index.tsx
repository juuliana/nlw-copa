import Image from "next/image";
import { FormEvent, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import { api } from "../lib/axios";
import logoImg from "../assets/logo.svg";
import usersAvatar from "../assets/users-avatar-example.png";
import iconCheckImg from "../assets/icon-check.svg";
import appPreviewImg from "../assets/app-nlw-copa-preview.png";
import { success, error } from "../components/alerts";

interface HomeProps {
  pollCount: number;
  userCount: number;
  guessCount: number;
}

export default function Home(props: HomeProps) {
  const [pollTitle, setPollTitle] = useState("");

  async function createPoll(event: FormEvent) {
    event.preventDefault();

    try {
      const { data } = await api.post("/polls", {
        title: pollTitle,
      });

      const { code } = data;

      await navigator.clipboard.writeText(code);

      success({
        message:
          "Bolão criado com sucesso, o código foi copiado para a área de transferência!",
      });

      setPollTitle("");
    } catch (err) {
      error({ message: "Falha ao criar o botão, tente novamente." });
    }
  }

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">
      <main>
        <ToastContainer />

        <Image src={logoImg} alt="NLW Copa" />

        <h1 className="mt-8 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="mt-5 flex items-center gap-2">
          <Image src={usersAvatar} alt="Avatares" />

          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{props.userCount}</span> pessoas
            já estão usando
          </strong>
        </div>

        <form onSubmit={createPoll} className="mt-5 flex gap-2">
          <input
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
            type="text"
            required
            value={pollTitle}
            placeholder="Qual nome do seu bolão?"
            onChange={(event) => setPollTitle(event.target.value)}
          />

          <button
            className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700"
            type="submit"
          >
            Criar meu bolão
          </button>
        </form>

        <p className=" mt-4 text-sm text-gray-300 leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas!
        </p>

        <div className="mt-5 pt-5 border-t border-gray-600 flex justify-between text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="" />

            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.pollCount}</span>
              <span> Bolões criados</span>
            </div>
          </div>

          <div className="w-px h-14 bg-gray-600" />

          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="" />

            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.guessCount}</span>
              <span> Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image
        src={appPreviewImg}
        alt="Dois celulares com o APP do NLW Copa"
        quality={100}
      />
    </div>
  );
}

export const getServerSideProps = async () => {
  const [pollCountResponse, guessCountResponse, userCountResponse] =
    await Promise.all([
      api.get("/polls/count"),
      api.get("/guesses/count"),
      api.get("/users/count"),
    ]);

  return {
    props: {
      pollCount: pollCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    },
  };
};
