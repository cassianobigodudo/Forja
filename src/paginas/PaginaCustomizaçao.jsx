import React from 'react'
import "./PaginaCustomizaçao.css"
import Navbar from '../componentes/Navbar'

function PaginaCustomizaçao() {
  return (

    <div className="container-pagina">
      <div className="pagina-custom">

        <div className="navbar-container">
          <Navbar />
        </div>

        <div className="area-customizacao">
          <div className="paperdoll-area">
            <img src="./personagem-FEMININO/CORPO-FEMININO.png" alt="" />
          </div>
          
          <div className="menu-primario-custom-container">

            <div className="menu-primario-custom-top">

             <button className='btn-corpo'>CORPO  <img src="./icones/Corpo.svg" alt="" /></button>
             <button className='btn-corpo-follow'>CABEÇA  <img src="./icones/Cabeça.svg" alt="" /></button>
             <button className='btn-corpo-follow'>TORSO  <img src="./icones/Torso.svg" alt="" /></button>
             <button className='btn-corpo-follow'>PERNA  <img src="./icones/Perna.svg" alt="" /></button>
             <button className='btn-corpo-follow'>SAPATO  <img src="./icones/Pé.svg" alt="" /></button>
             <button className='btn-corpo-follow'>BASE  <img src="./icones/Base.svg" alt="" /></button>
             <button className='btn-corpo-follow'>HISTÓRIA  <img src="./icones/História.svg" alt="" /></button>
            

            </div>
            
            <div className="menu-primario-custom-bottom">

              <button className='btn-zoom' ></button>
              <button className='btn-tirar-zoom'></button>

            </div>
            
          </div>
          <div className="menu-secundario-custom"></div>


        </div>

      </div>
    </div>

  )
}

export default PaginaCustomizaçao