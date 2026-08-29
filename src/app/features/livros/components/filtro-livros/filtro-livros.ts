import { Component, input, output } from "@angular/core";
import { StatusLivro } from "../../models/livro";

@Component({
  selector: "app-filtro-livros",
  imports: [],
  templateUrl: "./filtro-livros.html",
  styleUrl: "./filtro-livros.css"
})
export class FiltroLivros {
  pesquisa = input.required<string>();
  categoria = input.required<string>();
  status = input.required<StatusLivro | "todas">();

  // As categorias existentes vêm da página, derivadas dos livros carregados.
  // Uma lista fixa aqui ficaria errada assim que alguém cadastrasse categoria nova.
  categorias = input.required<string[]>();

  pesquisaChange = output<string>();
  categoriaChange = output<string>();
  statusChange = output<StatusLivro | "todas">();

  alterarPesquisa(event: Event): void {
    this.pesquisaChange.emit((event.target as HTMLInputElement).value);
  }

  alterarCategoria(event: Event): void {
    this.categoriaChange.emit((event.target as HTMLSelectElement).value);
  }

  alterarStatus(event: Event): void {
    const valor = (event.target as HTMLSelectElement).value as
      | StatusLivro
      | "todas";

    this.statusChange.emit(valor);
  }
}
