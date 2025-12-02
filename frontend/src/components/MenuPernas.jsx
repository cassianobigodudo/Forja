import React from 'react';
import './MenuPernas.css'; // Importa o CSS específico

function MenuPernas({ 
    genero = 'FEMININO', // Adicionado para compor o caminho da imagem
    onPernaChange, 
    onVarianteChange, 
    pernaAtual, 
    varianteAtual, 
    pernasDisponiveis, 
    variantesDisponiveis 
}) {
    // Proteção de array
    const listaSegura = Array.isArray(pernasDisponiveis) ? pernasDisponiveis : [];

    // Função para gerar o caminho correto da imagem
    const getImagePath = (nomeRoupa) => {
        // Padrão: /personagem-FEMININO/ROUPAS-PERNAS/NomeDaRoupa-bottom-1.png
        // Assumindo que a variante padrão de visualização é a 'bottom-1'
        return `/personagem-${genero}/ROUPAS-PERNAS/${nomeRoupa}-bottom-1.png`;
    };

    return (
        <div className="container-menu-pernas">
            <div style={{ textAlign: 'center', color: '#fff', padding: '10px', fontSize: '1.2rem', fontFamily: 'Cormorant Garamond' }}>
                PERNAS
            </div>

            <div className="pernas-grid">
                {/* Botão Sem Pernas/Roupa */}
                <button
                    className={`pernas-opcao ${!pernaAtual ? 'ativada' : ''}`}
                    onClick={() => onPernaChange(null)}
                >
                    <span style={{fontSize:'0.7rem', color:'#555'}}>Sem</span>
                </button>

                {/* Lista de Roupas */}
                {listaSegura.map((nomeRoupa) => (
                    <button
                        key={nomeRoupa}
                        className={`pernas-opcao ${pernaAtual === nomeRoupa ? 'ativada' : ''}`}
                        onClick={() => onPernaChange(nomeRoupa)}
                        title={nomeRoupa}
                    >
                        <img 
                            src={getImagePath(nomeRoupa)} 
                            alt={nomeRoupa}
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            onError={(e) => {
                                // Fallback em caso de erro na imagem
                                e.target.style.display = 'none'; 
                                e.target.parentNode.innerText = nomeRoupa;
                                e.target.parentNode.style.fontSize = '0.6rem';
                                e.target.parentNode.style.color = 'white';
                            }} 
                        />
                    </button>
                ))}
            </div>

            <div className="variantes-pernas-container">
                <label className='lbl-pernas'>VARIAÇÃO</label>
                <div className="variantes-pernas">
                    {(variantesDisponiveis && variantesDisponiveis.length > 0 ? variantesDisponiveis : ['bottom-1']).map((variante) => (
                        <button
                            key={variante}
                            className={`variante-pernas ${varianteAtual === variante ? 'ativada' : ''}`}
                            style={{ 
                                backgroundColor: '#555', border: '1px solid #777',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'white', fontSize: '0.7rem'
                            }}
                            onClick={() => onVarianteChange(variante)}
                            title={variante}
                        >
                            {/* Limpa o texto para mostrar apenas números ou letras relevantes */}
                            {variante.replace('bottom-', '').replace('Bottom-', '').replace('top-', '')}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MenuPernas;