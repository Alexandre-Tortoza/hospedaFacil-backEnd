import { error } from "console";
import { sql } from "../../config/db";
import { CadastrarUsuario, LoginUsuario } from "./seguranca.dto";

export class segurancaModel {
  static async verificarUsuarioExistente(email: string, cpf: string) {
    try {
      const result = await sql`
        SELECT id FROM usuarios WHERE email = ${email} OR cpf = ${cpf};
      `;
      return result.length > 0;
    } catch (error) {
      console.error("Erro ao verificar usuário:", error);
      return false;
    }
  }

  static async postCadastrarUsuario(body: CadastrarUsuario) {
    try {
      const usuarioExiste = await this.verificarUsuarioExistente(
        body.email,
        body.cpf
      );

      if (usuarioExiste) {
        return { success: false, error: "Usuário já existe no sistema" };
      }

      await sql`
        INSERT INTO usuarios (
          id, 
          nomecompleto,
          cpf,
          tipousuario,
          nota,
          datanascimento, 
          email,
          senha,
          telefone,
          fotoperfil,
          datacriacao    
        )
        VALUES (
          ${body.id}, 
          ${body.nomeCompleto},
          ${body.cpf},
          ${body.tipoUsuario}, 
          DEFAULT, 
          ${body.dataNascimento}, 
          ${body.email}, 
          ${body.senha}, 
          ${body.telefone}, 
          DEFAULT, 
          ${new Date().toISOString().slice(0, 19).replace("T", " ")}
        );
      `;

      return { success: true, message: "Usuário cadastrado com sucesso" };
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      return { success: false, error: "Erro ao cadastrar usuário" };
    }
  }

  static async postLoginUsuario(email: string) {
    try {
      const queryResult =
        await sql`SELECT senha FROM usuarios WHERE email = ${email} LIMIT 1;`;

      if (queryResult.length > 0) {
        return {
          success: true,
          message: "Usuário encontrado no sistema",
          senhaHash: queryResult[0].senha,
        };
      }

      return {
        success: false,
        message: "Usuário não encontrado no sistema",
        senhaHash: null,
      };
    } catch (error) {
      console.error("Erro ao fazer login do usuário:", error);
      return {
        success: false,
        message: "Erro ao fazer login do usuário",
        senhaHash: null,
      };
    }
  }
}
