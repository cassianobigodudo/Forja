import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MeusDados.css";

function MeusDados() {
  const [dialogAberto, setDialogAberto] = useState(false);

  const [usuario, setUsuario] = useState({
    apelido: "",
    email: "",
    senha: "",
  });

  // controla edição de cada campo
  const [editando, setEditando] = useState({
    apelido: false,
    email: false,
    senha: false,
  });

  // busca dados iniciais do usuário
  useEffect(() => {
    async function fetchUsuario() {
      try {
        const resposta = await axios.get("http://localhost:3000/usuarios/1");
        setUsuario(resposta.data);
      } catch (erro) {
        console.error("Erro ao buscar usuário:", erro);
      }
    }
    fetchUsuario();
  }, []);

  // habilita edição de um campo
  const habilitarEdicao = (campo) => {
    setEditando((prev) => ({ ...prev, [campo]: true }));
  };

  // salvar edição de um campo
  const salvarCampo = async (campo) => {
    try {
      const resposta = await axios.patch(
        "http://localhost:3000/usuarios/1",
        { [campo]: usuario[campo] }
      );

      setUsuario((prev) => ({
        ...prev,
        [campo]: resposta.data[campo] || prev[campo],
      }));

      setEditando((prev) => ({ ...prev, [campo]: false }));
      alert(`${campo} atualizado com sucesso!`);
    } catch (erro) {
      console.error("Erro ao salvar campo:", erro);
      alert(`Erro ao salvar ${campo}`);
    }
  };

  // cancelar edição (restaura valor original do banco)
  const cancelarEdicao = (campo) => {
    setEditando((prev) => ({ ...prev, [campo]: false }));
  };

  // 🟩 ESTADOS DO ENDEREÇO
  const [endereco, setEndereco] = useState({
    cep: "",
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    uf: "",
    complemento: "",
  });

   // 🟨 BUSCAR CEP - VIA CEP API
  async function buscarCEP() {
    const cepLimpo = endereco.cep.replace(/\D/g, "");

    if (cepLimpo.length !== 8) {
      alert("Digite um CEP válido com 8 números.");
      return;
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      if (data.erro) {
        alert("CEP não encontrado!");
        return;
      }

      // Preencher automaticamente
      setEndereco((prev) => ({
        ...prev,
        rua: data.logradouro || "",
        bairro: data.bairro || "",
        cidade: data.localidade || "",
        uf: data.uf || "",
        complemento: data.complemento || "",
      }));
    } catch (err) {
      console.error("Erro ao buscar CEP", err);
      alert("Erro ao buscar CEP.");
    }
  }

  return (
    <div className="container-meus-dados">
      <div className="parte-inputs">
        {/* Apelido */}
        <div className="inputs">
          <div className="inputs-parte-dados">
            <label className="label-dados">Apelido</label>
            <input
              type="text"
              className="inputs-dados"
              disabled={!editando.apelido}
              value={usuario.apelido || ""}
              onChange={(e) =>
                setUsuario({ ...usuario, apelido: e.target.value })
              }
            />
          </div>
          <div className="inputs-parte-botao-editar">
            {!editando.apelido ? (
              <button
                className="botao-editar-dados"
                onClick={() => habilitarEdicao("apelido")}
              >
                ✏️
              </button>
            ) : (
              <>
                <button
                  className="botao-editar-dados"
                  onClick={() => salvarCampo("apelido")}
                >
                  ✓
                </button>
                <button
                  className="botao-editar-dados"
                  onClick={() => cancelarEdicao("apelido")}
                >
                  ✗
                </button>
              </>
            )}
          </div>
        </div>

        {/* E-mail */}
        <div className="inputs">
          <div className="inputs-parte-dados">
            <label className="label-dados">E-mail</label>
            <input
              type="email"
              className="inputs-dados"
              disabled={!editando.email}
              value={usuario.email || ""}
              onChange={(e) =>
                setUsuario({ ...usuario, email: e.target.value })
              }
            />
          </div>
          <div className="inputs-parte-botao-editar">
            {!editando.email ? (
              <button
                className="botao-editar-dados"
                onClick={() => habilitarEdicao("email")}
              >
                ✏️
              </button>
            ) : (
              <>
                <button
                  className="botao-editar-dados"
                  onClick={() => salvarCampo("email")}
                >
                  ✓
                </button>
                <button
                  className="botao-editar-dados"
                  onClick={() => cancelarEdicao("email")}
                >
                  ✗
                </button>
              </>
            )}
          </div>
        </div>

        {/* Senha */}
        <div className="inputs">
          <div className="inputs-parte-dados">
            <label className="label-dados">Senha</label>
            <input
              type="password"
              className="inputs-dados"
              disabled={!editando.senha}
              value={usuario.senha || ""}
              onChange={(e) =>
                setUsuario({ ...usuario, senha: e.target.value })
              }
            />
          </div>

          <div className="inputs-parte-botao-editar">
            {!editando.senha ? (
              <button
                className="botao-editar-dados"
                onClick={() => habilitarEdicao("senha")}
              >
                ✏️
              </button>
            ) : (
              <>
                <button
                  className="botao-editar-dados"
                  onClick={() => salvarCampo("senha")}
                >
                  ✓
                </button>
                <button
                  className="botao-editar-dados"
                  onClick={() => cancelarEdicao("senha")}
                >
                  ✗
                </button>
              </>
            )}
          </div>
        </div>

        {/* Endereço */}
        <div className="parte-inputs-endereco">

          <div className="input-partes-endereco-label">
            <label className="label-endereço">Endereço</label>
            <button
              className="botao-adicionar-endereco"
              onClick={() => setDialogAberto(true)}
            >
              ➕
            </button>
          </div>

          <div className="inputs-parte-dados-endereco">

              <div className="inputs-partes-enderecos">
                <input
                  type="password"
                  className="inputs-dados"
                  disabled={!editando.senha}
                  value={usuario.senha || ""}
                  onChange={(e) =>
                    setUsuario({ ...usuario, senha: e.target.value })
                  }
                />
              </div>

              <div className="inputs-parte-botao-editar-endereco">
              {!editando.senha ? (
                <button
                  className="botao-editar-dados"
                  onClick={() => habilitarEdicao("senha")}
                >
                  ✏️
                </button>
              ) : (
                <>
                  <button
                    className="botao-editar-dados"
                    onClick={() => salvarCampo("senha")}
                  >
                    ✓
                  </button>
                  <button
                    className="botao-editar-dados"
                    onClick={() => cancelarEdicao("senha")}
                  >
                    ✗
                  </button>
                </>
              )}
            </div>

          </div>

        </div>
      </div>

      <div className="editar-imagem">
        <div className="parte-foto"></div>

        <h1>ESCOLHA SUA FOTO DE PERFIL</h1>
        <input className="input-arquivo-perfil" type="file" />

        <button className="botao-deletar-conta">Excluir Conta</button>
      </div>

      {/* DIALOG DE ENDEREÇO */}
      <dialog className="dialog-endereco" open={dialogAberto}>
        <div className="container-dialog-endereco">
          <div className="parte-fechar-dialog">
            <h2 className="dialog-titulo">Adicionar Endereço</h2>

            <button
              className="dialog-botao-fechar"
              onClick={() => setDialogAberto(false)}
            >
              &times;
            </button>
          </div>

          <div className="parte-pegar-endereco">
            <div className="buscar-cep">
              <input
                type="text"
                className="input-buscar-cep"
                placeholder="Digite o CEP para pesquisar..."
                value={endereco.cep}
                onChange={(e) =>
                  setEndereco({ ...endereco, cep: e.target.value })
                }
              />

              <button className="botao-pesquisar-cep" onClick={buscarCEP}>
                🔍
              </button>
            </div>

            <div className="dados-endereco">
              <div className="dados-endereco-usuario">
                <div className="endereco-casa">
                  <input
                    type="text"
                    className="input-endereco"
                    disabled
                    value={endereco.rua}
                    placeholder="Rua..."
                  />
                </div>

                <div className="numero-casa">
                  <input
                    type="text"
                    className="input-numero-casa"
                    value={endereco.numero}
                    onChange={(e) =>
                      setEndereco({ ...endereco, numero: e.target.value })
                    }
                    placeholder="Nº"
                  />
                </div>
              </div>

              <div className="dados-endereco-usuario">
                <div className="uf-endereco">
                  <input
                    type="text"
                    className="input-uf-endereco"
                    disabled
                    value={endereco.uf}
                    placeholder="UF"
                  />
                </div>

                <div className="cidade-endereco">
                  <input
                    type="text"
                    className="input-cidade-endereco"
                    disabled
                    value={endereco.cidade}
                    placeholder="Cidade"
                  />
                </div>

                <div className="bairro-endereco">
                  <input
                    type="text"
                    className="input-bairro-endereco"
                    disabled
                    value={endereco.bairro}
                    placeholder="Bairro"
                  />
                </div>
              </div>

              <div className="dados-endereco-usuario">
                <div className="complemento-casa">
                  <input
                    type="text"
                    className="input-complemento"
                    value={endereco.complemento}
                    onChange={(e) =>
                      setEndereco({
                        ...endereco,
                        complemento: e.target.value,
                      })
                    }
                    placeholder="Complemento (opcional)"
                  />
                </div>

                <div className="cep-casa">
                  <input
                    type="text"
                    className="input-cep"
                    disabled
                    value={endereco.cep}
                    placeholder="CEP"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="parte-salvar-endereco">
            <button className="botao-salvar-endereco">Salvar Endereço</button>
          </div>
        </div>
      </dialog>
     
    </div>
  );
}

export default MeusDados;