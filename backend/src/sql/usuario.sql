CREATE TABLE IF NOT EXISTS usuarios(
    id_usuario SERIAL PRIMARY KEY,
    nome_usuario VARCHAR(35) NOT NULL,
    email_usuario VARCHAR(255) NOT NULL,
    senha_usuario VARCHAR (45) NOT NULL
);

COMMENT ON TABLE usuarios IS 'Banco de dados de usuários criados no sistema.';