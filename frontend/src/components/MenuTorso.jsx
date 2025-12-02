import React from 'react';
import './MenuTorso.css'; // <--- IMPORTANTE: Mudei o import

function MenuTorso({ 
    genero = 'FEMININO', 
    onTorsoChange, 
    onVarianteChange, 
    torsoAtual, 
    varianteAtual, 
    torsosDisponiveis, 
    variantesDisponiveis 
}) {
    const listaSegura = Array.isArray(torsosDisponiveis) ? torsosDisponiveis : [];

    const getImagePath = (nomeRoupa) => {
        return `/personagem-${genero}/ROUPAS-TORSO/${nomeRoupa}-top-1.png`;
    };

    return (
        <div className="container-menu-torso"> {/* Classe atualizada */}
            <div style={{ textAlign: 'center', color: '#fff', padding: '10px', fontSize: '1.2rem', fontFamily: 'Cormorant Garamond' }}>
                TORSO
            </div>

            <div className="torso-grid"> {/* Classe atualizada */}
                {/* Botão para Remover */}
                <button
                    className={`torso-opcao ${!torsoAtual ? 'ativada' : ''}`}
                    onClick={() => onTorsoChange(null)}
                >
                   <span style={{fontSize:'0.7rem', color:'#555'}}>Sem</span>
                </button>

                {/* Lista de Roupas */}
                {listaSegura.map((nomeRoupa) => (
                    <button
                        key={nomeRoupa}
                        className={`torso-opcao ${torsoAtual === nomeRoupa ? 'ativada' : ''}`}
                        onClick={() => onTorsoChange(nomeRoupa)}
                        title={nomeRoupa}
                    >
                        <img 
                            src={getImagePath(nomeRoupa)} 
                            alt={nomeRoupa}
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            onError={(e) => {
                                e.target.style.display = 'none'; 
                                e.target.parentNode.innerText = nomeRoupa;
                                e.target.parentNode.style.fontSize = '0.6rem';
                                e.target.parentNode.style.color = 'white';
                            }} 
                        />
                    </button>
                ))}
            </div>

            <div className="variantes-torso-container"> {/* Classe atualizada */}
                <label className='lbl-torso'>VARIAÇÃO / ESTILO</label>
                <div className="variantes-torso"> {/* Classe atualizada */}
                    {(variantesDisponiveis && variantesDisponiveis.length > 0 ? variantesDisponiveis : ['top-1']).map((variante) => (
                        <button
                            key={variante}
                            className={`variante-torso ${varianteAtual === variante ? 'ativada' : ''}`} // Classe atualizada
                            style={{ 
                                backgroundColor: '#555', border: '1px solid #777',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'white', fontSize: '0.7rem'
                            }}
                            onClick={() => onVarianteChange(variante)}
                            title={variante}
                        >
                            {variante.replace('top-', '').replace('Top-', '')}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MenuTorso;