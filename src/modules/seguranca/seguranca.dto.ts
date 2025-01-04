export interface CadastrarUsuario {
  id: string;
  nomeCompleto: string;
  cpf: string;
  tipoUsuario: 0 | 1;
  dataNascimento: string;
  email: string;
  senha: string;
  telefone?: string;
}
export interface LoginUsuario {
  email: string;
  senha: string;
}
