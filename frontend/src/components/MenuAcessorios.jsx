import React from 'react';
import './MenuAcessorios.css'; 

const ACESSORIOS_CABECA_DISPONIVEIS = [
  { nome: 'CAPACETE-CAVALEIRO', categoria: 'CAPACETES' },
  { nome: 'CAPACETE-DARK', categoria: 'CAPACETES' },
  { nome: 'CAPACETE-MADEIRA', categoria: 'CAPACETES' },
  { nome: 'CAPACETE-TRIBAL-MASCARA', categoria: 'CAPACETES' },
  { nome: 'CAPACETE-TRIBAL', categoria: 'CAPACETES' },
  { nome: 'MASCARA', categoria: 'CAPACETES' },
  { nome: 'ARGOLA', categoria: 'REPETIVEIS' },
  { nome: 'CHAPEU-SOL-EMBAIXO', categoria: 'REPETIVEIS' },
  { nome: 'CHAPEU-SOL-TOPO', categoria: 'REPETIVEIS' },
  { nome: 'OCULOS', categoria: 'REPETIVEIS' }
];

const ACESSORIOS_PESCOCO_DISPONIVEIS = [
  { nome: 'COLAR', categoria: 'PESCOCO' }
];


// --- CORREÇÃO 1: Adicionado valores padrão ---
function MenuAcessorios({ 
  genero, 
  acessoriosCabecaAtuais = [], // <--- CORRIGE O ERRO 'includes'
  acessorioPescocoAtual = null, // <--- Boa prática
  onAcessoriosCabecaChange, 
  onAcessorioPescocoChange 
}) {

  // Handler para Acessórios da Cabeça (permite até 2)
  const handleCabecaClick = (nomeItem) => {
    const jaSelecionado = acessoriosCabecaAtuais.includes(nomeItem);
    let novosAcessorios = [...acessoriosCabecaAtuais];

    if (jaSelecionado) {
      novosAcessorios = novosAcessorios.filter(item => item !== nomeItem);
    } else {
      if (novosAcessorios.length < 2) {
        novosAcessorios.push(nomeItem);
      } else {
        novosAcessorios.shift(); 
        novosAcessorios.push(nomeItem);
      }
    }
    onAcessoriosCabecaChange(novosAcessorios);
  };

  // Handler para Acessórios do Pescoço (permite apenas 1)
  const handlePescocoClick = (nomeItem) => {
    const jaSelecionado = acessorioPescocoAtual === nomeItem;
    
    if (jaSelecionado) {
      onAcessorioPescocoChange(null); 
    } else {
      onAcessorioPescocoChange(nomeItem);
    }
  };

  // Caminho da imagem (corrigido para usar caminhos absolutos)
  const getImagePath = (item) => {
    return `/personagem-${genero}/ACESSORIOS-${genero}S/${item.categoria}/${item.nome}.png`;
  };

  return (
    <div className="container-menu-acessorios">

      {/* Seção Cabeça */}
      <div className="acessorios-secao">
        <label className="lbl-acessorio">CABEÇA (Máx. 2)</label>
        <div className="acessorios-grid">
          {ACESSORIOS_CABECA_DISPONIVEIS.map((item) => {
            const isAtivo = acessoriosCabecaAtuais.includes(item.nome);
            return (
              <button
                key={item.nome}
                className={`acessorio-opcao ${isAtivo ? 'ativada' : ''}`}
                onClick={() => handleCabecaClick(item.nome)}
              >
                <img src={getImagePath(item)} alt={item.nome} />
              </button>
            ); // <--- CORREÇÃO 2: Removido o 'e' daqui
          })}
          {/* Botão de "Nenhum" para a cabeça */}
          <button
            className={`acessorio-opcao ${acessoriosCabecaAtuais.length === 0 ? 'ativada' : ''}`}
            onClick={() => onAcessoriosCabecaChange([])}
          >
          </button>
        </div>
      </div>

      {/* Seção Pescoço */}
      <div className="acessorios-secao">
        <label className="lbl-acessorio">PESCOÇO</label>
        <div className="acessorios-grid">
        {ACESSORIOS_PESCOCO_DISPONIVEIS.map((item) => {
            const isAtivo = acessorioPescocoAtual === item.nome;
            return (
              <button
                key={item.nome}
                className={`acessorio-opcao ${isAtivo ? 'ativada' : ''}`}
                onClick={() => handlePescocoClick(item.nome)}
              >  {/* <--- CORRIGIDO */}
                <img src={getImagePath(item)} alt={item.nome} />
              </button>
            );
          })}
          {/* Botão de "Nenhum" para o pescoço */}
          <button
            className={`acessorio-opcao ${!acessorioPescocoAtual ? 'ativada' : ''}`}
            onClick={() => onAcessorioPescocoChange(null)}
          >
          </button> { /* <--- CORREÇÃO 3: Removido o 'S' daqui */ }
        </div>
      </div>

    </div>
  );
}

export default MenuAcessorios;