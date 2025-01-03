import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import {
  validatorCompiler,
  serializerCompiler,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import jwt from "@fastify/jwt";
import dotenv from "dotenv";
// import { routes } from "./routes/routes";

dotenv.config();

const app = fastify();

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  console.error("❌ A secret key não definido");
  process.exit(1);
}

app.register(jwt, {
  secret: jwtSecret,
});

app.decorate("authenticate", async function (request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({ error: "Token inválido" });
  }
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, { origin: "*" });

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Hospeda Fácil PI",
      description: "API para a Solução Hospeda Fácil",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
  routePrefix: "/swagger",
});

// app.register(routes);

export default app;
