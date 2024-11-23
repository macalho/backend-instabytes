import express from "express";
import multer from "multer";
import cors from "cors";
import { listarPosts, postarNovoPost, listarUsers, uploadImagem, atualizarPostExercicio, atualizarNovoPost } from "../controllers/postsController.js";

const corsOptions = {
    origin: "http://localhost:8000",
    optionsSuccessStatus: 200
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ dest: "./uploads" , storage});

const routes = (app) => {
    // Permite que o servidor entenda requisições com corpo em formato JSON
    app.use(express.json());

    app.use(cors(corsOptions));

    // Rota para obter todos os posts
    app.get("/posts/", listarPosts);

    // Rota para obter todos os users
    app.get("/users/", listarUsers);

    // Rota para criar um post
    app.post("/posts", postarNovoPost);

    // Rota para fazer um upload de imagem
    app.post("/upload", upload.single("imagem"), uploadImagem);

    // Rota para atualizar um post
    app.put("/post/:id", atualizarPostExercicio);

    app.put("/upload/:id", atualizarNovoPost);
}

export default routes;