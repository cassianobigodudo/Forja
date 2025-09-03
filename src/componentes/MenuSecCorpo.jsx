import React, { useState } from 'react';
import "./MenuSecCorpo.css";

function MenuSecCorpo() {
  const [corPeleAtivada, setCorPeleAtivada] = useState(0);

  const skinTones = [
    '#3b2010ff', '#8C5230','#D2A17C','#F9E4D4','#4d771eff', '#c26632ff', '#99af9eff', 
  ];

  return (
    <div className="container-menuSec-corpo">
      <div className="top-menuSec">
        <div className="label-container">
          <label className='lbl'>CORES DE PELE</label>
        </div>
        <div className="skin-colors">
          {skinTones.map((color, index) => (
            <button
              key={index}
              className={`cor-pele ${corPeleAtivada === index ? 'ativada' : ''}`}
              style={{ backgroundColor: color}}
              onClick={() => setCorPeleAtivada(index)}
            ></button>
          ))}
        </div>
      </div>

      <div className="bottom">
        <h1>🟥🟦</h1>
      </div>
    </div>
  );
}

export default MenuSecCorpo;