import React from 'react';
// Vamos reutilizar o mesmo CSS dos outros menus
import './MenuAcessorios.css'; 

// Lista de marcas visíveis, baseada nos seus arquivos
const MARCAS_DISPONIVEIS = [
  { nome: 'CICATRIZ-NARIZ', categoria: 'MARCAS' },
  { nome: 'CICATRIZ-OLHO', categoria: 'MARCAS' },
  { nome: 'SARDAS', categoria: 'MARCAS' }
];

// Props que ele espera receber do MenuSecCorpo:
// genero, marcasAtual, onMarcasChange
function MenuMarcas({ genero, marcasAtual, onMarcasChange }) {

  // Lógica de clique (permite apenas 1)
  const handleMarcasClick = (nomeItem) => {
    const jaSelecionado = marcasAtual === nomeItem;
    
    if (jaSelecionado) {
      onMarcasChange(null); // Desmarca
    } else {
      onMarcasChange(nomeItem); // Marca
    }
  };

  // Caminho da imagem
  const getImagePath = (item) => {
    // Baseado na sua estrutura de pastas (MARCAS está dentro de ACESSORIOS)
  	return `/personagem-${genero}/ACESSORIOS-${genero}S/${item.categoria}/${item.nome}.png`;
  };

  return (
    // Reutilizando as classes CSS
  	<div className="acessorios-secao" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', marginTop: '10px', paddingTop: '10px' }}>
  	  <label className="lbl-acessorio">MARCAS</label>
  	  <div className="acessorios-grid">
  	  {MARCAS_DISPONIVEIS.map((item) => {
  		const isAtivo = marcasAtual === item.nome;
  		return (
  		 <button
  		  key={item.nome}
  		  className={`acessorio-opcao ${isAtivo ? 'ativada' : ''}`}
  		  onClick={() => handleMarcasClick(item.nome)}
  		 >
  		  <img src={getImagePath(item)} alt={item.nome} />
  		 </button>
  		  );
  		})}
  		{/* Botão de "Nenhum" para marcas */}
  		<button
  		  className={`acessorio-opcao ${!marcasAtual ? 'ativada' : ''}`}
  		  onClick={() => onMarcasChange(null)}
  		>
  		</button>
  		</div>
  	  </div>
  );
}

export default MenuMarcas;