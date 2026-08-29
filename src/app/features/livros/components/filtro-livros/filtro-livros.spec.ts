import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FiltroLivros } from "./filtro-livros";

// Testa a COMUNICAÇÃO entre componentes (seção 4 do enunciado): o filtro
// recebe estado por input e devolve intenção por output. Ele não guarda estado
// nenhum — quem decide o que fazer é a página.
describe("FiltroLivros", () => {
  async function montar(): Promise<ComponentFixture<FiltroLivros>> {
    await TestBed.configureTestingModule({
      imports: [FiltroLivros]
    }).compileComponents();

    const fixture = TestBed.createComponent(FiltroLivros);

    // input.required() exige que TODOS sejam definidos antes do primeiro
    // ciclo de detecção. É por isso que os componentes foram gerados com
    // --skip-tests: o spec automático do CLI não faz isto e quebraria.
    fixture.componentRef.setInput("pesquisa", "");
    fixture.componentRef.setInput("categoria", "todas");
    fixture.componentRef.setInput("status", "todas");
    fixture.componentRef.setInput("categorias", ["Estratégia", "Tecnologia"]);

    await fixture.whenStable();

    return fixture;
  }

  it("deve montar uma opção por categoria recebida, além de 'Todas'", async () => {
    const fixture = await montar();
    const selects = (
      fixture.nativeElement as HTMLElement
    ).querySelectorAll("select");

    const selectCategoria = selects[0] as HTMLSelectElement;

    // 2 categorias + a opção "Todas as categorias".
    expect(selectCategoria.options).toHaveLength(3);
    expect(selectCategoria.options[1].value).toBe("Estratégia");
  });

  it("deve emitir pesquisaChange com o texto digitado", async () => {
    const fixture = await montar();

    let emitido: string | undefined;
    fixture.componentInstance.pesquisaChange.subscribe(valor => {
      emitido = valor;
    });

    const campo = (fixture.nativeElement as HTMLElement).querySelector(
      "input[type=search]"
    ) as HTMLInputElement;

    campo.value = "hobbit";
    campo.dispatchEvent(new Event("input"));

    expect(emitido).toBe("hobbit");
  });

  it("deve emitir statusChange com o valor escolhido", async () => {
    const fixture = await montar();

    let emitido: string | undefined;
    fixture.componentInstance.statusChange.subscribe(valor => {
      emitido = valor;
    });

    const selects = (
      fixture.nativeElement as HTMLElement
    ).querySelectorAll("select");

    const selectStatus = selects[1] as HTMLSelectElement;
    selectStatus.value = "emprestado";
    selectStatus.dispatchEvent(new Event("change"));

    expect(emitido).toBe("emprestado");
  });
});
