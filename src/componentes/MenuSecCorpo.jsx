import React, { useState } from 'react'
import "./MenuSecCorpo.css"
function MenuSecCorpo() {

  const [corPele,setCorPele] = useState(false)


  return (
    <div className="container">
        <div className="top">
            <div className="label-container">
                <label className='lbl' htmlFor="">CORES DE PELE</label>
            </div>
            <div className="skin-colors">

              <button className={`'cor-pele' ${corPele ? 'ativado' : ''}`} onClick={() => setCorPele(true)}></button>

             
            </div>
        </div>

        <div className="bottom">
         <h1>
            🟥🟦</h1>
        </div>

    </div>
  )
}

export default MenuSecCorpo