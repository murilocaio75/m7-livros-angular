import { Component, OnInit, computed, inject, signal } from "@angular/core";
import { FiltroLivros } from "../../components/filtro-livros/filtro-livros";
import { FormularioLivro } from "../../components/formulario-livro/formulario-livro";
import { ListaLivros } from "../../components/lista-livros/lista-livros";
import { Livro, NovoLivro, StatusLivro } from "../../models/livro";
import { LivrosService } from "../../services/livros.service";

@Component({
  selector: "app-livros-page",
  imports: [FiltroLivros, FormularioLivro, ListaLivros],
  templateUrl: "./livros-page.html",
  styleUrl: "./livros-page.css"
})
export class LivrosPage implements OnInit {
  private readonly livrosService = inject(LivrosService);

  readonly livros = signal<Livro[]>([]);
  readonly carregando = signal(false);
  readonly erro = signal<string | null>(null);

  readonly pesquisa = signal("");
  readonly filtroCategoria = signal<string>("todas");
  readonly filtroStatus = signal<StatusLivro | "todas">("todas");

  readonly mostrarFormulario = signal(false);

  // Derivadas dos livros carregados, ordenadas. Set remove as repeticoes:
  // "Tecnologia" aparece em dois livros e deve virar uma opcao so.
  readonly categorias = computed(() =>
    [...new Set(this.livros().map(livro => livro.categoria))].sort()
  );

  // O filtro e client-side: a API devolve tudo e a filtragem e reativa. Com 6
  // livros o custo e nulo, e e isto que exercita a comunicacao entre os
  // componentes exigida pela secao 4.
  readonly livrosFiltrados = computed(() => {
    const termo = this.pesquisa().trim().toLowerCase();
    const categoria = this.filtroCategoria();
    const status = this.filtroStatus();

    return this.livros().filter(livro => {
      const correspondeTexto =
        termo === "" ||
        livro.titulo.toLowerCase().includes(termo) ||
        livro.autor.toLowerCase().includes(termo);

      const correspondeCategoria =
        categoria === "todas" || livro.categoria === categoria;

      const correspondeStatus = status === "todas" || livro.status === status;

      return correspondeTexto && correspondeCategoria && correspondeStatus;
    });
  });

  readonly totalVisivel = computed(() => this.livrosFiltrados().length);

  ngOnInit(): void {
    void this.carregarLivros();
  }

  async carregarLivros(): Promise<void> {
    this.carregando.set(true);
    this.erro.set(null);

    try {
      this.livros.set(await this.livrosService.listar());
    } catch {
      // Secao 10: "falha ao acessar a API". A mensagem vai para a lista, que
      // ja sabe exibi-la; a pagina nao precisa de um bloco de erro proprio.
      this.erro.set(
        "Não foi possível carregar os livros. Verifique se a API está no ar."
      );
    } finally {
      this.carregando.set(false);
    }
  }

  atualizarPesquisa(valor: string): void {
    this.pesquisa.set(valor);
  }

  atualizarCategoria(valor: string): void {
    this.filtroCategoria.set(valor);
  }

  atualizarStatus(valor: StatusLivro | "todas"): void {
    this.filtroStatus.set(valor);
  }

  alternarFormulario(): void {
    this.mostrarFormulario.update(valor => !valor);
  }

  async adicionarLivro(dados: NovoLivro): Promise<void> {
    try {
      await this.livrosService.adicionar(dados);
      this.mostrarFormulario.set(false);

      // Rele a lista do servidor em vez de empurrar no signal. Custa uma
      // requisicao, mas o que aparece na tela PROVA que o dado foi gravado.
      await this.carregarLivros();
    } catch {
      this.erro.set("Não foi possível cadastrar o livro.");
    }
  }

  async alternarStatus(livro: Livro): Promise<void> {
    const novo: StatusLivro =
      livro.status === "disponivel" ? "emprestado" : "disponivel";

    try {
      await this.livrosService.alterarStatus(livro.id, novo);
      await this.carregarLivros();
    } catch {
      this.erro.set("Não foi possível alterar o estado do livro.");
    }
  }

  async excluirLivro(livro: Livro): Promise<void> {
    if (!confirm('Excluir "' + livro.titulo + '"?')) {
      return;
    }

    try {
      await this.livrosService.excluir(livro.id);
      await this.carregarLivros();
    } catch {
      this.erro.set("Não foi possível excluir o livro.");
    }
  }
}
