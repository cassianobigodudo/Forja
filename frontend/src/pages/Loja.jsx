import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './Loja.css'
import Navbar from '../components/Navbar'
import PreForjados from '../components/PreForjados'

function Loja() {
  const [personagensLoja, setPersonagensLoja] = useState([]);

  useEffect (() => {
    const getPersonagensLoja = async () => {
      try {
        const response = axios.get('https://forja-qvex.onrender.com/api/buscar-loja');
        console.log('Personagens da loja:', response.data);
        setPersonagensLoja(response.data);
      } catch (error) {
        console.error('Erro ao buscar personagens da loja:', error);
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
