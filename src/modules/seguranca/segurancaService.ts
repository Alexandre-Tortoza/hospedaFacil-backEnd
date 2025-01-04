import bcrypt from "bcryptjs";
import { segurancaModel } from "./segurancaModel";
import { CadastrarUsuario, LoginUsuario } from "./seguranca.dto";
import { randomUUID } from "crypto";
import { FastifyInstance } from "fastify";

export class segurancaService {
  static async postCadastrarUsuario(body: CadastrarUsuario) {
    try {
      body.id = randomUUID();
      body.senha = await bcrypt.hash(body.senha, 10);
      body.email = body.email.toLocaleLowerCase();

      const result = await segurancaModel.postCadastrarUsuario(body);
      return result;
    } catch (error) {
      console.error("Erro no serviço de segurança:", error);
      return { success: false, error: "Erro interno no serviço" };
    }
  }

  static async postLoginUsuario(body: LoginUsuario, app: FastifyInstance) {
    body.email = body.email.toLocaleLowerCase();
    try {
      const result = await segurancaModel.postLoginUsuario(body.email);

      if (!result.success || !result.senhaHash) {
        return { success: false, error: "Usuário não cadastrado no sistema" };
      }

      const senhaCorreta = await bcrypt.compare(body.senha, result.senhaHash);
      if (!senhaCorreta) {
        return { success: false, error: "Senha incorreta" };
      }

      const token = app.jwt.sign(
        { email: body.email, nome: "seu Super Nome" },
        { expiresIn: "1h" }
      );

      return { success: true, message: "Login realizado com sucesso", token };
    } catch (error) {
      console.error("Erro no serviço de segurança:", error);
      return { success: false, error: "Erro interno no serviço" };
    }
  }
}
