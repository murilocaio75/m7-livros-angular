import { Component, OnInit, inject, signal } from "@angular/core";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { Livro, ROTULO_STATUS, StatusLivro } from "../../models/livro";
import { LivrosService } from "../../services/livros.service";

@Component({
  selector: "app-livro-detalhe-page",
  imports: [RouterLink],
  templateUrl: "./livro-detalhe-page.html",
  styleUrl: "./livro-detalhe-page.css"
})
export class LivroDetalhePage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly livrosService = inject(LivrosService);

  readonly livro = signal<Livro | undefined>(undefined);
  readonly carregando = signal(true);
  readonly erro = signal<string | null>(null);

  // Exposto para o template poder traduzir o status sem repetir o mapa.
  readonly rotulos = ROTULO_STATUS;

  ngOnInit(): void {
    void this.carregar();
  }

  private async carregar(): Promise<void> {
    const id = Number(this.route.snapshot.paramMap.get("id"));

    // Regressao encontrada na Aula 07, corrigida aqui de nascenca:
    // /livros/abc vira Number("abc") = NaN, a API responde 400, e o
    // buscarPorId so converte 404 em undefined. Sem esta guarda o 400 subiria
    // como rejeicao nao tratada e a pagina ficaria presa em "Carregando...".
    if (!Number.isFinite(id)) {
      this.carregando.set(false);
      return;
    }

    try {
      this.livro.set(await this.livrosService.buscarPorId(id));
    } catch {
      this.erro.set("Não foi possível carregar o livro.");
    } finally {
      this.carregando.set(false);
    }
  }

  async alternarStatus(): Promise<void> {
    const atual = this.livro();

    if (!atual) {
      return;
    }

    const novo: StatusLivro =
      atual.status === "disponivel" ? "emprestado" : "disponivel";

    try {
      // O PUT devolve o documento ja alterado, entao nao e preciso reler.
      this.livro.set(await this.livrosService.alterarStatus(atual.id, novo));
    } catch {
      this.erro.set("Não foi possível alterar o estado do livro.");
    }
  }

  async excluir(): Promise<void> {
    const atual = this.livro();

    if (!atual || !confirm('Excluir "' + atual.titulo + '"?')) {
      return;
    }

    try {
      await this.livrosService.excluir(atual.id);
      // Depois de excluir nao ha detalhe para mostrar: volta para a lista.
      await this.router.navigate(["/livros"]);
    } catch {
      this.erro.set("Não foi possível excluir o livro.");
    }
  }
}
