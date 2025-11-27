CREATE TABLE IF NOT EXISTS pedidos (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255),
    personagem_id INT NOT NULL REFERENCES personagens(id),
    status VARCHAR(20) NOT NULL DEFAULT 'pendente', -- Ex: pendente, enviado, concluido, falha
    data_pedido TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    orderId_externo VARCHAR(100) -- Para salvar o "pedido-forja-id" que você gera
);

COMMENT ON TABLE pedidos IS 'Armazena os pedidos individuais de cada personagem a ser produzido.';