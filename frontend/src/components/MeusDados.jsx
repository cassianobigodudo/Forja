import React, { useState, useEffect } from "react";
import axios from "axios";
import { useGlobalContext } from "../context/GlobalContext";
import { useNavigate } from "react-router-dom"; 
import "./MeusDados.css";

// RECEBE 'dados' VIA PROPS DO PAI (UserAccount)
function MeusDados({ dados }) {
  const { usuarioId } = useGlobalContext();
  const navigate = useNavigate();
  const API_URL = "https://forja-qvex.onrender.com/api";

  const [dialogAberto, setDialogAberto] = useState(false);

  // Estado local para edição (inicializado com as props)
  const [usuario, setUsuario] = useState({
    nome: "", 
    email: "", 
    senha: "",
    img: ""
  });

  const [editando, setEditando] = useState({ nome: false, email: false, senha: false });
  const [endereco, setEndereco] = useState({ cep: "", rua: "", numero: "", bairro: "", cidade: "", uf: "", complemento: "" });

  // --- 1. Sincroniza props com estado local ---
  // Assim que 'dados' chegar do pai, atualizamos os inputs
  useEffect(() => {
    if (dados) {
        console.log("Recebendo dados do Pai:", dados);
        setUsuario({
            nome: dados.nome_usuario || "",   
            email: dados.email_usuario || "", 
            senha: "", 
            img: dados.img || ""
        });
    }
  }, [dados]); // Roda quando a prop 'dados' mudar

  // ... (funções habilitarEdicao, cancelarEdicao mantidas igual) ...
  const habilitarEdicao = (campo) => setEditando((prev) => ({ ...prev, [campo]: true }));
  const cancelarEdicao = (campo) => setEditando((prev) => ({ ...prev, [campo]: false }));

  // --- 2. SALVAR CAMPO (PATCH) ---
  const salvarCampo = async (campo) => {
    const idParaSalvar = usuarioId || localStorage.getItem('id_usuario');
    try {
      const payload = { [campo]: usuario[campo] };
      const resposta = await axios.patch(`${API_URL}/usuarios/${idParaSalvar}`, payload);

      if (resposta.data.usuario) {
          // Atualiza visualmente se o backend devolver o dado novo
          setUsuario((prev) => ({
            ...prev,
            [campo]: resposta.data.usuario[campo] // Atualiza estado local
          }));
      }
      setEditando((prev) => ({ ...prev, [campo]: false }));
      alert(`${campo.toUpperCase()} atualizado com sucesso!`);
    } catch (erro) {
      console.error("Erro ao salvar campo:", erro);
      alert("Erro ao atualizar.");
    }
  };

  // ... (buscarCEP e salvarNovoEndereco mantidos igual) ...
  async function buscarCEP() { /* ...seu código de CEP... */ }
  const salvarNovoEndereco = async () => { /* ...seu código de endereço... */ }

  // --- 3. EXCLUIR CONTA ---
  const handleExcluirConta = async () => {
    const idParaDeletar = usuarioId || localStorage.getItem('id_usuario');

    if (String(idParaDeletar) === '5') {
        alert("🛡️ Admin não pode se deletar.");
        return;
    }
    if (!window.confirm("Tem certeza absoluta?")) return;

    try {
        await axios.delete(`${API_URL}/usuarios/${idParaDeletar}`);
        alert("Conta excluída.");
        localStorage.removeItem('id_usuario');
        localStorage.removeItem('carrinho');
        window.location.href = '/'; 
    } catch (error) {
        console.error("Erro ao excluir:", error);
        alert("Erro ao excluir conta.");
    }
  };

  // Se 'dados' ainda for null (pai carregando), pode mostrar loading ou skeleton
  if (!dados) return <div className="loading-profile">Carregando dados...</div>;


  return (
    <div className="container-meus-dados">
      
      {/* --- COLUNA DA ESQUERDA: INPUTS --- */}
      <div className="parte-inputs">
        
        {/* Campo: NOME/APELIDO */}
        <div className="grupo-input">
          <label className="label-dados">Nome</label>
          <div className="input-wrapper">
            <input
              type="text"
              className={`inputs-dados ${editando.nome ? 'editavel' : ''}`}
              disabled={!editando.nome}
              value={usuario.nome || ""}
              onChange={(e) => setUsuario({ ...usuario, nome: e.target.value })}
            />
            
            <div className="botoes-acao">
                {!editando.nome ? (
                <button className="btn-editar" onClick={() => habilitarEdicao("nome")}>✎</button>
                ) : (
                <>
                    <button className="btn-salvar" onClick={() => salvarCampo("nome")}>✔</button>
                    <button className="btn-cancelar" onClick={() => cancelarEdicao("nome")}>✖</button>
                </>
                )}
            </div>
          </div>
        </div>

        {/* Campo: EMAIL */}
        <div className="grupo-input">
          <label className="label-dados">E-mail</label>
          <div className="input-wrapper">
            <input
              type="email"
              className={`inputs-dados ${editando.email ? 'editavel' : ''}`}
              disabled={!editando.email}
              value={usuario.email || ""}
              onChange={(e) => setUsuario({ ...usuario, email: e.target.value })}
            />
             <div className="botoes-acao">
                {!editando.email ? (
                <button className="btn-editar" onClick={() => habilitarEdicao("email")}>✎</button>
                ) : (
                <>
                    <button className="btn-salvar" onClick={() => salvarCampo("email")}>✔</button>
                    <button className="btn-cancelar" onClick={() => cancelarEdicao("email")}>✖</button>
                </>
                )}
            </div>
          </div>
        </div>

        {/* Campo: SENHA */}
        <div className="grupo-input">
          <label className="label-dados">Senha</label>
          <div className="input-wrapper">
            <input
              type="password"
              className={`inputs-dados ${editando.senha ? 'editavel' : ''}`}
              disabled={!editando.senha}
              value={usuario.senha || "********"} // Mascara senha
              onChange={(e) => setUsuario({ ...usuario, senha: e.target.value })}
            />
             <div className="botoes-acao">
                {!editando.senha ? (
                <button className="btn-editar" onClick={() => habilitarEdicao("senha")}>✎</button>
                ) : (
                <>
                    <button className="btn-salvar" onClick={() => salvarCampo("senha")}>✔</button>
                    <button className="btn-cancelar" onClick={() => cancelarEdicao("senha")}>✖</button>
                </>
                )}
            </div>
          </div>
        </div>

        {/* BOTÃO ADICIONAR ENDEREÇO */}
        <div className="grupo-endereco">
            <label className="label-dados">Endereços Cadastrados</label>
            <button className="btn-add-endereco" onClick={() => setDialogAberto(true)}>
                ➕ Novo Endereço
            </button>
        </div>

      </div>

      {/* --- COLUNA DA DIREITA: FOTO E EXCLUIR --- */}
      <div className="editar-imagem">
        <h1>FOTO DE PERFIL</h1>
        
        <div 
            className="preview-foto"
            style={{ 
                backgroundImage: usuario.img ? `url(${usuario.img})` : 'none',
                backgroundColor: usuario.img ? 'transparent' : 'whitesmoke'
            }}
        >
            {!usuario.img && <span style={{color:'black', fontSize:'30px'}}>👤</span>}
        </div>

        <label htmlFor="file-upload" className="custom-file-upload">
            Escolher Arquivo
        </label>
        <input id="file-upload" type="file" />

        {/* --- BOTÃO ATUALIZADO --- */}
        <button 
            className="botao-deletar-conta" 
            onClick={handleExcluirConta} // <--- Chama a função nova aqui
            style={{ marginTop: '20px', cursor: 'pointer' }}
        >
            Excluir Conta
        </button>
      </div>

      {/* --- DIALOG (MODAL) DE ENDEREÇO --- */}
      {dialogAberto && (
        <div className="dialog-overlay">
            <div className="dialog-box">
                <div className="dialog-header">
                    <h2>Adicionar Endereço</h2>
                    <button className="btn-fechar-dialog" onClick={() => setDialogAberto(false)}>×</button>
                </div>

                <div className="dialog-body">
                    {/* BUSCA CEP */}
                    <div className="row-cep">
                        <input 
                            type="text" 
                            placeholder="CEP (somente números)" 
                            value={endereco.cep}
                            onChange={(e) => setEndereco({...endereco, cep: e.target.value})}
                            maxLength={9}
                        />
                        <button onClick={buscarCEP}>🔍</button>
                    </div>

                    {/* CAMPOS PREENCHIDOS */}
                    <div className="grid-endereco">
                        <input type="text" placeholder="Rua" value={endereco.rua} disabled className="full-width" />
                        
                        <input 
                            type="text" 
                            placeholder="Número" 
                            value={endereco.numero} 
                            onChange={(e) => setEndereco({...endereco, numero: e.target.value})}
                        />
                        
                        <input type="text" placeholder="Bairro" value={endereco.bairro} disabled />
                        
                        <input type="text" placeholder="Cidade" value={endereco.cidade} disabled />
                        
                        <input type="text" placeholder="UF" value={endereco.uf} disabled style={{width: '60px'}} />
                        
                        <input 
                            type="text" 
                            placeholder="Complemento" 
                            value={endereco.complemento} 
                            onChange={(e) => setEndereco({...endereco, complemento: e.target.value})}
                            className="full-width"
                        />
                    </div>
                </div>

                <div className="dialog-footer">
                    <button className="btn-salvar-endereco" onClick={salvarNovoEndereco}>
                        Confirmar Endereço
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}

export default MeusDados;