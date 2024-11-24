import express from "express";
import multer from "multer";
import cors from "cors";
import { listarPosts, postarNovoPost, uploadImagem, atualizarNovoPost } from "../controllers/postsController.js";

// Configurando a origem para o CORS
const corsOptions = {
    origin: "http://localhost:8000",
    optionsSuccessStatus: 200
};

// Para gerenciar os arquivos em disco
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

// Para ajudar nomes de arquivos no ambiente Windows
const upload = multer({ dest: "./uploads" , storage});

const routes = (app) => {
    // Permite que o servidor entenda requisições com corpo em formato JSON
    app.use(express.json());

    // Aplicando as configurações do cors
    app.use(cors(corsOptions));

    // Rota para obter todos os posts
    app.get("/posts/", listarPosts);

    // Rota para criar um post
    app.post("/posts", postarNovoPost);

    // Rota para fazer um upload de imagem
    app.post("/upload", upload.single("imagem"), uploadImagem);

    // Rota para atualizar um post
    app.put("/upload/:id", atualizarNovoPost);
}

export default routes;