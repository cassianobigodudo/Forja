import React, { useState, useEffect } from "react";
import axios from "axios";
import { useGlobalContext } from "../context/GlobalContext";
import { useNavigate } from "react-router-dom"; 
import "./MeusDados.css";

function MeusDados({ dados }) {
  const { usuarioId } = useGlobalContext();
  const navigate = useNavigate();
  const API_URL = "https://forja-qvex.onrender.com/api";

  const [dialogAberto, setDialogAberto] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estados
  const [usuario, setUsuario] = useState({
    nome: "", email: "", senha: "", img: ""
  });

  const [editando, setEditando] = useState({ nome: false, email: false, senha: false });
  
  // Estado do Endereço
  const [endereco, setEndereco] = useState({ 
    cep: "", rua: "", numero: "", bairro: "", cidade: "", uf: "", complemento: "" 
  });

  // 1. SINCRONIZA DADOS DO PAI (UserAccount)
  useEffect(() => {
    if (dados) {
        setUsuario({
            nome: dados.nome_usuario || "",   
            email: dados.email_usuario || "", 
            senha: "", 
            img: dados.img || ""
        });
    }
  }, [dados]);

  // Funções de Edição
  const habilitarEdicao = (campo) => setEditando((prev) => ({ ...prev, [campo]: true }));
  const cancelarEdicao = (campo) => setEditando((prev) => ({ ...prev, [campo]: false }));

  // 2. SALVAR CAMPO DE USUÁRIO (PATCH)
  const salvarCampo = async (campo) => {
    const idParaSalvar = usuarioId || localStorage.getItem('id_usuario');
    try {
      const payload = { [campo]: usuario[campo] };
      const resposta = await axios.patch(`${API_URL}/usuarios/${idParaSalvar}`, payload);

      if (resposta.data.usuario) {
          setUsuario((prev) => ({
            ...prev,
            [campo]: resposta.data.usuario[campo]
          }));
      }
      setEditando((prev) => ({ ...prev, [campo]: false }));
      alert(`${campo.toUpperCase()} atualizado com sucesso!`);
    } catch (erro) {
      console.error("Erro ao salvar campo:", erro);
      alert("Erro ao atualizar.");
    }
  };

  // ============================================================
  // 3. BUSCAR CEP (API VIACEP) - ESTÁ DE VOLTA AQUI 👇
  // ============================================================
  async function buscarCEP() {
    // Remove tudo que não é dígito
    const cepLimpo = endereco.cep.replace(/\D/g, "");

    if (cepLimpo.length !== 8) {
      alert("Digite um CEP válido com 8 números.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      if (data.erro) {
        alert("CEP não encontrado!");
        return;
      }

      // Preenche o estado com o que veio da API
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
      alert("Erro ao conectar com ViaCEP.");
    } finally {
        setLoading(false);
    }
  }

  // 4. SALVAR ENDEREÇO NO BANCO
  const salvarNovoEndereco = async () => {
    const idParaSalvar = usuarioId || localStorage.getItem('id_usuario');
    if (!idParaSalvar) return alert("Erro de autenticação");

    try {
        await axios.post(`${API_URL}/enderecos`, {
            id_usuario: idParaSalvar,
            ...endereco
        });
        alert("Endereço salvo na sua conta!");
        setDialogAberto(false);
        // Limpar form
        setEndereco({ cep: "", rua: "", numero: "", bairro: "", cidade: "", uf: "", complemento: "" });
    } catch (error) {
        console.error(error);
        alert("Erro ao salvar endereço.");
    }
  }

  // 5. EXCLUIR CONTA
  const handleExcluirConta = async () => {
    const idParaDeletar = usuarioId || localStorage.getItem('id_usuario');

    if (String(idParaDeletar) === '5') {
        alert("🛡️ Admin não pode se deletar.");
        return;
    }
    if (!window.confirm("Tem certeza absoluta? Isso apaga tudo.")) return;

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

  if (!dados) return <div className="loading-profile">Carregando dados...</div>;

  return (
    <div className="container-meus-dados">
       
       {/* --- COLUNA ESQUERDA: DADOS PESSOAIS --- */}
       <div className="parte-inputs">
           
           {/* NOME */}
           <div className="grupo-input">
             <label className="label-dados">Nome / Apelido</label>
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

           {/* EMAIL */}
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

           {/* SENHA */}
           <div className="grupo-input">
             <label className="label-dados">Senha</label>
             <div className="input-wrapper">
               <input
                 type="password"
                 className={`inputs-dados ${editando.senha ? 'editavel' : ''}`}
                 disabled={!editando.senha}
                 value={usuario.senha || "********"}
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

           {/* BOTÃO NOVO ENDEREÇO */}
           <div className="grupo-endereco">
                <label className="label-dados">Endereços</label>
                <button className="btn-add-endereco" onClick={() => setDialogAberto(true)}>
                    ➕ Novo Endereço
                </button>
           </div>
       </div>

       {/* --- COLUNA DIREITA: FOTO --- */}
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
            
            <label htmlFor="file-upload" className="custom-file-upload">Escolher Arquivo</label>
            <input id="file-upload" type="file" />

            <button className="botao-deletar-conta" onClick={handleExcluirConta}>
                Excluir Conta
            </button>
       </div>

       {/* --- DIALOG DE ENDEREÇO (MODAL) --- */}
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
                        <button onClick={buscarCEP} disabled={loading}>
                            {loading ? "..." : "🔍"}
                        </button>
                    </div>

                    {/* CAMPOS PREENCHIDOS AUTOMATICAMENTE */}
                    <div className="grid-endereco">
                      {/* RUA */}
                      <input 
                          type="text" 
                          placeholder="Rua" 
                          value={endereco.rua} 
                          onChange={(e) => setEndereco({...endereco, rua: e.target.value})} 
                          className="full-width" 
                      />
                      
                      {/* NÚMERO */}
                      <input 
                          type="text" 
                          placeholder="Número" 
                          value={endereco.numero} 
                          onChange={(e) => setEndereco({...endereco, numero: e.target.value})}
                      />
                      
                      {/* BAIRRO */}
                      <input 
                          type="text" 
                          placeholder="Bairro" 
                          value={endereco.bairro} 
                          onChange={(e) => setEndereco({...endereco, bairro: e.target.value})} 
                      />
                      
                      {/* CIDADE */}
                      <input 
                          type="text" 
                          placeholder="Cidade" 
                          value={endereco.cidade} 
                          onChange={(e) => setEndereco({...endereco, cidade: e.target.value})} 
                      />
                      
                      {/* UF (Limite de 2 caracteres) */}
                      <input 
                          type="text" 
                          placeholder="UF" 
                          value={endereco.uf} 
                          onChange={(e) => setEndereco({...endereco, uf: e.target.value.toUpperCase()})} 
                          style={{width: '60px'}} 
                          maxLength={2}
                      />
                      
                      {/* COMPLEMENTO */}
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