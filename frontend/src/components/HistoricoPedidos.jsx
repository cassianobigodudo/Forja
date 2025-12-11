import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HistoricoPedidos.css';

const API_URL = "https://forja-qvex.onrender.com/api";

const HistoricoPedidos = ({ idUsuario }) => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- 1. BUSCA PEDIDOS ---
  const fetchPedidos = async () => {
    const id = idUsuario || localStorage.getItem('id_usuario');
    if (!id) return;

    try {
      const response = await axios.get(`${API_URL}/pedidos/por-sessao/${id}`);
      setPedidos(response.data);
    } catch (error) {
      console.error("Erro ao buscar histórico:", error);
    }
  };

  useEffect(() => {
    fetchPedidos();
    const intervalo = setInterval(fetchPedidos, 5000);
    return () => clearInterval(intervalo);
  }, [idUsuario]);


  // --- 2. AÇÃO DE PEGAR O PEDIDO (DEVOLVENDO AO ESTOQUE) ---
  const handleColetar = async (slot, pedidoId) => {
    if (!window.confirm(`Retirar pedido do BOX ${slot}?`)) return;

    try {
      setLoading(true);
      // Apontamos para a rota que faz DEVOLUÇÃO + CONCLUSÃO
      await axios.post(`${API_URL}/estoque/expedicao/${slot}/liberar`);
      
      alert("Sucesso! Pedido retirado.");
      fetchPedidos(); 
    } catch (error) {
      console.error(error);
      alert("Erro ao retirar pedido.");
    } finally {
      setLoading(false);
    }
  };

  // --- AUXILIAR: FORMATAR VALOR ---
  const formatarValor = (valor) => {
    if (!valor) return 'R$ 84,90';
    // Converte string "50,00" para numero se necessário, ou usa direto se for numérico
    const numero = typeof valor === 'string' ? parseFloat(valor.replace(',', '.')) : Number(valor);
    if (isNaN(numero)) return 'R$ 84,90';
    return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // --- 3. RENDERIZAÇÃO ---
  const renderStatus = (pedido) => {
    if (pedido.status === 'CONCLUIDO' || pedido.status === 'ENTREGUE_AO_CLIENTE') {
      return <span className="badge badge-concluido">✅ Concluído</span>;
    }
    if (pedido.status === 'PRONTO' && pedido.slot) {
      return (
        <div className="badge-expedicao">
            <span className="pulse">●</span> Aguardando Retirada
        </div>
      );
    }
    return <span className="badge badge-processando">Concluído</span>;
  };

  return (
    <div className="container-historico-pedidos">
      <h2 className="titulo-historico">Meus Pedidos</h2>
      
      <div className="lista-linear-pedidos">
        {pedidos.length === 0 && <p className="sem-pedidos">Nenhum pedido realizado ainda.</p>}

        {pedidos.map((pedido) => (
          <div key={pedido.pedido_id} className={`row-pedido status-${pedido.status.toLowerCase()}`}>
            
            <div className="img-lateral">
                <img src={pedido.img || 'https://via.placeholder.com/100'} alt={pedido.nome_personagem} />
            </div>

            <div className="info-central">
                <div className="topo-info">
                    <h3>{pedido.nome_personagem}</h3>
                    <span className="id-pedido">
                        #{pedido.orderid_externo?.split('-')[2] || pedido.pedido_id}
                    </span>
                </div>
                
                <p className="data-hora">
                    {new Date(pedido.data_pedido).toLocaleDateString()} às {new Date(pedido.data_pedido).toLocaleTimeString().slice(0,5)}
                </p>
                
                {/* VALOR DINÂMICO AGORA */}
                <p className="valor-item">
                    {formatarValor(pedido.valor)}
                </p>
            </div>

            <div className="status-direita">
                {renderStatus(pedido)}

                {pedido.status === 'PRONTO' && pedido.slot && (
                    <div className="box-action">
                        <span className="box-number">BOX {pedido.slot}</span>
                        <button 
                            className="btn-coletar-row"
                            onClick={() => handleColetar(pedido.slot, pedido.pedido_id)}
                            disabled={loading}
                        >
                            {loading ? '...' : 'PEGAR PEDIDO'}
                        </button>
                    </div>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoricoPedidos;