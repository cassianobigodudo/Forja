import React, { use, useState } from 'react'
import "./MenuSecCabeca.css"
import MenuCabelos from './MenuCabelos'


function MenuSecCabeca() {
  const [btnAtivo, setBtnAtivo] = useState('')

  function handleButtonClick() {

    if (btnAtivo == true) {

      btnAtivo = false
      
    } else {

      btnAtivo = true
    }
    
  }


  return (
      <div className="container-menuSec-cabeca">
      <div className="top-menuSecc">  

        <button className={btnAtivo === 'CABELO' ? 'btn-cabelo-ativado' : 'btn-cabelo'} 
        onClick={() => handleButtonClick('CABELO')}> CABELO
        <img src="./icones/ICONE-CORPO-MASCULINO.png" alt="Ícone corpo masculino" />
        </button>  

        <button className={btnAtivo === 'ACESSORIOS' ? 'btn-acessorios-ativado' : 'btn-'} 
        onClick={() => handleButtonClick('ACESSORIOS')}> ACESSORIOS

        <img src="./icones/ICONE-CORPO-MASCULINO.png" alt="Ícone corpo masculino" />
        </button>  

        <button className='btn-acessorios'> MARCAS
        <img src="./icones/ICONE-CORPO-MASCULINO.png" alt="Ícone corpo masculino" />
        </button>
      </div>

      <div className="bottom">

        <MenuCabelos/>
      </div>
    </div>
  )
}

export default MenuSecCabeca