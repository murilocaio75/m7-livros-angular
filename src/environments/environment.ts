// AMBIENTE DE PRODUÇÃO. Contra-intuitivo pelo nome: é ESTE arquivo que o
// `ng build` usa (defaultConfiguration: production) e também o `ng test`.
// Durante o `ng serve` ele é SUBSTITUÍDO por environment.development.ts.
//
// ⚠ ETAPA 15: trocar por https://<nome-do-servico>.onrender.com/api antes de
// publicar. Se este valor continuar apontando para localhost, a aplicação
// publicada carrega em branco — o navegador do avaliador não tem uma API na
// porta 3000 dele.
export const environment = {
  apiUrl: "http://localhost:3000/api"
};
