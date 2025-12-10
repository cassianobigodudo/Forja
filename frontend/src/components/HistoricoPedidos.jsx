import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HistoricoPedidos.css'; // O CSS que vamos criar abaixo

const API_URL = "https://forja-qvex.onrender.com/api";
// URL da API do professor (Exemplo)
const PROFESSOR_API = 'http://52.72.137.244:3000'; // Ajuste conforme necessário

const HistoricoPedidos = ({ idUsuario }) => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- 1. BUSCA E SINCRONIZAÇÃO (O ESPIÃO) ---
  const fetchPedidos = async () => {
    const id = idUsuario || localStorage.getItem('id_usuario');
    if (!id) return;

    try {
      // A. Busca Local
      const response = await axios.get(`${API_URL}/pedidos/por-sessao/${id}`);
      const pedidosLocais = response.data;
      setPedidos(pedidosLocais);

      // B. Verifica API Externa (Polling)
      pedidosLocais.forEach(async (pedido) => {
        // Ignora se já finalizou ou se não tem ID externo
        if (pedido.status === 'CONCLUIDO' || !pedido.orderid_externo) return;
        
        // Ignora se JÁ TEM slot (já sabemos que está pronto)
        if (pedido.slot) return;

        try {
          const { data: dadosExternos } = await axios.get(`${PROFESSOR_API}/queue/items/${pedido.orderid_externo}`);

          // C. Gatilho: Se lá fora terminou e aqui ainda não tem slot
          if ((dadosExternos.stage === 'EXPEDICAO' || dadosExternos.stage === 'ENTREGUE') && !pedido.slot) {
            console.log(`🚀 Pedido ${pedido.pedido_id} pronto! Alocando vaga...`);
            
            await axios.post(`${API_URL}/expedicao/alocar`, { 
              pedidoId: pedido.pedido_id,
              orderIdExterno: pedido.orderid_externo
            });
            // O próximo setInterval vai atualizar a tela com o slot
          }
        } catch (error) {
           // Silencia erros de fetch externo para não sujar o console
        }
      });

    } catch (error) {
      console.error("Erro ao buscar histórico:", error);
    }
  };

  // Roda a cada 5 segundos
  useEffect(() => {
    fetchPedidos();
    const intervalo = setInterval(fetchPedidos, 5000);
    return () => clearInterval(intervalo);
  }, [idUsuario]);


  // --- 2. AÇÃO DE PEGAR O PEDIDO ---
  const handleColetar = async (slot, pedidoId) => {
    if (!window.confirm(`Confirmar retirada no BOX ${slot}?`)) return;

    try {
      setLoading(true);
      // Chama a rota que baixa estoque e libera slot
      await axios.post(`${API_URL}/expedicao/${slot}/entrega`);
      
      alert("Sucesso! Pedido retirado.");
      fetchPedidos(); // Atualiza a tela imediatamente
    } catch (error) {
      console.error(error);
      alert("Erro ao retirar pedido.");
    } finally {
      setLoading(false);
    }
  };


  // --- 3. RENDERIZAÇÃO VISUAL DOS STATUS ---
  const renderStatus = (pedido) => {
    // Caso 1: Já foi entregue/concluido
    if (pedido.status === 'CONCLUIDO' || pedido.status === 'ENTREGUE_AO_CLIENTE') {
      return <span className="badge badge-concluido">✅ Concluído</span>;
    }

    // Caso 2: Está no Slot (PRONTO)
    if (pedido.status === 'PRONTO' && pedido.slot) {
      return (
        <div className="badge-expedicao">
            <span className="pulse">●</span> Aguardando Retirada
        </div>
      );
    }

    // Caso 3: Processando
    return <span className="badge badge-processando">⚙️ Em Produção</span>;
  };


  return (
    <div className="container-historico-pedidos">
      <h2 className="titulo-historico">Meus Pedidos</h2>
      
      <div className="lista-linear-pedidos">
        {pedidos.length === 0 && <p className="sem-pedidos">Nenhum pedido realizado ainda.</p>}

        {pedidos.map((pedido) => (
          <div key={pedido.pedido_id} className={`row-pedido status-${pedido.status.toLowerCase()}`}>
            
            {/* 1. IMAGEM NA ESQUERDA */}
            <div className="img-lateral">
                <img src={pedido.img || 'https://via.placeholder.com/100'} alt={pedido.nome_personagem} />
            </div>

            {/* 2. INFORMAÇÕES NO CENTRO */}
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
                
                <p className="valor-item">
                    {Number(pedido.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
            </div>

            {/* 3. STATUS E AÇÃO NA DIREITA */}
            <div className="status-direita">
                {renderStatus(pedido)}

                {/* LOGICA DO BOTAO: Só aparece se status for PRONTO e tiver SLOT */}
                {pedido.status === 'PRONTO' && pedido.slot && (
                    <div className="box-action">
                        <span className="box-number">BOX {pedido.slot}</span>
                        <button 
                            className="btn-coletar-row"
                            onClick={() => handleColetar(pedido.slot, pedido.pedido_id)}
                            disabled={loading}
                        >
                            PEGAR PEDIDO
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