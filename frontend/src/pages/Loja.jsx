import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './Loja.css'
import Navbar from '../components/Navbar'
import PreForjados from '../components/PreForjados'

function Loja() {
  const [personagensLoja, setPersonagensLoja] = useState([]);

  useEffect (() => {
    const getPersonagensLoja = async () => {
      console.log("--- [FRONTEND] Iniciando fetch da loja... ---");
      try {
        // ATENÇÃO: Se estiver rodando local, use http://localhost:PORTA
        // Se estiver usando o Render, certifique-se que o backend lá está atualizado
        const response = await axios.get('https://forja-qvex.onrender.com/api/buscar-loja');
        
        console.log('--- [FRONTEND] Resposta recebida (Status):', response.status);
        console.log('--- [FRONTEND] Dados (Payload):', response.data);
        
        if (Array.isArray(response.data)) {
            setPersonagensLoja(response.data);
        } else {
            console.error("--- [FRONTEND] Erro: O formato recebido não é um Array!", response.data);
        }

      } catch (error) {
        console.error('--- [FRONTEND] Erro na requisição:', error);
      }
    }

    getPersonagensLoja()
  }, [])
  return (
    <div className='container-loja'>
        <Navbar/>
        <div className="produtos-pre-forjados">
            <label className='lbl-pre-forjados'>Produtos Pré-forjados</label>
            <PreForjados lista={personagensLoja}/>
        </div>
    </div>
  )
  
}

export default Loja
