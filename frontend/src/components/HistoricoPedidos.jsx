import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { useGlobalContext } from '../context/GlobalContext';
import BoxItem from './BoxItem'; // Seu componente existente
import './HistoricoPedidos.css';

function HistoricoPedidos() {
  const navigate = useNavigate();
  
  // 1. DADOS DO CONTEXTO
  const { carrinho, removerDoCarrinho, idUsuario } = useGlobalContext();

  // 2. ESTADOS LOCAIS
  const [pedidosAntigos, setPedidosAntigos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = "https://forja-qvex.onrender.com/api"; 

  // Função auxiliar para formatar BRL
  const formatarMoeda = (valor) => {
    return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // Busca histórico
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

  const irParaPagamento = () => {
    navigate('/pagamento');
  };

  return (
    <div className="conteudo-historico-rpg">
      
      <header className="header-historico">
        <h1 className="titulo-rpg">📜 Diário de Aventuras</h1>
        <p className="subtitulo-rpg">Gerencie seus espólios e reveja suas conquistas passadas.</p>
      </header>

      {/* --- SEÇÃO 1: O CARRINHO (MOCHILA) --- */}
      <section className="secao-rpg">
        <div className="cabecalho-secao">
          <h2>🎒 Mochila de Equipamentos <span className="contador-item">({carrinho.length})</span></h2>
          
          {carrinho.length > 0 && (
            <button onClick={irParaPagamento} className="btn-rpg-acao principal">
              Finalizar Missão (Pagar) ⚔️
            </button>
          )}
        </div>

        <div className="grid-cards-rpg">
          {carrinho.length === 0 ? (
            <div className="card-vazio">
              <p>Sua mochila está leve... Talvez leve demais.</p>
              <small>Visite a loja para se equipar.</small>
            </div>
          ) : (
            carrinho.map((item) => (
              <div key={item.id_carrinho_item} className="card-item-rpg">
                <div className="img-wrapper">
                    <img src={item.img} alt={item.nome} />
                </div>
                <div className="info-item">
                  <h3>{item.nome || "Item Misterioso"}</h3>
                  <p className="preco-item">
                    {formatarMoeda(item.valor || 84.90)}
                  </p>
                  <span className="badge-status">Na Mochila</span>
                </div>
                <button 
                  className="btn-remover-item"
                  onClick={() => removerDoCarrinho(item.id_carrinho_item)}
                  title="Descartar Item"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      <hr className="divisor-rpg" />

      {/* --- SEÇÃO 2: HISTÓRICO (FORJA) --- */}
      <section className="secao-rpg">
        <div className="cabecalho-secao">
          <h2>⚒️ Registros da Forja</h2>
        </div>

        {isLoading ? (
          <div className="loading-rpg">
            <div className="spinner-rune"></div>
            <p>Consultando os pergaminhos antigos...</p>
          </div>
        ) : (
          <div className="lista-pedidos-antigos">
            {pedidosAntigos.length === 0 ? (
              <div className="card-vazio">
                <p>Nenhum pedido forjado anteriormente.</p>
              </div>
            ) : (
              // O Container do BoxItem deve respeitar a largura
              <div className="wrapper-pedidos">
                 {pedidosAntigos.map(pedido => (
                    <BoxItem key={pedido.pedido_id || pedido.id} pedido={pedido} />
                 ))}
              </div>
            )}
          </div>
        )}
      </section>

    </div>
  );
}

export default HistoricoPedidos;