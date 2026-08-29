import { Component, computed, input, output } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Livro, ROTULO_STATUS } from "../../models/livro";

@Component({
  selector: "app-livro-card",
  imports: [RouterLink],
  templateUrl: "./livro-card.html",
  styleUrl: "./livro-card.css"
})
export class LivroCard {
  livro = input.required<Livro>();

  // O card não altera nem exclui nada: apenas avisa. Quem tem o serviço é a
  // página, e é ela que decide o que fazer — o card continua reutilizável.
  alternarStatus = output<Livro>();
  excluir = output<Livro>();

  readonly rotuloStatus = computed(() => ROTULO_STATUS[this.livro().status]);

  readonly rotuloAcao = computed(() =>
    this.livro().status === "disponivel" ? "Emprestar" : "Devolver"
  );
}
