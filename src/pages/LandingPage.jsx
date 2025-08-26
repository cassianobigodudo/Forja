import React from 'react'
import "./LandingPage.css"
import Navbar from '../components/Navbar'
function LandingPage() {
  return (

    <div className="container-landing-page">
      <Navbar/>

      <div className="container-centro">
        <label className='titulo-central'>FORJA</label>
        <label className='subtitulo-central'>CRIAÇÃO DE PERSONAGENS DE RPG</label>
      </div>
    </div>
  )
}

export default LandingPage