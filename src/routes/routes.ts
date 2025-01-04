import { FastifyInstance } from "fastify";
import { fastifyTypedInstance } from "../utils/types";

import { segurancaRoutes } from "../modules/seguranca/segurancaRoutes";

export async function routes(app: fastifyTypedInstance) {
  app.register(segurancaRoutes, { prefix: "/seguranca" });
}
