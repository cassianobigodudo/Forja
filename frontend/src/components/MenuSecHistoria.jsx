import React, { useState } from 'react'
import "./MenuSecHistoria.css"

function MenuSecHistoria({
  nomePersonagem, setNomePersonagem,
  inspiracaoUm, setInspiracaoUm,
  inspiracaoDois, setInspiracaoDois,
  enredoHistoria, setEnredoHistoria,
  historiaGerada, setHistoriaGerada,
  loading, error,
  onGerarHistoria // Esta é a função handleGerarHistoria do Pai
}) {

  return (
    <div className="container-menuSec-corpo">
      <div className="top-menuSec">
        <div className="container-top-menuSec">

          <div className="parte-menus-superior">
            <label htmlFor="" className="label-menus-superior">DÊ UM NOME A SUA PERSONAGEM: </label>
            <input 
              type="text" 
              className="inputs-menus-superior" 
              placeholder='ex: Jaime'
              value={nomePersonagem}
              onChange={(e) => setNomePersonagem(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="parte-menus-superior">
            <label htmlFor="" className="label-menus-superior">ELEMENTO DE INSPIRAÇÃO I: </label>
            <input 
              type="text" 
              list='inspiracaoum'
              className="inputs-menus-superior" 
              placeholder='ex: abandonado(a) pela família'
              value={inspiracaoUm}
              onChange={(e) => setInspiracaoUm(e.target.value)}
              disabled={loading}
            />
            <datalist id='inspiracaoum'>
              <option value="Cresceu nas ruas sozinho(a)"></option>
              <option value="Foi criado(a) por animais na floresta"></option>
              <option value="Vem de uma linhagem nobre caída"></option>
              <option value="Era um(a) escravo(a) que fugiu"></option>
              <option value="Foi treinado(a) em um monastério isolado"></option>
              <option value="Sofreu um acidente que mudou sua vida"></option>
              <option value="Tem um(a) irmão(ã) gêmeo(a) desaparecido(a)"></option>
              <option value="Descende de um herói lendário"></option>
              <option value="Fez um pacto com uma entidade misteriosa"></option>
              <option value="Sobreviveu a uma praga mortal"></option>
            </datalist>
          </div>

          <div className="parte-menus-superior">
            <label htmlFor="" className="label-menus-superior">ELEMENTO DE INSPIRAÇÃO II: </label>
            <input 
              type="text" 
              list='inspiracaodois'
              className="inputs-menus-superior" 
              placeholder='ex: viveu isolado da sociedade'
              value={inspiracaoDois}
              onChange={(e) => setInspiracaoDois(e.target.value)}
              disabled={loading}
            />
            <datalist id='inspiracaodois'>
              <option value="Busca vingança por um ente querido"></option>
              <option value="Acordou sem nenhuma memória"></option>
              <option value="Carrega uma maldição misteriosa"></option>
              <option value="É o(a) último(a) de sua linhagem"></option>
              <option value="Está fugindo de um antigo mestre"></option>
              <option value="Precisa pagar uma dívida de vida"></option>
              <option value="Busca um artefato lendário perdido"></option>
              <option value="Testemunhou um crime terrível"></option>
              <option value="Nasceu com um poder que teme"></option>
              <option value="Viu sua vila natal ser destruída"></option>
            </datalist>
          </div>

          <div className="parte-menus-superior">
            <label htmlFor="" className="label-menus-superior">ESCOLHA O TIPO DE ENREDO: </label>
            <input 
              type="text" 
              list='enredos'
              className="inputs-menus-superior" 
              placeholder='ex: triste'
              value={enredoHistoria}
              onChange={(e) => setEnredoHistoria(e.target.value)}
              disabled={loading}
            />
            <datalist id='enredos'>
              <option value="Heróico e Otimista"></option>
              <option value="Misterioso e Investigativo"></option>
              <option value="Cômico e Leve"></option>
              <option value="Melancólico e Reflexivo"></option>
              <option value="Vingança e Raiva"></option>
              <option value="Esperançoso e Inspirador"></option>
              <option value="Ação e Aventura"></option>
              <option value="Pesado e Intenso"></option>
              <option value="Triste e Sombrio"></option>
              <option value="Épico e Grandioso"></option>
            </datalist>
          </div>

          <div className="parte-gerar-historia">
            <button 
              className="botao-gerar-historia" 
              onClick={onGerarHistoria}
              disabled={loading}
            >
              {loading ? "Gerando..." : "GERAR HISTÓRIA"}

            </button>
          </div>

        </div>
      </div>

      <div className="bottom">

        <div className="container-bottom">

          {/* 5. Exibição de Erro */}
          {error && (
            <div style={{ color: 'red', marginBottom: '10px', textAlign: 'center', fontSize: '14px' }}>
              Erro: {error}
            </div>
          )}
          <textarea 
            name="historia" 
            id="historiaResultado" 
            className='campo-historia-personagem'
            placeholder={loading ? "Aguarde, a IA está escrevendo..." : "A história gerada pela IA aparecerá aqui..."}
            value={historiaGerada}
            onChange={(e) => setHistoriaGerada(e.target.value)}
            readOnly={loading}
          ></textarea>

        </div>

      </div>
    </div>
  )
}

export default MenuSecHistoria