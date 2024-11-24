import "dotenv/config";
import { ObjectId } from "mongodb";
import conectarAoBanco from "../config/dbConfig.js";

// Conecta ao banco de dados MongoDB usando a string de conexão fornecida pela variável de ambiente
const conexao = await conectarAoBanco(process.env.CONNECTION_STRING);


// Função assíncrona para obter todos os posts do banco de dados
export async function getTodosPosts() {
    try {
        // Conecta ao banco de dados e seleciona a coleção de posts.
        const db = conexao.db("imersao-instabytes");
        const colecao = db.collection("posts");

        // Retorna todos os documentos da coleção como um array
        return colecao.find().toArray();
    }
    catch (error) {
        // Captura qualquer erro que possa ocorrer durante a operação.
        console.error("Erro ao obter posts:", error);
        // Lança um novo erro para propagar o erro para o chamador da função.
        throw new Error("Não foi possível obter os posts.");
    }   
};

// Função assíncrona para criar um post no banco de dados
export async function criarPost(novoPost) {
    try {
        // Conecta ao banco de dados e seleciona a coleção de posts.
        const db = conexao.db("imersao-instabytes");
        const colecao = db.collection("posts");
        
        // Insere um novo documento na coleção de posts.
        // O método `insertOne()` insere um único documento e 
        // retorna um objeto com informações sobre o documento inserido, incluindo o `_id` gerado automaticamente.
        return colecao.insertOne(novoPost);
    } catch (error) {
        // Captura qualquer erro que possa ocorrer durante a operação de inserção.
        console.error(error);
        // Lança um novo erro para propagar o erro para o chamador da função.
        throw new Error("Erro ao criar post.");
    }
}

// Função assíncrona para atualizar um post no banco de dados
export async function atualizarPost(id, novoPost) {
    try {
        // Conecta ao banco de dados e seleciona a coleção de posts.
        const db = conexao.db("imersao-instabytes");
        const colecao = db.collection("posts");

        // Converte o ID do post para um objeto ObjectId exigido pelo MongoDB para identificar um documento.
        const objID = ObjectId.createFromHexString(id);

        // Atualiza um documento na coleção de posts.
        // O método `updateOne()` localiza o documento através do _id: e 
        // aplica as modificações especificadas pelo parâmetro novoPost.        
        return colecao.updateOne(
            { _id: new ObjectId(objID) },
            { $set: novoPost }
        );    
    } catch (error) {
        // Captura qualquer erro que possa ocorrer durante a operação de inserção.
        console.error(error);
        // Lança um novo erro para propagar o erro para o chamador da função.
        throw new Error("Erro ao atualizar o post.");
    }    
}