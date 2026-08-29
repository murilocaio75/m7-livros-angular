import { TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { App } from "./app";

// Sem `import { describe, it, expect } from "vitest"`: o builder
// @angular/build:unit-test configura globals, e o tsconfig.spec.json declara
// "types": ["vitest/globals"]. Na Aula 06 o import era obrigatório.
describe("App", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      // O RouterOutlet do template precisa de um router configurado; sem isto
      // a criação do componente falha por falta de ActivatedRoute.
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it("deve criar a aplicação", () => {
    const fixture = TestBed.createComponent(App);

    expect(fixture.componentInstance).toBeTruthy();
  });

  it("deve renderizar o router-outlet", async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const elemento = fixture.nativeElement as HTMLElement;

    expect(elemento.querySelector("router-outlet")).toBeTruthy();
  });
});
