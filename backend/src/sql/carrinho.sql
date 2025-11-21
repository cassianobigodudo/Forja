CREATE TABLE IF NOT EXISTS carrinho (
    session_id VARCHAR(255) NOT NULL,
    personagem_id INT NOT NULL REFERENCES personagens(id) ON DELETE CASCADE,
    adicionado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (session_id, personagem_id) -- Impede que o mesmo personagem seja adicionado duas vezes no carrinho do mesmo usuário
);

COMMENT ON TABLE carrinho IS 'Itens que o usuário adicionou ao seu carrinho de compras.';