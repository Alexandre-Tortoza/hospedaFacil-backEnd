import { segurancaService } from "./segurancaService";
import { CadastrarUsuario, LoginUsuario } from "./seguranca.dto";
import formatResponse from "../../utils/responseFormatter";
import { FastifyInstance } from "fastify";

export class segurancaController {
  static async postCadastrarUsuario(body: CadastrarUsuario) {
    const result = await segurancaService.postCadastrarUsuario(body);

    if (result.success) {
      return formatResponse(201, "Usuário cadastrado com sucesso!", {});
    } else {
      return formatResponse(500, result.error || "Erro desconhecido", {});
    }
  }

  static async postLoginUsuario(body: LoginUsuario, app: FastifyInstance) {
    const result = await segurancaService.postLoginUsuario(body, app);

    console.log(result);

    if (result.success) {
      return formatResponse(200, "Login efetuado com sucesso!", {
        JWT: result.token,
      });
    } else {
      return formatResponse(401, result.error || "Erro desconhecido", {});
    }
  }
}
