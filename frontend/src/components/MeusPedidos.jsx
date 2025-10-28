import React, { useState, useEffect } from 'react' // 1. Importar useState e useEffect
import './MeusPedidos.css'
import BoxItem from './BoxItem'
import axios from "axios"
import { GlobalContext, useGlobalContext } from '../context/GlobalContext';

function MeusPedidos() {
  // 2. Criar estados para guardar os pedidos e controlar o carregamento
  const [pedidos, setPedidos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { sessionId } = useGlobalContext()

  // 3. Definir a URL da sua API (ex: a do Vercel ou Render)
  const API_URL = "https://forja-qvex.onrender.com/api"; // <-- MUDE ISSO

  // 4. useEffect para buscar os dados assim que o componente carregar
  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        // Você precisa pegar o session_id de onde o salvou (ex: localStorage)
        console.log("Session ID:", sessionId);
        if (!sessionId) {
          throw new Error('Usuário não autenticado.');
        }

        // Chamar a rota que criamos no backend
        const response = await axios.get(
          `${API_URL}/pedidos/por-sessao/${sessionId}`
        );
        console.log("Pedidos recebidos:", response.data);
        setPedidos(response.data); // Salva os pedidos no estado

      } catch (err) {
        console.error("Erro ao buscar pedidos:", err);
        setError(err.message);
      } finally {
        setIsLoading(false); // Para de carregar
      }
    };

    fetchPedidos();
  }, []); // O [] significa "rodar apenas uma vez"

  // 5. Renderização condicional para carregamento e erros
  if (isLoading) {
    return <div className='container-meus-pedidos'><label>Carregando pedidos...</label></div>
  }

  if (error) {
    return <div className='container-meus-pedidos'><label>Erro: {error}</label></div>
  }

  return (
    <div className='container-meus-pedidos'>
      <div className="parte-solicitacoes">
        <div className="solicitacoes">
          <div className="solicitacoes-titulo">
            <label className='titulo-solicitacoes-producao'>PEDIDOS SOLICITADOS↗️</label>
          </div>
          <div className="solicitacoes-boxs">
            <div className="boxs-itens">

              {/* 6. A MÁGICA: Usar .map() para criar um BoxItem para cada pedido
                   e passar os dados do pedido como uma 'prop'.
              */}
              {pedidos.length > 0 ? (
                pedidos.map(pedido => (
                  <BoxItem key={pedido.pedido_id} pedido={pedido} />
                ))
              ) : (
                <label>Nenhum pedido encontrado.</label>
              )}
              
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MeusPedidos