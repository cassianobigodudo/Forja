import React, { useState, useEffect } from "react";
import axios from "axios";
import { useGlobalContext } from "../context/GlobalContext";
import { useNavigate } from "react-router-dom"; 
import "./MeusDados.css";

function MeusDados({ dados }) {
  const { idUsuario } = useGlobalContext();
  const navigate = useNavigate();
  const API_URL = "https://forja-qvex.onrender.com/api";

  const [dialogAberto, setDialogAberto] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);

  // --- ESTADOS --- //
  
  // 1. Dados do Usuário
  const [usuario, setUsuario] = useState({ nome: "", email: "", senha: "", img: "" });
  const [editando, setEditando] = useState({ nome: false, email: false, senha: false });

  // 2. Lista de Endereços (Para exibir os cards)
  const [listaEnderecos, setListaEnderecos] = useState([]);

  // 3. Formulário de Endereço (Para o Modal)
  const [endereco, setEndereco] = useState({ 
    id_endereco: null, 
    cep: "", rua: "", numero: "", bairro: "", cidade: "", uf: "", complemento: "" 
  });

  // --- EFEITOS (Lógica de Carregamento) --- //

  useEffect(() => {
    // Assim que o pai (UserAccount) mandar os dados, atualizamos o estado local
    if (dados) {
        setUsuario({
            nome: dados.nome_usuario || "",   
            email: dados.email_usuario || "", 
            senha: "", // Senha vazia por segurança
            img: dados.img || ""
        });

        // Aproveita que temos o ID e busca os endereços
        const idParaBuscar = idUsuario || localStorage.getItem('id_usuario');
        carregarEnderecos(idParaBuscar);
    }
  }, [dados]);

  // Função Auxiliar: Buscar Endereços no Backend
  const carregarEnderecos = async (id) => {
      if (!id) return;
      try {
          const res = await axios.get(`${API_URL}/enderecos/usuario/${id}`);
          setListaEnderecos(res.data);
      } catch (error) {
          console.error("Erro ao carregar endereços", error);
      }
  };

  // --- FUNÇÕES DE USUÁRIO (Editar Nome/Email/Senha) --- //

  const habilitarEdicao = (campo) => setEditando((prev) => ({ ...prev, [campo]: true }));
  const cancelarEdicao = (campo) => setEditando((prev) => ({ ...prev, [campo]: false }));

  const salvarCampo = async (campo) => {
    const idParaSalvar = idUsuario || localStorage.getItem('id_usuario');
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
      console.error(erro);
      alert("Erro ao atualizar. Tente novamente.");
    }
  };

  // --- FUNÇÕES DE ENDEREÇO (CRUD Completo) --- //

  // 1. ViaCEP
  async function buscarCEP() {
    const cepLimpo = endereco.cep.replace(/\D/g, "");
    if (cepLimpo.length !== 8) { alert("CEP inválido (digite 8 números)."); return; }

    try {
      setLoadingCep(true);
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      if (data.erro) { alert("CEP não encontrado!"); return; }

      setEndereco((prev) => ({
        ...prev,
        rua: data.logradouro || "",
        bairro: data.bairro || "",
        cidade: data.localidade || "",
        uf: data.uf || "",
        complemento: data.complemento || "",
      }));
    } catch (err) { alert("Erro ao consultar ViaCEP."); } finally { setLoadingCep(false); }
  }

  // 2. Abrir Modal Vazio (Criar)
  const abrirModalNovo = () => {
      setEndereco({ id_endereco: null, cep: "", rua: "", numero: "", bairro: "", cidade: "", uf: "", complemento: "" });
      setDialogAberto(true);
  };

  // 3. Abrir Modal Preenchido (Editar)
  const abrirModalEditar = (end) => {
      setEndereco({
          id_endereco: end.id_endereco,
          cep: end.cep,
          rua: end.rua,
          numero: end.numero,
          bairro: end.bairro,
          cidade: end.cidade,
          uf: end.estado, // Banco usa 'estado', front usa 'uf'
          complemento: end.complemento
      });
      setDialogAberto(true);
  };

  // 4. Salvar (POST ou PUT)
  const salvarEnderecoForm = async () => {
    const idUser = idUsuario || localStorage.getItem('id_usuario');
    if (!idUser) return;

    try {
        // Se tem ID, é Edição (PUT)
        if (endereco.id_endereco) {
            await axios.put(`${API_URL}/enderecos/${endereco.id_endereco}`, endereco);
            alert("Endereço atualizado!");
        } else {
            // Se não tem ID, é Criação (POST)
            await axios.post(`${API_URL}/enderecos`, { id_usuario: idUser, ...endereco });
            alert("Endereço criado!");
        }
        
        setDialogAberto(false);
        carregarEnderecos(idUser); // Atualiza a lista na tela
    } catch (error) {
        console.error(error);
        alert("Erro ao salvar endereço.");
    }
  }

  // 5. Deletar (DELETE)
  const deletarEndereco = async (idEnd) => {
      if(!window.confirm("Remover este endereço?")) return;
      try {
          await axios.delete(`${API_URL}/enderecos/${idEnd}`);
          const idUser = idUsuario || localStorage.getItem('id_usuario');
          carregarEnderecos(idUser);
      } catch (error) {
          alert("Erro ao remover endereço.");
      }
  };

  // --- FUNÇÃO EXCLUIR CONTA --- //
  const handleExcluirConta = async () => {
    const idParaDeletar = idUsuario || localStorage.getItem('id_usuario');

    if (String(idParaDeletar) === '5') {
        alert("🛡️ Admin não pode se deletar.");
        return;
    }
    if (!window.confirm("Tem certeza absoluta? Isso apagará tudo!")) return;

    try {
        await axios.delete(`${API_URL}/usuarios/${idParaDeletar}`);
        alert("Conta excluída. Até logo!");
        localStorage.removeItem('id_usuario');
        localStorage.removeItem('carrinho');
        window.location.href = '/'; 
    } catch (error) {
        console.error("Erro ao excluir:", error);
        alert("Erro ao excluir conta (verifique se há pedidos pendentes).");
    }
  };

  if (!dados) return <div className="loading-profile">Carregando dados...</div>;

  return (
    <div className="container-meus-dados">
       
       {/* --- COLUNA ESQUERDA --- */}
       <div className="parte-inputs">
           
           {/* INPUT: NOME */}
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

           {/* INPUT: EMAIL */}
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

           {/* INPUT: SENHA */}
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

           {/* --- SEÇÃO ENDEREÇOS --- */}
           <div className="grupo-endereco">
                <div className="cabecalho-enderecos">
                    <label className="label-dados">Meus Endereços</label>
                    <button className="btn-add-endereco" onClick={abrirModalNovo}>
                        ➕ Novo
                    </button>
                </div>

                {/* LISTA DE CARTÕES */}
                <div className="lista-enderecos">
                    {listaEnderecos.length === 0 && <p className="sem-endereco">Nenhum endereço cadastrado.</p>}
                    
                    {listaEnderecos.map((end) => (
                        <div key={end.id_endereco} className="card-endereco">
                            <div className="info-endereco">
                                <strong>{end.rua}, {end.numero}</strong>
                                <span>{end.bairro} - {end.cidade}/{end.estado}</span>
                                <span className="cep-info">CEP: {end.cep}</span>
                                {end.complemento && <small>({end.complemento})</small>}
                            </div>
                            <div className="acoes-endereco">
                                <button className="btn-editar-end" onClick={() => abrirModalEditar(end)}>✎</button>
                                <img src="/icones/deletar.svg" className="btn-deletar-end" onClick={() => deletarEndereco(end.id_endereco)} />
                            </div>
                        </div>
                    ))}
                </div>
           </div>
       </div>

       {/* --- COLUNA DIREITA (FOTO E EXCLUIR) --- */}
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

       {/* --- MODAL DE ENDEREÇO --- */}
       {dialogAberto && (
        <div className="dialog-overlay">
            <div className="dialog-box">
                <div className="dialog-header">
                    <h2>{endereco.id_endereco ? "Editar Endereço" : "Novo Endereço"}</h2>
                    <button className="btn-fechar-dialog" onClick={() => setDialogAberto(false)}>×</button>
                </div>

                <div className="dialog-body">
                    {/* BUSCA CEP */}
                    <div className="row-cep">
                        <input 
                            type="text" 
                            placeholder="CEP" 
                            value={endereco.cep}
                            onChange={(e) => setEndereco({...endereco, cep: e.target.value})}
                            maxLength={9}
                        />
                        <button onClick={buscarCEP} disabled={loadingCep}>
                            {loadingCep ? "..." : "🔍"}
                        </button>
                    </div>

                    {/* CAMPOS DE TEXTO (LIVRES PARA EDIÇÃO) */}
                    <div className="grid-endereco">
                        <input type="text" placeholder="Rua" value={endereco.rua} onChange={(e) => setEndereco({...endereco, rua: e.target.value})} className="full-width" />
                        
                        <input type="text" placeholder="Número" value={endereco.numero} onChange={(e) => setEndereco({...endereco, numero: e.target.value})}/>
                        
                        <input type="text" placeholder="Bairro" value={endereco.bairro} onChange={(e) => setEndereco({...endereco, bairro: e.target.value})} />
                        
                        <input type="text" placeholder="Cidade" value={endereco.cidade} onChange={(e) => setEndereco({...endereco, cidade: e.target.value})} />
                        
                        <input type="text" placeholder="UF" value={endereco.uf} onChange={(e) => setEndereco({...endereco, uf: e.target.value.toUpperCase()})} style={{width: '60px'}} maxLength={2}/>
                        
                        <input type="text" placeholder="Complemento" value={endereco.complemento} onChange={(e) => setEndereco({...endereco, complemento: e.target.value})} className="full-width"/>
                    </div>
                </div>

                <div className="dialog-footer">
                    <button className="btn-salvar-endereco" onClick={salvarEnderecoForm}>
                        {endereco.id_endereco ? "Atualizar" : "Salvar"}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}

export default MeusDados;