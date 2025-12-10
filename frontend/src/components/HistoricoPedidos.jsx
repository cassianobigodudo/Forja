import React, { useState, useEffect } from "react";
import axios from "axios";
import { useGlobalContext } from "../context/GlobalContext";
import "./HistoricoPedidos.css";

function HistoricoPedidos() {
  const { idUsuario } = useGlobalContext();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "https://forja-qvex.onrender.com/api";

 const fetchPedidos = async () => {
    // LOG 1: Verificar quem é o ID
    const idLocal = localStorage.getItem('id_usuario');
    const id = idUsuario || idLocal;
    
    console.log("🖥️ [FRONT] Tentando buscar pedidos. ID Usado:", id);
    console.log("   --> idUsuario (props):", idUsuario);
    console.log("   --> localStorage:", idLocal);

    if (!id) {
        console.warn("⛔ [FRONT] ID não encontrado. Abortando busca.");
        return;
    }

    try {
      const url = `${API_URL}/pedidos/por-sessao/${id}`;
      console.log(`📡 [FRONT] GET ${url}`);

      const response = await axios.get(url);
      
      console.log("📥 [FRONT] Resposta da API:", response.data); // Verifique se é [] ou [...]
      
      const pedidosLocais = response.data;
      setPedidos(pedidosLocais);

      // =================================================================
      // 🕵️ PARTE NOVA: O ESPIÃO (Sincronização com API do Professor)
      // =================================================================
      
      // Vamos varrer os pedidos para ver se algum mudou lá fora
      pedidosLocais.forEach(async (pedido) => {
        
        // Pula se não tiver ID externo ou se já tiver sido entregue/finalizado
        if (!pedido.orderid_externo || pedido.status === 'ENTREGUE_AO_CLIENTE') return;

        // Pula se JÁ TEM slot (não precisa alocar de novo)
        if (pedido.slot) return;

        try {
          // 2. Consulta a API do Professor
          // (Substitua pela URL real do professor)
          const profResponse = await axios.get(`http://api-do-professor.com/orders/${pedido.orderid_externo}`);
          const dadosExternos = profResponse.data;

          // 3. O GATILHO: Se lá está PRONTO e aqui está SEM SLOT
          if (dadosExternos.stage === 'EXPEDICAO') {
            
            console.log(`🚀 Pedido ${pedido.pedido_id} ficou pronto! Alocando vaga...`);
            
            // Chama sua NOVA rota do Backend para ocupar o slot
            await axios.post(`${API_URL}/expedicao/alocar`, { 
              pedidoId: pedido.pedido_id // Envia o ID Inteiro do seu banco
            });

            // Nota: Na próxima rodada do setInterval (5s), o fetchPedidos vai rodar
            // e já vai trazer o slot preenchido do banco, atualizando a tela sozinho.
          }

        } catch (erroApi) {
          console.warn(`Erro ao checar pedido ${pedido.orderid_externo} na API externa:`, erroApi);
        }
      });

    } catch (error) {
      console.error("Erro ao buscar histórico:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
    const intervalo = setInterval(fetchPedidos, 5000);
    return () => clearInterval(intervalo);
  }, [idUsuario]);

  const handleColetar = async (slot, idPedido) => {
    if (!window.confirm(`Confirmar retirada do Box ${slot}?`)) return;

    try {
        await axios.post(`${API_URL}/estoque/liberar/${slot}`);
        alert("Item coletado com sucesso!");
        fetchPedidos(); 
    } catch (error) {
        console.error("Erro ao coletar:", error);
        alert("Erro ao confirmar coleta.");
    }
  };

  // LÓGICA DE STATUS REVISADA (SEM INVENTAR NÚMEROS)
  const renderStatus = (p) => {
      // Se status é concluído mas NÃO tem slot no banco -> Aguardando Expedição
      if (p.status === 'concluido' && !p.slot) {
          return <span className="tag entregue">JÁ COLETADO / FINALIZADO</span>;
      }
      
      switch(p.status) {
          case 'processando': return <span className="tag processando">⏳ NA FILA</span>;
          case 'forjando': return <span className="tag forjando">🔨 FORJANDO...</span>;
          case 'enviado': return <span className="tag enviado">📡 ENVIADO</span>;
          
          // Só mostra o BOX se p.slot for REAL (vindo do banco)
          case 'concluido': 
            return p.slot 
                ? <span className="tag pronto">✅ PRONTO NO BOX {p.slot}</span>
                : <span className="tag aguardando">⚠️ AGUARDANDO EXPEDIÇÃO</span>;
          
          default: return <span className="tag">{p.status}</span>;
      }
  };

  if (loading) return <div className="loading-historico">Carregando histórico...</div>;

  return (
    <div className="container-historico-pedidos">
      <h2 className="titulo-historico">Meus Pedidos</h2>
      
      <div className="lista-linear-pedidos">
        {pedidos.length === 0 && <p className="sem-pedidos">Nenhum pedido realizado ainda.</p>}

        {pedidos.map((pedido) => (
          <div key={pedido.pedido_id} className={`row-pedido ${pedido.status}`}>
            
            {/* 1. IMAGEM NA ESQUERDA */}
            <div className="img-lateral">
                <img src={pedido.img} alt={pedido.nome_personagem} />
            </div>

            {/* 2. INFORMAÇÕES NO CENTRO */}
            <div className="info-central">
                <div className="topo-info">
                    <h3>{pedido.nome_personagem}</h3>
                    <span className="id-pedido">#{pedido.orderid_externo?.split('-')[2] || pedido.pedido_id}</span>
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

                {/* Botão só aparece se tiver slot REAL */}
                {pedido.status === 'concluido' && pedido.slot && (
                    <button 
                        className="btn-coletar-row"
                        onClick={() => handleColetar(pedido.slot, pedido.pedido_id)}
                    >
                        PEGAR NO BOX {pedido.slot}
                    </button>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HistoricoPedidos;