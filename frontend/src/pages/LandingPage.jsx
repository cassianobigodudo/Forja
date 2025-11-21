import React, {useRef, useState} from 'react'
import "./LandingPage.css"
import Navbar from '../components/Navbar'
import CaixaCadastroLogin from '../components/CaixaCadastroLogin'
function LandingPage() {
  const [isLoginVisible, setIsLoginVisible] = useState(false)

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

        <div className={`container-centro ${isLoginVisible ? 'login-ativo' : ''}`}>
          <img src="./Forja Logo.png" className={`logo-forja ${isLoginVisible ? 'deslocado' : ''}`} />
          {!isLoginVisible && <button className='btn-entrar' onClick={() => (setIsLoginVisible(true))} >Entrar</button>}
          {isLoginVisible && <CaixaCadastroLogin/>}
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