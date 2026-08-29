// AMBIENTE DE PRODUÇÃO. Contra-intuitivo pelo nome: é ESTE arquivo que o
// `ng build` usa (defaultConfiguration: production) e também o `ng test`.
// Durante o `ng serve` ele é SUBSTITUÍDO por environment.development.ts.
//
// Etapa 15 concluída: aponta para o Web Service publicado no Render. Enquanto
// esta linha dizia localhost, a aplicação publicada carregaria em branco — o
// navegador de quem abre a página não tem uma API na porta 3000 dele.
export const environment = {
  apiUrl: "https://m7-a8-livros-api-sfdn.onrender.com/api"
};
