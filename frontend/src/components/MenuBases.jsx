import React from 'react';
// Certifique-se de que o caminho do CSS está correto
import './MenuBases.css'; 

// Bases disponíveis (Ajuste esta lista para corresponder exatamente aos nomes de arquivos 
// minúsculos das suas imagens, ex: base-1.png, base-2.png)
const BASES_DISPONIVEIS = ['base-1', 'base-2', 'base-3']; 

/**
 * Componente de menu para selecionar a base da miniatura.
 * @param {object} props
 * @param {string | null} props.baseMini - A base atualmente selecionada.
 * @param {function} props.atualizarPersonagem - Função do hook para atualizar o estado.
 */
function MenuBases({ baseMini, atualizarPersonagem }) {

    const handleBaseChange = (baseNome) => {
        atualizarPersonagem('baseMini', baseNome);
    };

    return (
        <div className="container-menu-bases">
            
            <label className='lbl-base'>SELECIONE A BASE</label>

            {/* 1. Opções da Base (Grid) */}
            <div className="base-grid">
                
                {/* Botão para Remover Base (Null) */}
                <button
                    className={`base-opcao ${!baseMini ? 'ativada' : ''}`}
                    onClick={() => handleBaseChange(null)}
                    key="none"
                >
                    {/* Placeholder para o botão 'Nula' */}
                    <span className="placeholder-none">
                        NULA
                    </span>
                </button>

                {/* Mapeia as bases disponíveis */}
                {BASES_DISPONIVEIS.map((baseNome) => (
                    <button
                        key={baseNome}
                        className={`base-opcao ${baseMini === baseNome ? 'ativada' : ''}`}
                        onClick={() => handleBaseChange(baseNome)}
                    >
                        <img 
                            // O caminho usa o nome simples da base
                            src={`/bases/${baseNome}.png`} 
                            alt={`Base ${baseNome}`} 
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = `<span>${baseNome.toUpperCase()}</span>`; 
                            }}
                        />
                    </button>
                ))}
            </div>

            {/* 2. Seção de Cor/Variante da Base (Mantida por consistência) */}
            <div className="cores-base-container">
                 {/* Você pode adicionar a lógica de cor/variante aqui se suas bases tiverem */}
            </div>
            
        </div>
    );
}

export default MenuBases;