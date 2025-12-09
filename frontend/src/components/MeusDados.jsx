import React, { useState, useEffect } from "react";
import axios from "axios";
import { useGlobalContext } from "../context/GlobalContext";
import { useNavigate } from "react-router-dom"; // Importe isso para redirecionar após excluir
import "./MeusDados.css";

function MeusDados() {
  const { usuarioId, setUsuarioId } = useGlobalContext(); // Se tiver função de setar usuario global, use aqui
  const navigate = useNavigate(); // Hook de navegação
  const API_URL = "https://forja-qvex.onrender.com/api";

  const [dialogAberto, setDialogAberto] = useState(false);
  const [loading, setLoading] = useState(true);

  // Estado do Usuário
  const [usuario, setUsuario] = useState({
    nome: "", // Mudei de apelido para nome (padrão do banco)
    email: "",
    senha: "", // Cuidado: Senhas geralmente não retornam do banco por segurança
  });

  // Controle de Edição
  const [editando, setEditando] = useState({
    nome: false,
    email: false,
    senha: false,
  });

  // Estado do Endereço (Novo)
  const [endereco, setEndereco] = useState({
    cep: "",
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    uf: "",
    complemento: "",
  });

  // 1. BUSCAR DADOS AO CARREGAR
  useEffect(() => {
    async function fetchUsuario() {
      // Se não tiver ID (ex: deslogou), não busca
      const idParaBuscar = usuarioId || localStorage.getItem('id_usuario');
      
      if (!idParaBuscar) return;

      try {
        const resposta = await axios.get(`${API_URL}/usuarios/${idParaBuscar}`);
        setUsuario(resposta.data);
      } catch (erro) {
        console.error("Erro ao buscar usuário:", erro);
      } finally {
        setLoading(false);
      }
    }
    fetchUsuario();
  }, [usuarioId]);

  // 2. FUNÇÕES DE EDIÇÃO DE CAMPO
  const habilitarEdicao = (campo) => {
    setEditando((prev) => ({ ...prev, [campo]: true }));
  };

  const cancelarEdicao = (campo) => {
    setEditando((prev) => ({ ...prev, [campo]: false }));
    // Idealmente, reverteria para o valor original do banco aqui se tivesse backup
  };

  const salvarCampo = async (campo) => {
    const idParaSalvar = usuarioId || localStorage.getItem('id_usuario');
    try {
      // PATCH para atualizar apenas 1 campo
      const resposta = await axios.patch(
        `${API_URL}/usuarios/${idParaSalvar}`,
        { [campo]: usuario[campo] }
      );

      setUsuario((prev) => ({
        ...prev,
        [campo]: resposta.data[campo] || prev[campo],
      }));

      setEditando((prev) => ({ ...prev, [campo]: false }));
      alert(`${campo.toUpperCase()} atualizado com sucesso!`);
    } catch (erro) {
      console.error("Erro ao salvar campo:", erro);
      alert(`Erro ao salvar ${campo}`);
    }
  };

  // 3. LÓGICA DE ENDEREÇO (VIA CEP)
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

  const handleExcluirConta = async () => {
    const idParaDeletar = usuarioId || localStorage.getItem('id_usuario');

    // 1. TRAVA DO ADMIN (ID 5)
    if (String(idParaDeletar) === '5') {
        alert("🛡️ Ação Bloqueada: O Mestre da Forja (Admin) não pode deletar a própria conta!");
        return;
    }

    // 2. CONFIRMAÇÃO DE SEGURANÇA
    const confirmacao = window.confirm(
        "Tem certeza absoluta? \n\nIsso apagará seus personagens, pedidos e histórico permanentemente. Essa ação não pode ser desfeita."
    );

    if (!confirmacao) return; // Se cancelar, para aqui.

    // 3. CHAMADA API
    try {
        await axios.delete(`${API_URL}/usuarios/${idParaDeletar}`);
        
        alert("Sua conta foi excluída. Sentiremos sua falta, aventureiro!");

        // 4. LOGOUT FORÇADO (Limpeza)
        localStorage.removeItem('id_usuario'); // Limpa ID
        localStorage.removeItem('carrinho');   // Limpa carrinho local se tiver
        
        navigate('/'); // Redireciona para home
        
    } catch (error) {
        console.error("Erro ao excluir:", error);
        alert("Erro ao excluir conta. Verifique se você tem pedidos pendentes ou tente novamente.");
    }
  };

  if (loading) return <div className="loading-profile">Carregando dados...</div>;

  return (
    <div className="container-meus-dados">
      
      {/* --- COLUNA DA ESQUERDA: INPUTS --- */}
      <div className="parte-inputs">
        
        {/* Campo: NOME/APELIDO */}
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