import React from 'react';
import './MenuCabelos.css';

function MenuCabelos({ 
    genero = 'FEMININO', // Valor padrão caso não seja passado
    onCabeloChange, 
    onCorCabeloChange, 
    cabeloAtual, 
    corCabeloAtual, 
    cabelosDisponiveis, 
    coresCabeloDisponiveis 
}) {

    const formatName = (name) => {
        return name.toUpperCase().replace(/\s+/g, '-');
    };

    const getImagePath = (nomeCabelo) => {
        const formattedName = formatName(nomeCabelo);
        
        
        const nomePasta = `CABELO-${formattedName}`;
        const nomeArquivo = `CABELO-${formattedName}-PRETO.png`; // Usamos BRANCO para o ícone de preview

        return `/personagem-${genero}/CABELOS-${genero}/${nomePasta}/${nomeArquivo}`;
    };

    return (
        <div className="container-menu-cabelos">
            <div className="cabelos-grid">
                {cabelosDisponiveis.map((nomeCabelo) => (
                    <button
                        key={nomeCabelo}
                        className={`cabelo-opcao ${cabeloAtual === nomeCabelo ? 'ativada' : ''}`}
                        onClick={() => onCabeloChange(nomeCabelo)}
                    >
                        <img 
                            src={getImagePath(nomeCabelo)} 
                            alt={nomeCabelo} 
                            // Esconde a imagem se o caminho estiver errado para não mostrar ícone quebrado
                            onError={(e) => e.target.style.display = 'none'}
                        />
                    </button>
                ))}
                
                {/* Botão para "Careca" / Remover Cabelo */}
                <button
                    className={`cabelo-opcao ${!cabeloAtual ? 'ativada' : ''}`}
                    onClick={() => onCabeloChange(null)}
                >
                    {/* Se quiser um ícone de 'X' ou 'Proibido', coloque aqui */}
                </button>
            </div>

            <div className="cores-cabelo-container">
                <label className='lbl-cabelo'>CORES DE CABELO</label>
                <div className="cores-cabelo">
                    {coresCabeloDisponiveis.map((cor) => (
                        <button
                            key={cor.nome}
                            className={`cor-cabelo ${corCabeloAtual === cor.nome ? 'ativada' : ''}`}
                            style={{ backgroundColor: cor.color }}
                            onClick={() => onCorCabeloChange(cor.nome)}
                        ></button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MenuCabelos;