import { Component, input, output } from "@angular/core";
import { Livro } from "../../models/livro";
import { LivroCard } from "../livro-card/livro-card";

@Component({
  selector: "app-lista-livros",
  imports: [LivroCard],
  templateUrl: "./lista-livros.html",
  styleUrl: "./lista-livros.css"
})
export class ListaLivros {
  livros = input.required<Livro[]>();
  carregando = input(false);
  erro = input<string | null>(null);

  // Repassa para cima o que os cards emitem. A lista não sabe o que significa
  // "excluir" — só que o pedido veio de um card e precisa chegar na página.
  alternarStatus = output<Livro>();
  excluir = output<Livro>();
}
