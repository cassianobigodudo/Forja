import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './Loja.css'
import Navbar from '../components/Navbar'
import PreForjados from '../components/PreForjados'

function Loja() {
  const [personagensLoja, setPersonagensLoja] = useState([]);
  
  // 1. ESTADO DE CARREGAMENTO
  const [isLoading, setIsLoading] = useState(true);

  // Estados do Carrossel
  const [startIndex, setStartIndex] = useState(0);
  const ITEMS_PER_PAGE = 4;

  useEffect(() => {
    const getPersonagensLoja = async () => {
      try {
        // Tenta buscar
        const response = await axios.get('https://forja-qvex.onrender.com/api/personagens/buscar-loja');
        
        if (Array.isArray(response.data)) {
            setPersonagensLoja(response.data);
        } else {
            console.error("Erro: Formato inválido", response.data);
        }

      } catch (error) {
        console.error('Erro na requisição:', error);
      } finally {
        // 2. FINALIZA O CARREGAMENTO (Independente se deu erro ou sucesso)
        setIsLoading(false);
      }
    }

    getPersonagensLoja()
  }, [])

  // Lógica de Fatiamento (só funciona se tiver itens)
  const itensVisiveis = personagensLoja.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
        
        {/* 3. RENDERIZAÇÃO CONDICIONAL */}
        <div className="container-pre-forjados">
            
            {isLoading ? (
                /* TELA DE CARREGAMENTO (IGUAL AO PAGAMENTO) */
                <div className="loading-state-loja">
                    <p>Consultando o estoque da forja...</p>
                </div>
            ) : (
                /* LISTA DE PRODUTOS */
                <PreForjados lista={itensVisiveis}/>
            )}

        </div>

        {/* SÓ MOSTRA OS BOTÕES SE JÁ CARREGOU E TIVER MAIS DE 4 ITENS */}
        {!isLoading && personagensLoja.length > ITEMS_PER_PAGE && (
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