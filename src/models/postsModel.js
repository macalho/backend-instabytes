import "dotenv/config";
import { ObjectId } from "mongodb";
import conectarAoBanco from "../config/dbConfig.js";

// Conecta ao banco de dados usando a string de conexão fornecida pela variável de ambiente
const conexao = await conectarAoBanco(process.env.CONNECTION_STRING);

// originalmente só havia uma função no documento, 
// por isso ela podia ser do tipo default, a solução do momento 
// foi remover o tipo default das funções

// Função assíncrona para obter todos os posts do banco de dados
export async function getTodosPosts() {
    try {
         // Seleciona o banco de dados e a coleção de posts
        const db = conexao.db("imersao-instabytes");;
        const colecao = db.collection("posts");

        // Retorna todos os documentos da coleção como um array
        return colecao.find().toArray();
    }
    catch (error) {
        console.error("Erro ao obter posts:", error);
        throw new Error("Não foi possível obter os posts.");
    }   
};

export async function alterarPost(id, novoConteudo) {
    try {
        const db = conexao.db("imersao-instabytes");;
        const colecao = db.collection("posts");
        const objectId = new ObjectId(id); // o jeito correto de fazer está na função abaixo
        const resultado = await colecao.updateOne(
            { _id: objectId }, // Filtro para encontrar o post
            { $set: novoConteudo }
        );
        return resultado;
    } catch (error) {
        console.error(error);
        throw new Error("Erro ao atualizar o post");
    }    
}


export async function alterarCampoDescricao(id, novaDescricao) {
    try {
        const db = conexao.db("imersao-instabytes");
        const colecao = db.collection("posts");
        //const objectId = new ObjectId(id);
        const objectId = new ObjectId.createFromHexString(id);
        const resultado = await colecao.updateOne(
            //{ _id: objectId }, // Filtro para encontrar o post
            { _id: objectId }, // Filtro para encontrar o post
            { $set: { descricao: novaDescricao } }
        );
        return resultado;
    } catch (error) {
        console.error(error);
        throw new Error("Erro ao atualizar a descrição");
    }    
}


export async function criarPost(novoPost) {    
     const db = conexao.db("imersao-instabytes");
     const colecao = db.collection("posts");
 
     return colecao.insertOne(novoPost);
}


export async function atualizarPost(id, novoPost) {    
    const db = conexao.db("imersao-instabytes");
    const colecao = db.collection("posts");
    const objID = ObjectId.createFromHexString(id);

    return colecao.updateOne(
        { _id: new ObjectId(objID) },
        { $set: novoPost }
    );
}

// Função assíncrona para obter todos os usuários do banco de dados
export async function getAllUsers() {
    try {
        // Seleciona o banco de dados e a coleção de usuários
        const db = conexao.db("imersao-instabytes");
        const colecao = db.collection("users");

        // Retorna todos os documentos da coleção como um array
        return await colecao.find().toArray();
    } catch (error) {
        console.error("Erro ao obter usuários:", error);
        throw new Error("Não foi possível obter os usuários.");
    }
}
