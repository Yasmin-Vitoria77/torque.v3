CREATE DATABASE IF NOT EXISTS mecanica;
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
("Paulin", "123.456.789-10", "$2b$10$XEsUku2aGrzEE3xkuqCxQuuE14HrSUp0K0X8XwHuzAwswY784.EHG"),
("Cristiano", "124.567.987-10", "$2b$10$XEsUku2aGrzEE3xkuqCxQuuE14HrSUp0K0X8XwHuzAwswY784.EHG"),
("Betina", "122.333.541-10", "$2b$10$XEsUku2aGrzEE3xkuqCxQuuE14HrSUp0K0X8XwHuzAwswY784.EHG")