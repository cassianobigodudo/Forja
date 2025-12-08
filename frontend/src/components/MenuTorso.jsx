import React from 'react';
import './MenuTorso.css'; // Garantindo o import do CSS correto

function MenuTorso({ 
    genero = 'FEMININO', 
    onTorsoChange, 
    onVarianteChange, 
    torsoAtual, 
    varianteAtual, 
    torsosDisponiveis, 
    variantesDisponiveis 
}) {
    // Garantir que a lista seja segura para mapear (evita erros se a prop vier vazia)
    const listaSegura = Array.isArray(torsosDisponiveis) ? torsosDisponiveis : [];

    // Função auxiliar para gerar o caminho da imagem do torso
    const getImagePath = (nomeRoupa) => {
        // Exemplo: /personagem-FEMININO/ROUPAS-TORSO/Top-Regata-top-1.png
        // A variante está no final, mas o nome da roupa (sem variante) é usado na lista
        return `/personagem-${genero}/ROUPAS-TORSO/${nomeRoupa}-${varianteAtual}.png`;
    };

    return (
        <div className="container-menu-torso">
            {/* Título do Menu */}
            <div>
                TORSO
            </div>

            {/* Grid de Opções de Torso */}
            <div className="torso-grid">
                
                {/* Botão para Remover/Nenhuma Opção */}
                <button
                    className={`torso-opcao ${!torsoAtual ? 'ativada' : ''}`}
                    onClick={() => onTorsoChange(null)}
                    title="Remover Roupa de Cima"
                >
                   {/* Placeholder para a opção "Sem Torso" */}
                   <span style={{fontSize:'0.7rem', color:'var(--cor-texto)'}}>NENHUM</span>
                </button>

                {/* Mapeamento da Lista de Roupas */}
                {listaSegura.map((nomeRoupa) => (
                    <button
                        key={nomeRoupa}
                        className={`torso-opcao ${torsoAtual === nomeRoupa ? 'ativada' : ''}`}
                        onClick={() => onTorsoChange(nomeRoupa)}
                        title={nomeRoupa}
                    >
                        <img 
                            // Renderiza a imagem do torso com a variante atual selecionada
                            src={getImagePath(nomeRoupa)} 
                            alt={nomeRoupa}
                            // Removidas as classes inline de width/height/objectFit para permitir o CSS fazer o zoom
                            onError={(e) => {
                                // Fallback: mostra o nome do item se a imagem falhar
                                e.target.style.display = 'none'; 
                                e.target.parentNode.innerText = nomeRoupa;
                                e.target.parentNode.style.fontSize = '0.6rem';
                                e.target.parentNode.style.color = 'white';
                            }} 
                        />
                    </button>
                ))}
            </div>

            {/* Seção de Variantes/Estilos (Cores/Estilos) */}
            <div className="variantes-torso-container">
                <label className='lbl-torso'>VARIAÇÃO / ESTILO</label>
                <div className="variantes-torso">
                    {/* Garante que haja pelo menos a variante padrão 'top-1' se a lista for vazia */}
                    {(variantesDisponiveis && variantesDisponiveis.length > 0 ? variantesDisponiveis : ['top-1']).map((variante) => (
                        <button
                            key={variante}
                            className={`variante-torso ${varianteAtual === variante ? 'ativada' : ''}`}
                            onClick={() => onVarianteChange(variante)}
                            title={variante}
                        >
                            {/* Exibe o nome da variante, removendo prefixos */}
                            {variante.replace('top-', '').replace('Top-', '')}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MenuTorso;