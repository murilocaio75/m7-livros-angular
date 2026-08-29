import { Routes } from "@angular/router";
import { LivrosPage } from "./features/livros/pages/livros-page/livros-page";
import { LivroDetalhePage } from "./features/livros/pages/livro-detalhe-page/livro-detalhe-page";

// Seção 5 do enunciado: no mínimo /livros e /livros/:id.
export const routes: Routes = [
  { path: "", redirectTo: "livros", pathMatch: "full" },
  { path: "livros", component: LivrosPage },
  { path: "livros/:id", component: LivroDetalhePage },
  // Qualquer outra coisa volta para a lista, em vez de mostrar tela em branco.
  { path: "**", redirectTo: "livros" }
];
