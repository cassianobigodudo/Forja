import React, { useState, useEffect } from 'react';
import './MeusPedidos.css';
import BoxItem from './BoxItem';
import axios from "axios";

// CORREÇÃO 3: Importe APENAS o useGlobalContext. 
// Removemos 'GlobalContext' daqui pois não estamos usando ele direto, e sim o hook.
import { useGlobalContext } from '../context/GlobalContext';

function MeusPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { idUsuario } = useGlobalContext();

  const API_URL = "https://forja-qvex.onrender.com/api"; 

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        console.log("Tentando buscar pedidos para Session ID:", idUsuario);
        
        // Se idUsuario for null (ainda carregando ou não logado), não faz a busca agora
        if (!idUsuario) {
            // Podemos esperar um pouco ou retornar. 
            // Se for login obrigatório, o isLoading fica true até ter o ID.
            return; 
        }

        const response = await axios.get(
          `${API_URL}/pedidos/por-sessao/${idUsuario}`
        );
        console.log("Pedidos recebidos:", response.data);
        setPedidos(response.data); 

      } catch (err) {
        console.error("Erro ao buscar pedidos:", err);
        setError(err.message);
      } finally {
        // Só paramos de carregar se tentamos buscar ou se deu erro
        if (idUsuario) setIsLoading(false);
      }
    };

    fetchPedidos();
  }, [idUsuario]); // CORREÇÃO 4: Adicione idUsuario aqui. Assim que o Contexto carregar o ID, esse efeito roda de novo.

  if (isLoading && !idUsuario) {
     // Mostra carregando enquanto o Contexto não devolve o ID do localStorage
     return <div className='container-meus-pedidos'><label>Verificando autenticação...</label></div>
  }

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
            <label className='titulo-solicitacoes-producao'>PEDIDOS SOLICITADOS ↗️</label>
          </div>
          <div className="solicitacoes-boxs">
            <div className="boxs-itens">
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

export default MeusPedidos;