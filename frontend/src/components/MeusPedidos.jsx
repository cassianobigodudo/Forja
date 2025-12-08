import React, { useState, useEffect } from 'react';
import './MeusPedidos.css';
import BoxItem from './BoxItem';
import axios from "axios";
import { useGlobalContext } from '../context/GlobalContext';

function MeusPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { idUsuario } = useGlobalContext();

  const API_URL = "https://forja-qvex.onrender.com/api"; 

  useEffect(() => {
    // Se não tiver usuário, paramos o loading e não buscamos nada
    if (!idUsuario) {
        console.log("Usuário não logado, abortando busca.");
        setIsLoading(false);
        return;
    }

    const fetchPedidos = async () => {
      setIsLoading(true); // Garante que começa carregando ao mudar de user
      try {
        console.log("Buscando pedidos para:", idUsuario);
        const response = await axios.get(
          `${API_URL}/pedidos/por-sessao/${idUsuario}`
        );
        console.log("Dados recebidos:", response.data);
        setPedidos(response.data); 
      } catch (err) {
        console.error("Erro axios:", err);
        setError(err.message);
      } finally {
        // CORREÇÃO: Removemos o 'if (idUsuario)' daqui. 
        // O loading deve parar independente do resultado.
        setIsLoading(false);
      }
    };

    fetchPedidos();
  }, [idUsuario]);

  // --- Renderizações Condicionais ---

  // 1. Se não tem usuário logado
  if (!idUsuario && !isLoading) {
      return (
        <div className='container-meus-pedidos'>
            <div className="parte-solicitacoes" style={{color: 'white', textAlign: 'center'}}>
                <h2>Você precisa estar logado.</h2>
                <p>Faça login para ver seus pedidos.</p>
            </div>
        </div>
      );
  }

  // 2. Se está carregando
  if (isLoading) {
    return (
        <div className='container-meus-pedidos' style={{display:'flex', justifyContent:'center', alignItems:'center', color: '#ffaa00'}}>
            <h2>🔥 Aqueçendo a Forja... (Carregando)</h2>
        </div>
    );
  }

  // 3. Se deu erro
  if (error) {
    return (
        <div className='container-meus-pedidos'>
            <label style={{color: 'red'}}>Erro: {error}</label>
        </div>
    );
  }

  // 4. Se deu tudo certo
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
                    // IMPORTANTE: Se o ID vier como 'id' ou 'pedido_id', ajuste aqui
                  <BoxItem key={pedido.pedido_id || pedido.id} pedido={pedido} />
                ))
              ) : (
                <div style={{color: '#aaa', padding: '20px'}}>
                    <label>Nenhum pedido encontrado nesta conta.</label>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MeusPedidos;