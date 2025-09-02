import React, {useRef} from 'react'
import "./LandingPage.css"
import Navbar from '../components/Navbar'
function LandingPage() {
  const sectionBaixoRef = useRef(null)
  const sectionAltoRef = useRef(null)
  const SaberMais = () => {
    sectionBaixoRef.current?.scrollIntoView({ behavior: 'smooth'})
  }
  const SaberMenos = () => {
    sectionAltoRef.current?.scrollIntoView({ behavior: 'smooth'})
  }

  return (

    <>
      <div className="container-landing-page-cima"  ref={sectionAltoRef}>
        <Navbar/>

        <div className="container-centro">
          <label className='titulo-central'>FORJA</label>
          <label className='subtitulo-central'>CRIAÇÃO DE PERSONAGENS DE RPG</label>
          <button className='btn-entrar'>ENTRAR</button>
        </div>

        <div className="container-saberMais" onClick={SaberMais}>
          <label className='lbl-saibaMais' onClick={SaberMais}>Quer saber mais? Morra!</label>
          <img src="/icones/flecha-pra-baixo.svg" className='flechinha' onClick={SaberMais} />
        </div>
      </div>
      <div className="container-landing-page-baixo" ref={sectionBaixoRef}>
        <div className="container-saberMenos" onClick={SaberMenos}>
          <label className='lbl-saibaMenos' onClick={SaberMais}>Quer saber menos? Viva!</label>
          <img src="/icones/flecha-pra-baixo.svg" className='flechinha-inversa' onClick={SaberMais} />

        </div>

      <div className="container-pai-infos-forja">
        <div className="container-infos-esquerda"></div>
        <div className="container-gif-direita"></div>
      </div>
      </div>
    </>

  )
}

export default LandingPage