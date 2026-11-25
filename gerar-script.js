// // Bibliotecas utilizadas 
// require('dotenv').config() // faz as minhas configurações
// const fs = require('fs')
// const path = require('path')
// const bcrypt = require('bcryptjs') // trabalha com hash de senha
// const crypto = require('crypto') // trabalha com criptografia

// // Função de criptografia da biblioteca crypto
// function criptografarCpf(texto){                      // pegando chave
//     const cifra = crypto.createCipheriv('aes-256-cbc',process.env.CRIPTO_CHAVE, process.env.CRIPTO_IV) // dizendo como a cifra vai trabalhar

//     return cifra.update(texto, 'utf8', 'hex') + cifra.final('hex')
// }
//                                 // senha e saldo
// const senhaHash = bcrypt.hashSync("1234", 10) // garanto que cada senha que eu salve diferente
// const cpf1= criptografarCpf("11122233344")
// const cpf2= criptografarCpf("22233344455")
// const cpf3= criptografarCpf("33344455566")

// const sql = `CREATE DATABASE IF NOT EXISTS mecanica;
// USE mecanica;

// CREATE TABLE IF NOT EXISTS usuarios(
// 	id INT AUTO_INCREMENT PRIMARY KEY,
//     nome VARCHAR(35) NOT NULL,
//     cpf VARCHAR(255) NOT NULL, -- TEM QUE SER CRIPTOGRAFADO,
//     email VARCHAR(255) NOT NULL,
//     senha_hash VARCHAR(255) NOT NULL -- CRIPTOGRAFADO
// );

// CREATE TABLE IF NOT EXISTS clientes(
// 	id INT AUTO_INCREMENT PRIMARY KEY,
//     nome VARCHAR (35) NOT NULL,
//     cpf VARCHAR(255) NOT NULL,
//     telefone VARCHAR(20) NOT NULL,
//     email VARCHAR(50) NOT NULL,
//     papel ENUM ('usuario', 'cliente') DEFAULT 'cliente'
// );


// CREATE TABLE IF NOT EXISTS veiculos(
// 	id INT AUTO_INCREMENT PRIMARY KEY,
//     modelo VARCHAR(50) NOT NULL,
//     marca VARCHAR(50) NOT NULL,
//     placa VARCHAR(10) NOT NULL UNIQUE,
//     ano YEAR NOT NULL,
//     cliente_id INT NOT NULL, -- crio
//     FOREIGN KEY (cliente_id) REFERENCES cliente(id) ON DELETE CASCADE -- transformo em chave estrangeira 
// );

// CREATE TABLE IF NOT EXISTS agendamentos(
// 	id INT AUTO_INCREMENT PRIMARY KEY,
//     cliente_id INT NOT NULL,
//     data_agendamento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (cliente_id) REFERENCES cliente(id) ON DELETE CASCADE
// );

// --

// INSERT INTO usuarios (nome, cpf, email, senha_hash) VALUES 
// ("Paulin","paulin@gmail.com", "123.456.789-10", "1234"),
// ("Cristiano", "cristiano@gmail.com", "124.567.987-10", "12345"),
// ("Betinha", "betinha@gmail.com", "122.333.541-10", "123456")`;

//                     // une informações para gerar um caminho
// const caminhoSaida = path.join(__dirname, 'database', 'script.sql') //__dirname = pasta em que estou - vou criar pasta e colocal arquivo

// fs.writeFileSync(caminhoSaida, sql)
// console.log(`Arquivo gerado em ${caminhoSaida}`)

// Gera o arquivo database/script.sql
//
// O CPF criptografado e a senha com hash nao podem ser escritos a mao no SQL,
// por isso este script usa a mesma chave do .env (utils/cripto.js) e o bcrypt
// para gerar os valores corretos e montar o arquivo .sql pronto.
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { criptografarCpf } = require('./src/utils/cripto');

const senhaHash = bcrypt.hashSync('123456', 10);

const cpf1 = criptografarCpf('11122233344');
const cpf2 = criptografarCpf('22233344455');
const cpf3 = criptografarCpf('33344455566');

const sql = `-- Script gerado automaticamente por gerar-script.js
-- Nao edite o CPF ou a senha a mao: use "npm run gerar-script" no backend

CREATE DATABASE IF NOT EXISTS oficina;
USE oficina;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL
);

CREATE TABLE clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  cpf VARCHAR(255) NOT NULL,
  telefone VARCHAR(20),
  email VARCHAR(100)
);

CREATE TABLE veiculos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  placa VARCHAR(10) NOT NULL,
  marca VARCHAR(50),
  modelo VARCHAR(50),
  ano INT,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

CREATE TABLE agendamentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  veiculo_id INT NOT NULL,
  data_agendamento DATETIME NOT NULL,
  servico VARCHAR(100),
  FOREIGN KEY (veiculo_id) REFERENCES veiculos(id)
);

-- RN01: pelo menos 3 registros em cada tabela

-- Usuario de teste: admin@oficina.com / 123456
INSERT INTO usuarios (nome, email, senha) VALUES
  ('Administrador', 'admin@oficina.com', '${senhaHash}'),
  ('Carlos Mecanico', 'carlos@oficina.com', '${senhaHash}'),
  ('Fernanda Atendente', 'fernanda@oficina.com', '${senhaHash}');

-- CPF salvo criptografado [RN03]
INSERT INTO clientes (nome, cpf, telefone, email) VALUES
  ('Joao da Silva', '${cpf1}', '(11) 90000-1111', 'joao.silva@email.com'),
  ('Maria Souza', '${cpf2}', '(11) 90000-2222', 'maria.souza@email.com'),
  ('Pedro Oliveira', '${cpf3}', '(11) 90000-3333', 'pedro.oliveira@email.com');

-- Cada veiculo associado a um cliente [RN09]
INSERT INTO veiculos (cliente_id, placa, marca, modelo, ano) VALUES
  (1, 'ABC1D23', 'Volkswagen', 'Gol', 2018),
  (2, 'DEF4E56', 'Fiat', 'Palio', 2015),
  (3, 'GHI7F89', 'Chevrolet', 'Onix', 2021);

-- Datas fora de ordem para provar que a ordenacao funciona [RN07]
INSERT INTO agendamentos (veiculo_id, data_agendamento, servico) VALUES
  (2, '2026-11-05 09:00:00', 'Troca de oleo'),
  (1, '2026-10-20 14:30:00', 'Alinhamento e balanceamento'),
  (3, '2026-10-28 08:00:00', 'Revisao dos freios');
`;

const caminhoSaida = path.join(__dirname, '..', 'database', 'script.sql');
fs.writeFileSync(caminhoSaida, sql);
console.log(`Arquivo gerado em ${caminhoSaida}`);

// troquei meu código pelo do Daniel
// deu problema no caminho
// inseri as últimas coisas no SQL
// no meu faltava chamar o cpf e a senha, ambos criptografados - é para se inserir dados apenas aqui