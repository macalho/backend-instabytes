import { MongoClient } from "mongodb";

// Função assíncrona para conectar ao banco de dados MongoDB
export default async function conectarAoBanco(stringConexao) {
    // Variável para armazenar o cliente MongoDB
    let mongoClient;

    try {
        // Cria um novo cliente MongoDB usando a string de conexão fornecida
        mongoClient = new MongoClient(stringConexao);
        console.log("Conectando ao cluster do banco de dados...");
    
        // Conecta ao banco de dados
        await mongoClient.connect();
        console.log("Conectado ao MongoDB Atlas com sucesso!");
    
        // Retorna o cliente conectado
        return mongoClient;
    } catch (erro) {
        // Captura e trata qualquer erro que possa ocorrer durante a conexão
        console.error("Falha na conexão com o banco", erro);
    
        // Encerra a aplicação em caso de falha na conexão
        process.exit();
    }
};