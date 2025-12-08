import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { useGlobalContext } from '../context/GlobalContext';
import BoxItem from './BoxItem'; // Reutilizamos seu componente de pedidos
import './HistoricoPedidos.css';

function HistoricoPedidos() {
  const navigate = useNavigate();
  
  // 1. DADOS DO CARRINHO (Contexto Global)
  const { carrinho, removerDoCarrinho, idUsuario } = useGlobalContext();

  // 2. DADOS DOS PEDIDOS (Banco de Dados)
  const [pedidosAntigos, setPedidosAntigos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = "https://forja-qvex.onrender.com/api"; 

  // Busca o histórico no banco assim que o usuario logado for identificado
  useEffect(() => {
    const fetchPedidos = async () => {
      if (!idUsuario) return;

      try {
        const response = await axios.get(`${API_URL}/pedidos/por-sessao/${idUsuario}`);
        setPedidosAntigos(response.data); 
      } catch (err) {
        console.error("Erro ao buscar histórico:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPedidos();
  }, [idUsuario]);

  // Função para ir pro pagamento (caso tenha itens no carrinho)
  const irParaPagamento = () => {
    navigate('/pagamento');
  };

  return (
    <div className='container-historico-geral'>
      
      <h1 className="titulo-pagina-historico">📜 Diário de Aventuras</h1>

      {/* --- SEÇÃO 1: O CARRINHO (MOCHILA) --- */}
      <section className="secao-historico">
        <div className="cabecalho-secao">
          <h2>🎒 Mochila (Carrinho Atual)</h2>
          {carrinho.length > 0 && (
            <button onClick={irParaPagamento} className="btn-finalizar-sessao">
              Finalizar Compra ⚔️
            </button>
          )}
        </div>

        <div className="lista-cards-carrinho">
          {carrinho.length === 0 ? (
            <p className="texto-vazio">Sua mochila está vazia. Visite a loja para equipar-se.</p>
          ) : (
            carrinho.map((item) => (
              <div key={item.id_carrinho_item} className="card-carrinho-historico">
                <img src={item.img} alt={item.nome} className="img-carrinho-historico" />
                <div className="info-carrinho-historico">
                  <h3>{item.nome || "Aventureiro Desconhecido"}</h3>
                  <p className="preco-carrinho">
                    {Number(item.valor || 84.90).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                  <span className="status-badge-carrinho">Em Planejamento</span>
                </div>
                <button 
                  className="btn-remover-historico"
                  onClick={() => removerDoCarrinho(item.id_carrinho_item)}
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      <div className="divisor-secoes"></div>

      {/* --- SEÇÃO 2: HISTÓRICO DE PEDIDOS (FORJA) --- */}
      <section className="secao-historico">
        <div className="cabecalho-secao">
          <h2>⚒️ Histórico da Forja (Pedidos Realizados)</h2>
        </div>

        {isLoading ? (
          <p className="carregando-texto">Consultando os livros antigos...</p>
        ) : (
          <div className="lista-pedidos-antigos">
            {pedidosAntigos.length === 0 ? (
              <p className="texto-vazio">Nenhum pedido foi forjado anteriormente.</p>
            ) : (
              // AQUI REUTILIZAMOS O SEU BOXITEM QUE JÁ ESTÁ PRONTO
              pedidosAntigos.map(pedido => (
                <BoxItem key={pedido.pedido_id || pedido.id} pedido={pedido} />
              ))
            )}
          </div>
        )}
      </section>

    </div>
  );
}

export default HistoricoPedidos;