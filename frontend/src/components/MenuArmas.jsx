import React from 'react';
import './MenuArmas.css'; // <--- CSS Específico

function MenuArmas({ 
    onArmaChange, 
    armaAtual, 
    armasDisponiveis 
}) {
    const listaSegura = Array.isArray(armasDisponiveis) ? armasDisponiveis : [];

    // Baseado no seu Hook, as armas estão na pasta raiz /armas/
    const getImagePath = (nomeArma) => {
        return `/armas/${nomeArma}.png`;
    };

    return (
        <div className="container-menu-armas">
            <div style={{ textAlign: 'center', color: '#fff', padding: '10px', fontSize: '1.2rem', fontFamily: 'Cormorant Garamond' }}>
                ARMAS
            </div>

            <div className="armas-grid">
                {/* Botão de Remover (Mãos vazias) */}
                <button
                    className={`arma-opcao ${!armaAtual ? 'ativada' : ''}`}
                    onClick={() => onArmaChange(null)}
                >
                   <span style={{fontSize:'0.7rem', color:'#555'}}>Vazio</span>
                </button>

                {/* Lista de Armas */}
                {listaSegura.map((nomeArma) => (
                    <button
                        key={nomeArma}
                        className={`arma-opcao ${armaAtual === nomeArma ? 'ativada' : ''}`}
                        onClick={() => onArmaChange(nomeArma)}
                        title={nomeArma}
                    >
                        <img 
                            src={getImagePath(nomeArma)} 
                            alt={nomeArma}
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            onError={(e) => {
                                // Fallback visual caso a imagem falhe
                                e.target.style.display='none'; 
                                e.target.parentNode.innerText = nomeArma;
                                e.target.parentNode.style.fontSize = '0.6rem';
                                e.target.parentNode.style.color = 'white';
                            }} 
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}

export default MenuArmas;