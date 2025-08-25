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

             <button className='btn-corpo'> <label className='botaoLbl' >CORPO</label>  <img className='img-btn-icon' src="./icones/Corpo.svg" alt="" /></button>
             <button className='btn-corpo-follow'>  <label className='botaoLbl' >CABEÇA</label>  <img className='img-btn-icon' src="./icones/Cabeça.svg" alt="" /></button>
             <button className='btn-corpo-follow'>  <label className='botaoLbl' >TORSO</label>  <img className='img-btn-icon' src="./icones/Torso.svg" alt="" /></button>
             <button className='btn-corpo-follow'>  <label className='botaoLbl' >PERNA</label>  <img className='img-btn-icon' src="./icones/Perna.svg" alt="" /></button>
             <button className='btn-corpo-follow'>  <label className='botaoLbl' >SAPATO</label>  <img className='img-btn-icon' src="./icones/Pé.svg" alt="" /></button>
             <button className='btn-corpo-follow'>  <label className='botaoLbl' >BASE</label>  <img className='img-btn-icon' src="./icones/Base.svg" alt="" /></button>
             <button className='btn-corpo-follow'>  <label className='botaoLbl' >HISTÓRIA</label>  <img className='img-btn-icon' src="./icones/História.svg" alt="" /></button>
            

            </div>
            
            <div className="menu-primario-custom-bottom">

              <button className='btn-zoom' ></button>
              <button className='btn-tirar-zoom'></button>

            </div>
            
          </div>
          <div className="menu-secundario-custom">


          {//! Aqui vai ter 4 componentes, os menus secundarios.
          //!  que dependendo do botão pressionado no menu primario, vai mudar as opções que aparecem.
          //! 1 para o corpo, 1 para a cabeça, 1 para torso,perna,sapato e base. e 1 para a historia.
          }
          <div className="menu-secundario-fundo"></div>
          
        

          </div>


        </div>

      </div>
    </div>

  )
}

export default PaginaCustomizaçao