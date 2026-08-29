import { provideHttpClient } from "@angular/common/http";
import {
  HttpTestingController,
  provideHttpClientTesting
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { environment } from "../../../../environments/environment";
import { Livro, NovoLivro } from "../models/livro";
import { LivrosService } from "./livros.service";

// Lê do MESMO lugar que o service. Na Aula 07 esta constante era uma string
// repetida à mão, e trocar a URL em um só dos dois arquivos faria os testes
// falharem — ou pior, passarem apontando para o servidor errado.
const API = `${environment.apiUrl}/livros`;

const LIVROS: Livro[] = [
  {
    id: 1,
    titulo: "Clean Code",
    autor: "Robert C. Martin",
    categoria: "Tecnologia",
    ano: 2008,
    status: "disponivel",
    descricao: "Livro sobre boas práticas de desenvolvimento de software."
  },
  {
    id: 2,
    titulo: "O Hobbit",
    autor: "J.R.R. Tolkien",
    categoria: "Ficção",
    ano: 1937,
    status: "emprestado",
    descricao: "A jornada de Bilbo Bolseiro pela Terra Média."
  },
  {
    // Sem `descricao`: espelha o livro 6 do banco e prova que o tipo aceita
    // a ausência do campo opcional.
    id: 6,
    titulo: "A Arte da Guerra",
    autor: "Sun Tzu",
    categoria: "Estratégia",
    ano: 2005,
    status: "disponivel"
  }
];

describe("LivrosService", () => {
  let service: LivrosService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // provideHttpClientTesting intercepta tudo: nenhuma requisição sai da
      // máquina. A suíte passa com a API desligada, de propósito.
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(LivrosService);
    http = TestBed.inject(HttpTestingController);
  });

  // Falha o teste se alguma requisição foi disparada e não foi respondida.
  afterEach(() => {
    http.verify();
  });

  it("deve ser criado", () => {
    expect(service).toBeTruthy();
  });

  it("deve listar os livros", async () => {
    const promessa = service.listar();

    const requisicao = http.expectOne(API);
    expect(requisicao.request.method).toBe("GET");

    requisicao.flush(LIVROS);

    expect(await promessa).toHaveLength(3);
  });

  it("deve buscar um livro por id", async () => {
    const promessa = service.buscarPorId(1);

    const requisicao = http.expectOne(`${API}/1`);
    expect(requisicao.request.method).toBe("GET");

    requisicao.flush(LIVROS[0]);

    expect((await promessa)?.titulo).toBe("Clean Code");
  });

  it("deve devolver undefined quando o livro não existe", async () => {
    const promessa = service.buscarPorId(999);

    http
      .expectOne(`${API}/999`)
      .flush(
        { erro: "Livro não encontrado." },
        { status: 404, statusText: "Not Found" }
      );

    // 404 é ausência, não falha: o service converte em undefined para que a
    // página possa mostrar "Livro não encontrado." sem try/catch.
    expect(await promessa).toBeUndefined();
  });

  it("deve cadastrar um livro sem enviar o id", async () => {
    const novo: NovoLivro = {
      titulo: "Refactoring",
      autor: "Martin Fowler",
      categoria: "Tecnologia",
      ano: 2018,
      status: "disponivel"
    };

    const promessa = service.adicionar(novo);

    const requisicao = http.expectOne(API);
    expect(requisicao.request.method).toBe("POST");

    // A asserção que trava a decisão de arquitetura: o id é do servidor, e o
    // cliente não pode mandar palpite nenhum sobre ele.
    expect(requisicao.request.body).toEqual(novo);

    requisicao.flush({ ...novo, id: 7 }, { status: 201, statusText: "Created" });

    expect((await promessa).id).toBe(7);
  });

  it("deve alterar o estado enviando apenas o status", async () => {
    const promessa = service.alterarStatus(1, "emprestado");

    const requisicao = http.expectOne(`${API}/1`);
    expect(requisicao.request.method).toBe("PUT");
    expect(requisicao.request.body).toEqual({ status: "emprestado" });

    requisicao.flush({ ...LIVROS[0], status: "emprestado" });

    expect((await promessa).status).toBe("emprestado");
  });

  it("deve excluir um livro", async () => {
    const promessa = service.excluir(1);

    const requisicao = http.expectOne(`${API}/1`);
    expect(requisicao.request.method).toBe("DELETE");

    requisicao.flush({ mensagem: "Livro excluído.", id: 1 });

    await promessa;
  });
});
