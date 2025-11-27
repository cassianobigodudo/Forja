import React from 'react';
import './MenuCabelos.css'; 

function MenuSapatos({ 
    onSapatoChange, 
    onVarianteChange, 
    sapatoAtual, 
    varianteAtual, 
    sapatosDisponiveis, 
    variantesDisponiveis 
}) {
    const listaSegura = Array.isArray(sapatosDisponiveis) ? sapatosDisponiveis : [];

    return (
        <div className="container-menu-cabelos">
            <div style={{ textAlign: 'center', color: '#fff', padding: '10px', fontSize: '1.2rem', fontFamily: 'Cormorant Garamond' }}>
                SAPATOS
            </div>

            <div className="cabelos-grid">
                <button
                    className={`cabelo-opcao ${!sapatoAtual ? 'ativada' : ''}`}
                    onClick={() => onSapatoChange(null)}
                >
                   <span style={{fontSize:'0.7rem', color:'#555'}}>Descalço</span>
                </button>

                {listaSegura.map((nomeSapato) => (
                    <button
                        key={nomeSapato}
                        className={`cabelo-opcao ${sapatoAtual === nomeSapato ? 'ativada' : ''}`}
                        onClick={() => onSapatoChange(nomeSapato)}
                    >
                        {/* Assumindo que você tem ícones ou quer mostrar apenas o nome */}
                        <img 
                            src={`./icones/sapatos/${nomeSapato.toLowerCase()}.png`} 
                            alt={nomeSapato}
                            onError={(e) => {
                                e.target.style.display='none'; 
                                e.target.parentNode.innerText = nomeSapato
                            }} 
                        />
                    </button>
                ))}
            </div>
            {/* Ocultar variantes se houver apenas 1, opcional */}
        </div>
    );
}

export default MenuSapatos;