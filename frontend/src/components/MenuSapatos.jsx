import React from 'react';
import './MenuSapatos.css'; 

function MenuSapatos({ 
    genero = 'FEMININO', // <--- ADICIONADO: Necessário para achar a pasta certa
    onSapatoChange, 
    onVarianteChange, 
    sapatoAtual, 
    varianteAtual, 
    sapatosDisponiveis, 
    variantesDisponiveis 
}) {
    const listaSegura = Array.isArray(sapatosDisponiveis) ? sapatosDisponiveis : [];
    const variantesSeguras = Array.isArray(variantesDisponiveis) ? variantesDisponiveis : [];

    // Função para pegar a imagem real do sapato (Variante 1 como padrão)
    const getImagePath = (nomeSapato) => {
        // Ex: /personagem-FEMININO/SAPATOS/BotasAltas-1.png
        return `/personagem-${genero}/SAPATOS/${nomeSapato}-1.png`;
    };

    return (
        <div className="container-menu-sapatos">
            <div style={{ textAlign: 'center', color: '#fff', padding: '10px', fontSize: '1.2rem', fontFamily: 'Cormorant Garamond' }}>
                SAPATOS
            </div>

            {/* --- GRID DE MODELOS --- */}
            <div className="sapatos-grid">
                {/* Botão Descalço */}
                <button
                    className={`sapatos-opcao ${!sapatoAtual ? 'ativada' : ''}`}
                    onClick={() => onSapatoChange(null)}
                >
                   <span style={{fontSize:'0.7rem', color:'#555'}}>Descalço</span>
                </button>

                {/* Lista de Sapatos */}
                {listaSegura.map((nomeSapato) => (
                    <button
                        key={nomeSapato}
                        className={`sapatos-opcao ${sapatoAtual === nomeSapato ? 'ativada' : ''}`}
                        onClick={() => onSapatoChange(nomeSapato)}
                        title={nomeSapato}
                    >
                        <img 
                            src={getImagePath(nomeSapato)} 
                            alt={nomeSapato}
                            // Estilo para garantir que cabe no botão
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            onError={(e) => {
                                // Fallback se a imagem não existir
                                e.target.style.display='none'; 
                                e.target.parentNode.innerText = nomeSapato;
                                e.target.parentNode.style.fontSize = '0.6rem';
                                e.target.parentNode.style.color = 'white';
                            }} 
                        />
                    </button>
                ))}
            </div>

            {/* --- VARIAÇÕES --- */}
            {sapatoAtual && variantesSeguras.length > 0 && (
                <div className="variantes-sapatos-container">
                    <label className='lbl-sapatos'>Estilo Lateral</label>
                    
                    <div className="variantes-sapatos">
                        {variantesSeguras.map((variante) => (
                            <button
                                key={variante}
                                className={`variante-sapato ${varianteAtual === variante ? 'ativada' : ''}`}
                                onClick={() => onVarianteChange(variante)}
                            >
                                {variante}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default MenuSapatos;