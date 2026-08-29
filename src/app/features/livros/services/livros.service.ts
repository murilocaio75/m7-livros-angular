import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { environment } from "../../../../environments/environment";
import { Livro, NovoLivro, StatusLivro } from "../models/livro";

// Ponto único de acesso aos dados (seção 6 do enunciado). Nenhum componente
// fala com HttpClient nem conhece a URL da API — só este arquivo.
@Injectable({
  providedIn: "root"
})
export class LivrosService {
  private readonly http = inject(HttpClient);

  // Vem do ambiente, não de uma string fixa. É o que faz a troca da etapa 15
  // ser uma linha, e o que impede o spec de divergir do service.
  private readonly apiUrl = `${environment.apiUrl}/livros`;

  listar(): Promise<Livro[]> {
    return firstValueFrom(this.http.get<Livro[]>(this.apiUrl));
  }

  async buscarPorId(id: number): Promise<Livro | undefined> {
    try {
      return await firstValueFrom(this.http.get<Livro>(`${this.apiUrl}/${id}`));
    } catch (erro) {
      // "Não existe" não é falha: devolve undefined e a página decide o que
      // mostrar. Qualquer outro erro (rede, 500) continua subindo.
      if (erro instanceof HttpErrorResponse && erro.status === 404) {
        return undefined;
      }

      throw erro;
    }
  }

  // O id é atribuído pelo servidor, por isso o parâmetro é NovoLivro e não Livro.
  adicionar(dados: NovoLivro): Promise<Livro> {
    return firstValueFrom(this.http.post<Livro>(this.apiUrl, dados));
  }

  alterarStatus(id: number, status: StatusLivro): Promise<Livro> {
    return firstValueFrom(
      this.http.put<Livro>(`${this.apiUrl}/${id}`, { status })
    );
  }

  excluir(id: number): Promise<void> {
    return firstValueFrom(
      this.http.delete<void>(`${this.apiUrl}/${id}`)
    );
  }
}
