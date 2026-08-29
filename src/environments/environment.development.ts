// AMBIENTE LOCAL. Entra no lugar do environment.ts durante o `ng serve`.
// É o que permite desenvolver contra a API local mesmo depois de publicar —
// na Aula 07 o `ng serve` passou a conversar com produção porque a URL era
// fixa no service.
export const environment = {
  apiUrl: "http://localhost:3000/api"
};
