import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './Loja.css'
import Navbar from '../components/Navbar'
import PreForjados from '../components/PreForjados'

function Loja() {
  const [personagensLoja, setPersonagensLoja] = useState([]);

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

  return (
    <div className='container-loja'>
        <Navbar/>
        <div className="lbl-div">
            <label className='lbl-pre-forjados'>Produtos Pré-forjados</label>
        </div>
        <div className="container-pre-forjados">
            <PreForjados lista={personagensLoja}/>
        </div>
    </div>
  )
}

export default Loja