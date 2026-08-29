import { Component, computed, output, signal } from "@angular/core";
import { NovoLivro, StatusLivro } from "../../models/livro";

const ANO_ATUAL = new Date().getFullYear();

@Component({
  selector: "app-formulario-livro",
  imports: [],
  templateUrl: "./formulario-livro.html",
  styleUrl: "./formulario-livro.css"
})
export class FormularioLivro {
  readonly titulo = signal("");
  readonly autor = signal("");
  readonly categoria = signal("");
  readonly ano = signal<string>(String(ANO_ATUAL));
  readonly status = signal<StatusLivro>("disponivel");
  readonly descricao = signal("");

  // O ano fica como string porque é isso que o <input> entrega. Converter só
  // no envio evita o NaN intermediário enquanto a pessoa apaga o campo.
  readonly anoValido = computed(() => {
    const numero = Number(this.ano());

    return Number.isInteger(numero) && numero > 0 && numero <= ANO_ATUAL + 1;
  });

  // Os quatro campos que a API exige (400 sem eles). O botão desabilitado é a
  // primeira camada do "dados obrigatórios não preenchidos" da seção 10 —
  // a segunda é a validação do servidor, que continua valendo.
  readonly formValido = computed(
    () =>
      this.titulo().trim() !== "" &&
      this.autor().trim() !== "" &&
      this.categoria().trim() !== "" &&
      this.anoValido()
  );

  criar = output<NovoLivro>();

  alterarTitulo(event: Event): void {
    this.titulo.set((event.target as HTMLInputElement).value);
  }

  alterarAutor(event: Event): void {
    this.autor.set((event.target as HTMLInputElement).value);
  }

  alterarCategoria(event: Event): void {
    this.categoria.set((event.target as HTMLInputElement).value);
  }

  alterarAno(event: Event): void {
    this.ano.set((event.target as HTMLInputElement).value);
  }

  alterarStatus(event: Event): void {
    this.status.set((event.target as HTMLSelectElement).value as StatusLivro);
  }

  alterarDescricao(event: Event): void {
    this.descricao.set((event.target as HTMLTextAreaElement).value);
  }

  // <form (submit)> e não (click): dá o Enter de graça. Sem o preventDefault o
  // navegador faria GET na própria URL e recarregaria a aplicação inteira.
  enviar(event: Event): void {
    event.preventDefault();

    if (!this.formValido()) {
      return;
    }

    const descricao = this.descricao().trim();

    this.criar.emit({
      titulo: this.titulo().trim(),
      autor: this.autor().trim(),
      categoria: this.categoria().trim(),
      ano: Number(this.ano()),
      status: this.status(),
      // undefined, não "": string vazia seria um campo presente e vazio, e o
      // `descricao?` do modelo deixaria de significar ausência.
      descricao: descricao === "" ? undefined : descricao
    });

    this.limpar();
  }

  private limpar(): void {
    this.titulo.set("");
    this.autor.set("");
    this.categoria.set("");
    this.ano.set(String(ANO_ATUAL));
    this.status.set("disponivel");
    this.descricao.set("");
  }
}
