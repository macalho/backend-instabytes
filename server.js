import express from "express"; // Importa o framework Express.js para criar a aplicação web
import routes from "./src/routes/postsRoutes.js";

// Cria uma instância do Express, representa o servidor ( que é uma função e um módulo do node.js )
const app = express();

app.use(express.static("uploads"));

routes(app);

// Inicia o servidor na porta 3000
app.listen(3000, () => {
    console.log("Servidor escutando...");
});
