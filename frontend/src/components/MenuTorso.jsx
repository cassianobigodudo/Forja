import React from 'react';
import './MenuCabelos.css'; 

function MenuTorso({ 
    onTorsoChange, 
    onVarianteChange, 
    torsoAtual, 
    varianteAtual, 
    torsosDisponiveis, 
    variantesDisponiveis 
}) {
    // PROTEÇÃO: Garante que é sempre um array
    const listaSegura = Array.isArray(torsosDisponiveis) ? torsosDisponiveis : [];

    return (
        <div className="container-menu-cabelos">
            <div style={{ textAlign: 'center', color: '#fff', padding: '10px', fontSize: '1.2rem', fontFamily: 'Cormorant Garamond' }}>
                TORSO
            </div>

            <div className="cabelos-grid">
                <button
                    className={`cabelo-opcao ${!torsoAtual ? 'ativada' : ''}`}
                    onClick={() => onTorsoChange(null)}
                >
                   <span style={{fontSize:'0.7rem', color:'#555'}}>Sem</span>
                </button>

                {/* Usar listaSegura aqui */}
                {listaSegura.map((nomeRoupa) => (
                    <button
                        key={nomeRoupa}
                        className={`cabelo-opcao ${torsoAtual === nomeRoupa ? 'ativada' : ''}`}
                        onClick={() => onTorsoChange(nomeRoupa)}
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
                <label className='lbl-cabelo'>VARIAÇÃO / ESTILO</label>
                <div className="cores-cabelo">
                    {(variantesDisponiveis && variantesDisponiveis.length > 0 ? variantesDisponiveis : ['top-1']).map((variante) => (
                        <button
                            key={variante}
                            className={`cor-cabelo ${varianteAtual === variante ? 'ativada' : ''}`}
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