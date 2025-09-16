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