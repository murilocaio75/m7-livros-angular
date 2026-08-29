// Os dois únicos estados possíveis. A seção 3 do enunciado declara
// `status: string`, mas um union type recusa "emprestrado" em tempo de
// compilação — e é o mesmo domínio que o STATUS_VALIDOS da API valida em
// tempo de execução. Desvio declarado no entregável.
export type StatusLivro = "disponivel" | "emprestado";

export interface Livro {
  id: number;
  titulo: string;
  autor: string;
  categoria: string;
  ano: number;
  status: StatusLivro;
  // Opcional na interface do enunciado. O livro 6 ("A Arte da Guerra") não tem
  // o campo no banco, de propósito: é ele que revela template mal escrito.
  descricao?: string;
}

// O que o formulário consegue coletar. O `id` é do servidor, então emitir um
// `Livro` completo do formulário seria mentira. Com `Omit`, acrescentar campo
// ao `Livro` amanhã propaga sozinho para cá.
export type NovoLivro = Omit<Livro, "id">;

// Rótulos para exibição. Mantidos junto do tipo para que acrescentar um estado
// novo quebre a compilação aqui, em vez de exibir o valor cru na tela.
export const ROTULO_STATUS: Record<StatusLivro, string> = {
  disponivel: "Disponível",
  emprestado: "Emprestado"
};
