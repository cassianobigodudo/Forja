CREATE TABLE IF NOT EXISTS personagens (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    genero VARCHAR(20) ,
    generoNum INT ,
    corPele VARCHAR(20) ,
    corPeleNum INT ,
    marcas VARCHAR(50) ,
    marcasNum INT ,
    cabelo VARCHAR(50) ,
    cabeloNum INT ,
    corCabelo VARCHAR(50) ,
    corCabeloNum INT ,
    acessCabeca VARCHAR(50) ,
    acessCabecaNum INT ,
    acessPescoco VARCHAR(50) ,
    acessPescocoNum INT ,
    roupaCima VARCHAR(50) ,
    roupaCimaNum INT ,
    roupaCimaVariante VARCHAR(50) ,
    roupaCimaVarianteNum INT ,
    armas VARCHAR(50) ,
    armasNum INT ,
    baseMini VARCHAR(50) ,
    baseMiniNum INT ,
    roupaBaixo VARCHAR(50) ,
    roupaBaixoNum INT ,
    roupaBaixoVariante VARCHAR(50) ,
    roupaBaixoVarianteNum INT ,
    sapato VARCHAR(50) ,
    sapatoNum INT ,
    sapatoVariante VARCHAR(50) ,
    sapatoVarianteNum INT ,
    historia TEXT ,
    img TEXT 
);

COMMENT ON TABLE personagens IS 'Armazena os pedidos de customização recebidos pela aplicação.';

-- -- Conecte-se ao banco 'minha_loja' antes de rodar o comando abaixo
-- TABELA DESATUALIZADA!!!!!!!!
-- CREATE TABLE pedidos (
--     id BIGSERIAL PRIMARY KEY, -- ID numérico único para cada pedido, gerado automaticamente
--     order_id VARCHAR(100) NOT NULL UNIQUE, -- O "ABC-123" que vem do frontend
--     dados_do_pedido JSONB NOT NULL, -- Coluna para guardar todo o objeto "order"
--     callback_url TEXT, -- A URL de callback
--     status VARCHAR(50) DEFAULT 'pendente', -- Status para acompanhar o pedido (ex: pendente, processado, falhou)
--     recebido_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP -- Data e hora de recebimento
-- );