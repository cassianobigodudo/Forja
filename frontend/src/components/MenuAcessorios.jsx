import React from 'react';
import './MenuAcessorios.css'; 

// --- CORREÇÃO 1: Categorias Atualizadas ---

// Itens que NÃO PODEM ser combinados com mais nada
const ITENS_EXCLUSIVOS = {
  'MASCARA': true,
  'CAPACETE-TRIBAL-MASCARA': true,
  'CAPACETE-CAVALEIRO': true, // <--- MOVIDO
  'CAPACETE-DARK': true,      // <--- MOVIDO
  'CAPACETE-MADEIRA': true,   // <--- MOVIDO
  'CAPACETE-TRIBAL': true      // <--- MOVIDO
};

// Itens que podem ser combinados com 1 item pequeno
const ITENS_GRANDES = {
  'CHAPEU-SOL-TOPO': true // Apenas o chapéu é "grande" agora
};

// ITENS_PEQUENOS são o resto (ARGOLA, OCULOS)


// A lista de botões visíveis continua a mesma
const ACESSORIOS_CABECA_DISPONIVEIS = [
  { nome: 'CAPACETE-CAVALEIRO', categoria: 'CAPACETES' },
  { nome: 'CAPACETE-DARK', categoria: 'CAPACETES' },
  { nome: 'CAPACETE-MADEIRA', categoria: 'CAPACETES' },
  { nome: 'CAPACETE-TRIBAL-MASCARA', categoria: 'CAPACETES' },
  { nome: 'CAPACETE-TRIBAL', categoria: 'CAPACETES' },
  { nome: 'MASCARA', categoria: 'CAPACETES' },
  { nome: 'ARGOLA', categoria: 'REPETIVEIS' },
  { nome: 'CHAPEU-SOL-TOPO', categoria: 'REPETIVEIS' },
  { nome: 'OCULOS', categoria: 'REPETIVEIS' }
];

const ACESSORIOS_PESCOCO_DISPONIVEIS = [
  { nome: 'COLAR', categoria: 'PESCOCO' }
];


function MenuAcessorios({ 
  genero, 
  acessoriosCabecaAtuais = [], 
  acessorioPescocoAtual = null, 
  onAcessoriosCabecaChange, 
  onAcessorioPescocoChange 
}) {

  // --- CORREÇÃO 2: Lógica de Clique (Inalterada, mas agora funciona com as novas categorias) ---
  const handleCabecaClick = (nomeItem) => {
  	const jaSelecionado = acessoriosCabecaAtuais.includes(nomeItem);
  	let novosAcessorios = [...acessoriosCabecaAtuais];

    const eExclusivo = !!ITENS_EXCLUSIVOS[nomeItem]; // Agora inclui capacetes
    const eGrande = !!ITENS_GRANDES[nomeItem];    // Agora é só o chapéu
    // Se não for Exclusivo nem Grande, é Pequeno

  	if (jaSelecionado) {
  	  // Desmarcar: simples, apenas remove
  	  novosAcessorios = novosAcessorios.filter(item => item !== nomeItem);
  	} else {
      // Marcar um item novo:
      
      if (eExclusivo) {
        // REGRA 1: Item exclusivo (Capacete/Máscara) substitui tudo
        novosAcessorios = [nomeItem];

      } else if (eGrande) {
        // REGRA 2: Item grande (Chapéu)
        // Mantém apenas os itens pequenos que já estavam lá
        const itensPequenos = novosAcessorios.filter(item => !ITENS_EXCLUSIVOS[item] && !ITENS_GRANDES[item]);
        // Adiciona o novo item grande
        novosAcessorios = [nomeItem, ...itensPequenos];
        // Garante o limite de 2 (o item grande + 1 pequeno mais antigo)
        if (novosAcessorios.length > 2) {
          novosAcessorios.pop(); // Remove o pequeno extra
        }

      } else {
        // REGRA 3: Item pequeno (Óculos/Argola)
        // Remove itens exclusivos (pois não podem ser combinados)
        novosAcessorios = novosAcessorios.filter(item => !ITENS_EXCLUSIVOS[item]);
        
        const itemGrande = novosAcessorios.find(item => ITENS_GRANDES[item]);
        const itensPequenos = novosAcessorios.filter(item => !ITENS_GRANDES[item]);

        if (itemGrande) {
          // Já tem um item grande (Chapéu), só pode ter 1 pequeno. Substitui o pequeno antigo.
          novosAcessorios = [itemGrande, nomeItem];
        } else {
          // Não tem item grande, pode ter 2 pequenos. Usa a fila normal.
          itensPequenos.push(nomeItem); // Adiciona o novo
          if (itensPequenos.length > 2) {
            itensPequenos.shift(); // Remove o mais antigo
          }
          novosAcessorios = itensPequenos;
        }
      }
  	}
  	onAcessoriosCabecaChange(novosAcessorios);
  };

  // Handler para Acessórios do Pescoço (lógica inalterada)
  const handlePescocoClick = (nomeItem) => {
  	const jaSelecionado = acessorioPescocoAtual === nomeItem;
  	
  	if (jaSelecionado) {
  	  onAcessorioPescocoChange(null); 
  	} else {
  	  onAcessorioPescocoChange(nomeItem);
  	}
  };

  // Caminho da imagem (lógica inalterada)
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
  			);
  		  })}
  		  {/* Botão de "Nenhum" para a cabeça */}
  		  <button
  			className={`acessorio-opcao ${acessoriosCabecaAtuais.length === 0 ? 'ativada' : ''}`}
  			onClick={() => onAcessoriosCabecaChange([])}
  		  >
  		  </button>
  		</div>
  	  </div>

  	  {/* Seção Pescoço (inalterada) */}
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
  	   >
  		<img src={getImagePath(item)} alt={item.nome} />
  	   </button>
  		  );
  		})}
  		{/* Botão de "Nenhum" para o pescoço */}
  		<button
  		  className={`acessorio-opcao ${!acessorioPescocoAtual ? 'ativada' : ''}`}
  		  onClick={() => onAcessorioPescocoChange(null)}
  		>
  		</button>
  		</div>
  	  </div>

  	</div>
  );
}

export default MenuAcessorios;