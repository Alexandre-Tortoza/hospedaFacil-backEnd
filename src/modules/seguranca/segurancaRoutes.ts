import { FastifyInstance } from "fastify";
import { segurancaController } from "./segurancaController";
import z from "zod";
import { LoginUsuario, CadastrarUsuario } from "./seguranca.dto";

export async function segurancaRoutes(app: FastifyInstance) {
  app.post(
    "/registrar-usuario",
    {
      schema: {
        body: z.object({
          nomeCompleto: z
            .string()
            .min(3, "O nome completo deve ter pelo menos 3 caracteres."),
          cpf: z.string(),
          tipoUsuario: z.enum(["0", "1"]).transform(Number),
          dataNascimento: z
            .string()
            .regex(
              /^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|1\d|2\d|3[01])$/,
              "Formato inválido. Use 'YYYY-MM-DD'."
            ),
          email: z.string().email("E-mail inválido."),
          senha: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
          telefone: z.string().min(10).max(20).optional(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const response = await segurancaController.postCadastrarUsuario(
          request.body as CadastrarUsuario
        );
        return reply.status(response.statusCode).send(response);
      } catch (error) {
        console.error("Erro na rota de cadastro:", error);
        return reply.status(500).send({ error: "Erro interno no servidor" });
      }
    }
  );

  app.post(
    "/login",
    {
      schema: {
        body: z.object({
          email: z.string().email("E-mail inválido."),
          senha: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
        }),
      },
    },
    async (request, reply) => {
      try {
        const response = await segurancaController.postLoginUsuario(
          request.body as LoginUsuario,
          app
        );
        return reply.status(response.statusCode).send(response);
      } catch (error) {
        console.error("Erro na rota de login:", error);
        return reply.status(500).send({ error: "Erro interno no servidor" });
      }
    }
  );
}
