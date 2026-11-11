// Bibliotecas utilizadas 
require('dotenv').config() // faz as minhas configurações
const fs = require('fs')
const path = require('path')
const bcrypt = require('bcryptjs') // trabalha com hash de senha
const crypto = require('crypto') // trabalha com criptografia

// Função de criptografia da biblioteca crypto
function criptografarCpf(texto){                      // pegando chave
    const cifra = crypto.createCipheriv('aes-256-cbc',process.env.CRIPTO_CHAVE, process.env.CRIPTO_IV) // dizendo como a cifra vai trabalhar

    return cifra.update(texto, 'utf8', 'hex') + cifra.final('hex')
}
                                // senha e saldo
const senhaHash = bcrypt.hashSync("1234", 10) // garanto que cada senha que eu salve diferente
const cpf1= criptografarCpf("11122233344")
const cpf2= criptografarCpf("22233344455")
const cpf3= criptografarCpf("33344455566")

const sql = `CREATE DATABASE IF NOT EXISTS mecanica;
USE mecanica;

CREATE TABLE IF NOT EXISTS usuario(
	id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(35) NOT NULL,
    cpf VARCHAR(255) NOT NULL, -- TEM QUE SER CRIPTOGRAFADO
    senha_hash VARCHAR(255) NOT NULL -- CRIPTOGRAFADO
);

CREATE TABLE IF NOT EXISTS cliente(
	id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR (35) NOT NULL,
    cpf VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    email VARCHAR(50) NOT NULL,
    papel ENUM ('usuario', 'cliente') DEFAULT 'cliente'
);


CREATE TABLE IF NOT EXISTS veiculo(
	id INT AUTO_INCREMENT PRIMARY KEY,
    modelo VARCHAR(50) NOT NULL,
    marca VARCHAR(50) NOT NULL,
    placa VARCHAR(10) NOT NULL UNIQUE,
    ano YEAR NOT NULL,
    cliente_id INT NOT NULL, -- crio
    FOREIGN KEY (cliente_id) REFERENCES cliente(id) ON DELETE CASCADE -- transformo em chave estrangeira 
);

CREATE TABLE IF NOT EXISTS agendamentos(
	id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    data_agendamento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES cliente(id) ON DELETE CASCADE
);

--

INSERT INTO usuario (nome, cpf, senha_hash) VALUES 
("Paulin", "123.456.789-10", "${senhaHash}"),
("Cristiano", "124.567.987-10", "${senhaHash}"),
("Betina", "122.333.541-10", "${senhaHash}")`;

                    // une informações para gerar um caminho
const caminhoSaida = path.join(__dirname, 'database', 'script.sql') //__dirname = pasta em que estou - vou criar pasta e colocal arquivo

fs.writeFileSync(caminhoSaida, sql)
console.log(`Arquivo gerado em ${caminhoSaida}`)