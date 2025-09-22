import React, { use, useState } from 'react'
import "./MenuSecCabeca.css"
import MenuCabelos from './MenuCabelos'


function MenuSecCabeca() {
  const [btnAtivo, setBtnAtivo] = useState('')
  const [topEncolher, setEncolher] = useState('')

 function handleButtonClick(nomeDoBotao) {
    setBtnAtivo(prevBtnAtivo => prevBtnAtivo === nomeDoBotao ? null : nomeDoBotao);

    if (topEncolher === 'ENCOLHER'){

    setEncolher('')

    } else{
      setEncolher('ENCOLHER')
    }
  }


  return (
      <div className="container-menuSec-cabeca">
      <div  className={topEncolher === 'ENCOLHER' ? 'div-top-encolhe' : 'div-top-normal'}>  

        <button className={btnAtivo === 'CABELOS' ? 'btn-ativado' : 'btn-desativado'} 
        onClick={() => handleButtonClick('CABELOS')}> CABELO
        
        </button>  

        <button className={btnAtivo === 'ACESSORIOS' ? 'btn-ativado' : 'btn-desativado'} 
        onClick={() => handleButtonClick('ACESSORIOS')}> ACESSORIOS

        </button>  

        <button className={btnAtivo === 'MARCAS' ? 'btn-ativado' : 'btn-desativado'} 
        onClick={() => handleButtonClick('MARCAS')}> MARCAS

        </button>

        
      </div>

      <div className="bottom">

        {btnAtivo === 'CABELOS' && <MenuCabelos/>}

        
      </div>
    </div>
  )
}

export default MenuSecCabeca