import React from 'react';
import './MenuCabelos.css';

function MenuCabelos({ onCabeloChange, onCorCabeloChange, cabeloAtual, corCabeloAtual, cabelosDisponiveis, coresCabeloDisponiveis }) {
    return (
        <div className="container-menu-cabelos">
            <div className="cabelos-grid">
                {cabelosDisponiveis.map((nomeCabelo) => (
                    <button
                        key={nomeCabelo}
                        className={`cabelo-opcao ${cabeloAtual === nomeCabelo ? 'ativada' : ''}`}
                        onClick={() => onCabeloChange(nomeCabelo)}
                    >
                        <img src={`./icones/cabelos/${nomeCabelo.toLowerCase().replace(/\s/g, '')}.png`} alt={nomeCabelo} />
                    </button>
                ))}
                <button
                    className={`cabelo-opcao ${!cabeloAtual ? 'ativada' : ''}`}
                    onClick={() => onCabeloChange(null)}
                >
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