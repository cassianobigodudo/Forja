import React from 'react';
import './MenuCabelos.css'; // Reutiliza o CSS para manter o padrão visual

function MenuTorso({ 
    onTorsoChange, 
    onVarianteChange, 
    torsoAtual, 
    varianteAtual, 
    torsosDisponiveis, 
    variantesDisponiveis 
}) {
    return (
        <div className="container-menu-cabelos">
            {/* Título Opcional para manter consistência visual no topo */}
            <div style={{ textAlign: 'center', color: '#fff', padding: '10px', fontSize: '1.2rem', fontFamily: 'Cormorant Garamond' }}>
                TORSO
            </div>

            {/* GRID DE ROUPAS */}
            <div className="cabelos-grid">
                {/* Botão Remover */}
                <button
                    className={`cabelo-opcao ${!torsoAtual ? 'ativada' : ''}`}
                    onClick={() => onTorsoChange(null)}
                >
                   <span style={{fontSize:'0.7rem', color:'#555'}}>Sem</span>
                </button>

                {/* Lista de Roupas */}
                {torsosDisponiveis.map((nomeRoupa) => (
                    <button
                        key={nomeRoupa}
                        className={`cabelo-opcao ${torsoAtual === nomeRoupa ? 'ativada' : ''}`}
                        onClick={() => onTorsoChange(nomeRoupa)}
                    >
                        {/* Ícone: ./icones/roupas/guerreiro.png */}
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

            {/* BARRA DE VARIAÇÕES (Igual Cor de Cabelo) */}
            <div className="cores-cabelo-container">
                <label className='lbl-cabelo'>VARIAÇÃO / ESTILO</label>
                <div className="cores-cabelo">
                    {/* Se não houver variantes, mostra pelo menos uma padrão */}
                    {(variantesDisponiveis && variantesDisponiveis.length > 0 ? variantesDisponiveis : ['top-1']).map((variante) => (
                        <button
                            key={variante}
                            className={`cor-cabelo ${varianteAtual === variante ? 'ativada' : ''}`}
                            style={{ 
                                backgroundColor: '#555', 
                                border: '1px solid #777',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '0.7rem'
                            }}
                            onClick={() => onVarianteChange(variante)}
                            title={variante}
                        >
                            {/* Mostra '1', '2' ao invés de 'top-1' */}
                            {variante.replace('top-', '').replace('Top-', '')}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MenuTorso;