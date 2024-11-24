import fs from "fs";
import gerarDescricaoComGemini from "../services/geminiService.js";
import {getTodosPosts, criarPost, atualizarPost} from "../models/postsModel.js";

// Função assíncrona para listar todos os posts
export async function listarPosts(req, res) {
    try {
        // Chama a função `getTodosPosts()` de forma assíncrona para obter todos os posts.
        const posts = await getTodosPosts();
        // Envia uma resposta HTTP com status 200 (sucesso) e o array de posts no formato JSON.
        res.status(200).json(posts);
    }
    catch(erro) {
        // Captura qualquer erro que possa ocorrer durante a criação do post.
        console.error(erro.message); // Exibe a mensagem de erro no console para ajudar na depuração.
        res.status(500).json({"Erro":"Falha na requisição"}); // Retorna uma mensagem de erro sem revelar detalhes sensíveis.
    };
}

// Função assíncrona para postar um novo post
export async function postarNovoPost(req, res) {
    // Guarda os dados do novo post do corpo da requisição.
    const novoPost = req.body;
    try {
        // Chama a função para criar um novo post, passando os dados do novo post.
        // A função `criarPost` deve se encarregar de inserir o post no banco de dados.
        const postCriado = await criarPost(novoPost);

        // Retorna uma resposta HTTP 200 (OK) com o post criado como JSON.
        res.status(200).json(postCriado);
    }
    catch(erro) {
        // Captura qualquer erro que possa ocorrer durante a criação do post.
        console.error(erro.message); // Exibe a mensagem de erro no console para ajudar na depuração.
        res.status(500).json({"Erro":"Falha na requisição"}); // Retorna uma mensagem de erro sem revelar detalhes sensíveis.
    };
}

// Função assíncrona para fazer upload de imagem
export async function uploadImagem(req, res) {
    // Guarda os dados do novo post do corpo da requisição.
    const novoPost = req.body;
    try {
        // Chama a função para criar um novo post, passando os dados do novo post.
        // A função `criarPost` deve se encarregar de inserir o post no banco de dados.
        const postCriado = await criarPost(novoPost);

        // constrói o novo caminho completo para a imagem utilizando o ID do post criado
        const imagemAtualizada = `uploads/${postCriado.insertedId}.png`

        // Renomeia o arquivo da imagem para o novo caminho.
        // A função `fs.renameSync` move e renomeia o arquivo de forma síncrona. 
        fs.renameSync(req.file.path, imagemAtualizada);

        // Retorna uma resposta HTTP 200 (OK) com o post criado como JSON.
        res.status(200).json(postCriado);
    }
    catch(erro) {
        // Captura qualquer erro que possa ocorrer durante o processo
        console.error(erro.message);
        // Retorna uma resposta HTTP 500 (Erro interno do servidor) com uma mensagem genérica.
        res.status(500).json({"Erro":"Falha na requisição"});
    };
}

// Função assíncrona para atualizar um post
export async function atualizarNovoPost(req, res) {
    // Obtém o ID do post a ser atualizado a partir dos parâmetros da requisição.
    const id = req.params.id;
    // Constrói a URL da imagem com base no ID do post.
    const urlImagem = `http://localhost:3000/${id}.png`;    

    try {
        // Lê o conteúdo da imagem do sistema de arquivos.
        const imgBuffer = fs.readFileSync(`uploads/${id}.png`);
        
        // Chama uma função (assumida) para gerar uma descrição da imagem usando o modelo Gemini.
        const descricao = await gerarDescricaoComGemini(imgBuffer);
        
        // Cria um objeto com os dados do post atualizado.
        const post = {
            imgUrl: urlImagem,
            descricao: descricao,
            alt: req.body.alt
        };

        // Chama a função para atualizar o post no banco de dados.
        // A função `atualizarPost` deve receber o ID do post e os novos dados.
        const postCriado = await atualizarPost(id, post);

        // Verifica se o post foi atualizado com sucesso.
        if (postCriado.modifiedCount === 1) {
            // Retorna uma resposta 200 (OK) com o post atualizado.
            res.status(200).json(postCriado);
        } else {
            // Se o post não foi encontrado, retorna uma resposta 404 (Não encontrado).
            console.error("Post não encontrado");
            res.status(404).json({ mensagem: "Post não encontrado" });
        }  
    } catch(erro) {
        // Captura qualquer erro que possa ocorrer durante o processo.
        console.error(erro.message);
        // Retorna uma resposta 500 (Erro interno do servidor) com uma mensagem genérica.
        res.status(500).json({ mensagem: "Erro ao atualizar o post" });
    };
}