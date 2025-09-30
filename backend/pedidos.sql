-- Conecte-se ao banco 'minha_loja' antes de rodar o comando abaixo

CREATE TABLE pedidos (
    id BIGSERIAL PRIMARY KEY, -- ID numérico único para cada pedido, gerado automaticamente
    order_id VARCHAR(100) NOT NULL UNIQUE, -- O "ABC-123" que vem do frontend
    dados_do_pedido JSONB NOT NULL, -- Coluna para guardar todo o objeto "order"
    callback_url TEXT, -- A URL de callback
    status VARCHAR(50) DEFAULT 'pendente', -- Status para acompanhar o pedido (ex: pendente, processado, falhou)
    recebido_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP -- Data e hora de recebimento
);

-- Adicionando um comentário para explicar a tabela:
COMMENT ON TABLE pedidos IS 'Armazena os pedidos de customização recebidos pela aplicação.';

-- CREATE TABLE pedidos (
--     id SERIAL PRIMARY KEY,
--     genero VARCHAR(20) NULL,
--     generoNum INT NULL,
--     corPele VARCHAR(20) NULL,
--     corPeleNum INT NULL,
--     marcas VARCHAR(50) NULL,
--     marcasNum INT NULL,
--     cabelo VARCHAR(50) NULL,
--     cabeloNum INT NULL,
--     corCabelo VARCHAR(50) NULL,
--     corCabeloNum INT NULL,
--     acessCabeca VARCHAR(50) NULL,
--     acessCabecaNum INT NULL,
--     acessPescoco VARCHAR(50) NULL,
--     acessPescocoNum INT NULL,
--     roupaCima VARCHAR(50) NULL,
--     roupaCimaNum INT NULL,
--     roupaCimaVariante VARCHAR(50) NULL,
--     roupaCimaVarianteNum INT NULL,
--     armas VARCHAR(50) NULL,
--     armasNum INT NULL,
--     baseMini VARCHAR(50) NULL,
--     baseMiniNum INT NULL,
--     roupaBaixo VARCHAR(50) NULL,
--     roupaBaixoNum INT NULL,
--     roupaBaixoVariante VARCHAR(50) NULL,
--     roupaBaixoVarianteNum INT NULL,
--     sapato VARCHAR(50) NULL,
--     sapatoNum INT NULL,
--     sapatoVariante VARCHAR(50) NULL,
--     sapatoVarianteNum INT NULL,
--     img TEXT NULL,
--     historia TEXT NULL
-- );
