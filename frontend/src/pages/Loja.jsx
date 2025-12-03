import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './Loja.css'
import Navbar from '../components/Navbar'
import PreForjados from '../components/PreForjados'

function Loja() {
  const [personagensLoja, setPersonagensLoja] = useState([]);
  
  // --- NOVO: Estado para controle do carrossel ---
  const [startIndex, setStartIndex] = useState(0);
  const ITEMS_PER_PAGE = 4; // Limite de 4 por vez

  useEffect(() => {
    const getPersonagensLoja = async () => {
      try {
        const response = await axios.get('https://forja-qvex.onrender.com/api/personagens/buscar-loja');
        
        if (Array.isArray(response.data)) {
            setPersonagensLoja(response.data);
        } else {
            console.error("Erro: Formato inválido", response.data);
        }

      } catch (error) {
        console.error('Erro na requisição:', error);
      }
    }

    getPersonagensLoja()
  }, [])

  // --- LÓGICA DE FATIAMENTO ---
  // Cria uma nova lista contendo APENAS os 4 itens da vez
  const itensVisiveis = personagensLoja.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // --- HANDLERS DOS BOTÕES ---
  const handleNext = () => {
    if (startIndex + ITEMS_PER_PAGE < personagensLoja.length) {
      setStartIndex(startIndex + ITEMS_PER_PAGE);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - ITEMS_PER_PAGE);
    }
  };

  return (
    <div className='container-loja'>
        <Navbar/>
        
        <div className="lbl-div">
            <label className='lbl-pre-forjados'>Produtos Pré-forjados</label>
        </div>
        
        {/* AREA DOS CARDS */}
        <div className="container-pre-forjados">
            {/* O Filho recebe apenas a lista já cortada com 4 itens */}
            <PreForjados lista={itensVisiveis}/>
        </div>

        {/* AREA DOS BOTÕES (Separada, abaixo dos cards) */}
        {personagensLoja.length > ITEMS_PER_PAGE && (
            <div className="container-botoes-navegacao">
                <button 
                    className="btn-navegacao prev" 
                    onClick={handlePrev}
                    disabled={startIndex === 0}
                >
                    Anterior
                </button>
                
                <span className="indicador-pagina">
                    {Math.ceil((startIndex + 1) / ITEMS_PER_PAGE)} / {Math.ceil(personagensLoja.length / ITEMS_PER_PAGE)}
                </span>

                <button 
                    className="btn-navegacao next" 
                    onClick={handleNext}
                    disabled={startIndex + ITEMS_PER_PAGE >= personagensLoja.length}
                >
                    Próximo
                </button>
            </div>
        )}
    </div>
  )
}

export default Loja