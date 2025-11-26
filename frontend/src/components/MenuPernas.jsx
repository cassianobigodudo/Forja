import React from 'react';
import './MenuCabelos.css'; 

function MenuPernas({ 
    onPernaChange, 
    onVarianteChange, 
    pernaAtual, 
    varianteAtual, 
    pernasDisponiveis, 
    variantesDisponiveis 
}) {
    // Safety check
    const listaSegura = Array.isArray(pernasDisponiveis) ? pernasDisponiveis : [];

    return (
        <div className="container-menu-cabelos">
            <div style={{ textAlign: 'center', color: '#fff', padding: '10px', fontSize: '1.2rem', fontFamily: 'Cormorant Garamond' }}>
                PERNAS
            </div>

            <div className="cabelos-grid">
                <button
                    className={`cabelo-opcao ${!pernaAtual ? 'ativada' : ''}`}
                    onClick={() => onPernaChange(null)}
                >
                    <span style={{fontSize:'0.7rem', color:'#555'}}>Sem</span>
                </button>

                {listaSegura.map((nomeRoupa) => (
                    <button
                        key={nomeRoupa}
                        className={`cabelo-opcao ${pernaAtual === nomeRoupa ? 'ativada' : ''}`}
                        onClick={() => onPernaChange(nomeRoupa)}
                    >
                        <img 
                            src={`./icones/roupas/${nomeRoupa.toLowerCase()}.png`} 
                            alt={nomeRoupa}
                            onError={(e) => {
                                e.target.style.display='none'; 
                                e.target.parentNode.innerText = nomeRoupa
                            }} 
                        />
                    </button>
                ))}
            </div>

            <div className="cores-cabelo-container">
                <label className='lbl-cabelo'>VARIAÇÃO</label>
                <div className="cores-cabelo">
                    {(variantesDisponiveis && variantesDisponiveis.length > 0 ? variantesDisponiveis : ['1']).map((variante) => (
                        <button
                            key={variante}
                            className={`cor-cabelo ${varianteAtual === variante ? 'ativada' : ''}`}
                            style={{ 
                                backgroundColor: '#555', border: '1px solid #777',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'white', fontSize: '0.7rem'
                            }}
                            onClick={() => onVarianteChange(variante)}
                        >
                            {variante.replace('top-', '').replace('Top-', '').replace('bottom-', '')}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MenuPernas;