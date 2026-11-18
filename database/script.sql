CREATE DATABASE IF NOT EXISTS mecanica;
USE mecanica;

CREATE TABLE IF NOT EXISTS usuarios(
	id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(35) NOT NULL,
    cpf VARCHAR(255) NOT NULL, -- TEM QUE SER CRIPTOGRAFADO,
    email VARCHAR(255) NOT NULL,
    senha_hash VARCHAR(255) NOT NULL -- CRIPTOGRAFADO
);

CREATE TABLE IF NOT EXISTS clientes(
	id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR (35) NOT NULL,
    cpf VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    email VARCHAR(50) NOT NULL,
    papel ENUM ('usuario', 'cliente') DEFAULT 'cliente'
);


CREATE TABLE IF NOT EXISTS veiculos(
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

INSERT INTO usuarios (nome, cpf, email, senha_hash) VALUES 
("Paulin","paulin@gmail.com", "123.456.789-10", "1234"),
("Cristiano", "cristiano@gmail.com", "124.567.987-10", "12345"),
("Betinha", "betinha@gmail.com", "122.333.541-10", "123456")