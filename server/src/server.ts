import Fastify from "fastify";
import jwt from "@fastify/jwt";
import cors from "@fastify/cors";

import {
  pollRoutes,
  userRoutes,
  guessRoutes,
  gameRoutes,
  authRoutes,
} from "./routes";

async function bootstrap() {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(cors, {
    origin: true,
  });

  await fastify.register(jwt, {
    secret: "nlwcopa",
  });

  await fastify.register(authRoutes);
  await fastify.register(gameRoutes);
  await fastify.register(guessRoutes);
  await fastify.register(pollRoutes);
  await fastify.register(userRoutes);

  await fastify.listen({ port: 3333 /*host: "0.0.0.0"*/ });
}

bootstrap();
