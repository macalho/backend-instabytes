import fs from "fs";
import gerarDescricaoComGemini from "../services/geminiService.js";
import {getTodosPosts, getAllUsers, criarPost, alterarPost, atualizarPost} from "../models/postsModel.js";


export async function listarPosts(req, res) {
    // Chama a função para obter os posts e envia como resposta
    const posts = await getTodosPosts();
    res.status(200).json(posts);
}

export async function listarUsers(req, res) {
    try {
        // Chama a função para obter os usuários e envia como resposta
        const users = await getAllUsers();
        
        // Verifica se a lista de usuários está vazia
        if (users.length === 0) {
            return res.status(404).json({ message: "Nenhum usuário encontrado." });
        }

        res.status(200).json(users);
    } catch (error) {
        console.error("Erro ao listar usuários:", error);
        res.status(500).json({ message: "Erro ao obter usuários." });
    }
}

export async function postarNovoPost(req, res) {
    const novoPost = req.body;
    try {
        const postCriado = await criarPost(novoPost);
        res.status(200).json(postCriado);
    }
    catch(erro) {
        console.error(erro.message);
        res.status(500).json({"Erro":"Falha na requisição"}); // cuidado ao enviar dados de erro como resposta
    };
}

export async function uploadImagem(req, res) {
    const novoPost = req.body;
    try {
        const postCriado = await criarPost(novoPost);
        const imagemAtualizada = `uploads/${postCriado.insertedId}.png`
        fs.renameSync(req.file.path, imagemAtualizada);
        res.status(200).json(postCriado);
    }
    catch(erro) {
        console.error(erro.message);
        res.status(500).json({"Erro":"Falha na requisição"}); // cuidado ao enviar dados de erro como resposta
    };
}

export async function atualizarPostExercicio(req, res) {
    const conteudo = req.body;
    const id = req.params.id;

    try {
        const postAtualizado = await alterarPost(id, conteudo);
        
        if (postAtualizado.modifiedCount === 1) {
            res.status(200).json({ mensagem: "Post atualizado com sucesso" });
        } else {
            console.error("Post não encontrado");
            res.status(404).json({ mensagem: "Post não encontrado" });
        }  
    } catch(erro) {
        console.error(erro.message);
        res.status(500).json({ mensagem: "Erro ao atualizar o post" });
    };
}

export async function atualizarNovoPost(req, res) {
    const id = req.params.id;
    const urlImagem = `http://localhost:3000/${id}.png`;
    

    try {
        const imgBuffer = fs.readFileSync(`uploads/${id}.png`);
        
        const descricao = await gerarDescricaoComGemini(imgBuffer);
        const post = {
            imgUrl: urlImagem,
            descricao: descricao,
            alt: req.body.alt
        };
        const postCriado = await atualizarPost(id, post);

        if (postCriado.modifiedCount === 1) {
            //res.status(200).json({ mensagem: "Post atualizado com sucesso" });
            res.status(200).json(postCriado);
        } else {
            console.error("Post não encontrado");
            res.status(404).json({ mensagem: "Post não encontrado" });
        }  
    } catch(erro) {
        console.error(erro.message);
        res.status(500).json({ mensagem: "Erro ao atualizar o post" });
    };
}