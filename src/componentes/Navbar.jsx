import React from 'react'
import "./Navbar.css"

function Navbar() {
  return (
    <div className="container">

        <div className="navbar">


        <h1 className='logo' > FORJA</h1>

        <h1 className='btn-inicio' > Inicio </h1>

        
        <h1 className='btn-forja' > Forja </h1>

        
        <h1 className='btn-loja' > Loja </h1>

        <button className='btn-carrinho'></button>
        <button className='btn-user'></button>

        </div>



    </div>
  )
}

export default Navbar