import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./PaginaPagamento.css";
import Navbar from '../components/Navbar';

function PaginaPagamento() {
    const { usuarioId, removerDoCarrinho, atualizarCarrinho } = useGlobalContext();
    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true); 
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    // --- ESTADOS DE ENDEREÇO E ENTREGA ---
    const [enderecos, setEnderecos] = useState([]);
    const [entregaSelecionada, setEntregaSelecionada] = useState(null);
    const [valorFrete, setValorFrete] = useState(0);

    // --- ESTADOS DO MODAL (NOVO) ---
    const [dialogAberto, setDialogAberto] = useState(false);
    const [loadingCep, setLoadingCep] = useState(false);
    const [novoEndereco, setNovoEndereco] = useState({ 
        cep: "", rua: "", numero: "", bairro: "", cidade: "", uf: "", complemento: "" 
    });

    // --- 1. BUSCAR DADOS ---
    useEffect(() => {
        const idParaBuscar = usuarioId || localStorage.getItem('id_usuario');
        if (idParaBuscar) {
            fetchDados(idParaBuscar);
        } else {
            setIsLoading(false);
        }
    }, [usuarioId]);

    const fetchDados = async (idUser) => {
        try {
            const [resCarrinho, resEnderecos] = await Promise.all([
                axios.get(`https://forja-qvex.onrender.com/api/carrinho/${idUser}`),
                axios.get(`https://forja-qvex.onrender.com/api/enderecos/usuario/${idUser}`)
            ]);
            
            setCartItems(resCarrinho.data);
            setEnderecos(resEnderecos.data);

        } catch (error) {
            console.error("Erro ao buscar dados:", error);
            setStatusMessage("Erro ao carregar informações.");
        } finally {
            setIsLoading(false);
        }
    };

    // --- 2. LÓGICA DE MODAL E CEP (NOVO) ---
    async function buscarCEP() {
        const cepLimpo = novoEndereco.cep.replace(/\D/g, "");
        if (cepLimpo.length !== 8) { alert("CEP inválido."); return; }
    
        try {
          setLoadingCep(true);
          const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
          const data = await response.json();
    
          if (data.erro) { alert("CEP não encontrado!"); return; }
    
          setNovoEndereco((prev) => ({
            ...prev,
            rua: data.logradouro || "",
            bairro: data.bairro || "",
            cidade: data.localidade || "",
            uf: data.uf || "",
            complemento: data.complemento || "",
          }));
        } catch (err) { alert("Erro ao consultar ViaCEP."); } finally { setLoadingCep(false); }
    }

    const salvarNovoEndereco = async () => {
        const idUser = usuarioId || localStorage.getItem('id_usuario');
        if (!idUser) return;
    
        try {
            await axios.post(`https://forja-qvex.onrender.com/api/enderecos`, {
                id_usuario: idUser,
                ...novoEndereco
            });
            
            alert("Endereço adicionado!");
            setDialogAberto(false);
            setNovoEndereco({ cep: "", rua: "", numero: "", bairro: "", cidade: "", uf: "", complemento: "" });
            
            // Recarrega lista de endereços
            const res = await axios.get(`https://forja-qvex.onrender.com/api/enderecos/usuario/${idUser}`);
            setEnderecos(res.data);

        } catch (error) {
            console.error(error);
            alert("Erro ao salvar endereço.");
        }
    }

    // --- 3. SELEÇÃO DE ENTREGA ---
    const handleSelecionarEntrega = (tipo, id = null) => {
        if (tipo === 'loja') {
            setEntregaSelecionada('loja');
            setValorFrete(0);
        } else {
            setEntregaSelecionada(id);
            setValorFrete(34.90);
        }
    };

    // --- 4. TOTAIS E REMOÇÃO ---
    const totalCarrinho = cartItems.reduce((acc, item) => acc + Number(item.valor || 84.90), 0);
    const totalFinal = totalCarrinho + valorFrete;

    const handleRemoveItem = async (idCarrinhoItem) => {
        await removerDoCarrinho(idCarrinhoItem);
        setCartItems(prev => prev.filter(item => item.id_carrinho_item !== idCarrinhoItem));
        if(atualizarCarrinho) atualizarCarrinho();
    };

    // --- 5. FINALIZAR ---
    const handleFinalizarCompra = async () => {
        const idUsuario = usuarioId || localStorage.getItem('id_usuario');
        if (!idUsuario) return alert("Erro de login.");

        if (!entregaSelecionada) {
            alert("Selecione um endereço ou retirada na loja.");
            return;
        }

        setIsProcessing(true);
        setStatusMessage('Forjando seu pedido...');

        try {
            await axios.post('https://forja-qvex.onrender.com/api/pedidos', { id_usuario: idUsuario });
            setStatusMessage(`Sucesso! Itens enviados para produção.`);
            setCartItems([]); 
            if(atualizarCarrinho) atualizarCarrinho();
            setTimeout(() => navigate('/conta'), 2000);
        } catch (error) {
            if (error.response && error.response.status === 409) {
                alert(`⚠️ FALTA DE ESTOQUE:\n\n${error.response.data.detalhe}`);
                setStatusMessage('Estoque insuficiente.');
            } else {
                setStatusMessage('Erro ao processar o pagamento.');
            }
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="container-paginaz"> 
            <Navbar/>
            <div className="container">
                <main className='conteudo'>
                    
                    {/* ESQUERDA */}
                    <aside className='esquerda'>
                        <div className="card-voltar-loja">
                            <div className="icone-voltar">🛍️</div>
                            <p>Quer adicionar mais itens?</p>
                            <button className='btn-voltar-padrao' onClick={() => navigate('/loja')}>
                                ⬅ Voltar para a Loja
                            </button>
                        </div>
                    </aside>

                    {/* CENTRO */}
                    <section className='Checkout'>
                        <h2 className='titulo'>Itens na Forja:</h2>
                        <div className='lista'>
                            {isLoading ? (
                                <div className="loading-state"><p>Carregando...</p></div>
                            ) : cartItems.length > 0 ? (
                                cartItems.map((item) => (
                                    <article className="item" key={item.id_carrinho_item}>
                                        <div className="thumb-wrapper">
                                            <img src={item.img} className='thumb' alt={item.nome} />
                                        </div>
                                        <div className="detalhes-item">
                                            <h1>{item.nome || "Aventureiro"}</h1>
                                            <h2>{Number(item.valor || 84.90).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h2>
                                        </div>
                                        <button className="btn-remover-pagamento" onClick={() => handleRemoveItem(item.id_carrinho_item)}>X</button>
                                    </article>
                                ))
                            ) : (
                                <article className="item-vazio">
                                    <label>{statusMessage || 'Seu carrinho está vazio.'}</label>
                                </article>
                            )}
                        </div>
                    </section>
                    
                    {/* DIREITA */}
                    <aside className='direita'>
                        
                        <div className="box-entrega">
                            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid #444', marginBottom:'10px'}}>
                                <h3>Entrega:</h3>
                                {/* BOTÃO DE ADICIONAR ENDEREÇO NA PÁGINA DE PAGAMENTO */}
                                <button 
                                    onClick={() => setDialogAberto(true)}
                                    style={{background:'transparent', border:'1px solid #d4af37', color:'#d4af37', cursor:'pointer', padding:'2px 8px', borderRadius:'4px'}}
                                >
                                    + Novo
                                </button>
                            </div>
                            
                            {/* AQUI ESTÁ A SCROLLBAR */}
                            <div className="lista-enderecos-scroll" style={{ maxHeight: '200px' }}> 
                                <label className={`opcao-entrega ${entregaSelecionada === 'loja' ? 'selecionada' : ''}`}>
                                    <input type="radio" name="entrega" checked={entregaSelecionada === 'loja'} onChange={() => handleSelecionarEntrega('loja')} />
                                    <div><strong>Retirada na Loja</strong><small>Prédio Taverna - Westeros</small></div>
                                </label>

                                {enderecos.map(end => (
                                    <label key={end.id_endereco} className={`opcao-entrega ${entregaSelecionada === end.id_endereco ? 'selecionada' : ''}`}>
                                        <input type="radio" name="entrega" checked={entregaSelecionada === end.id_endereco} onChange={() => handleSelecionarEntrega('endereco', end.id_endereco)} />
                                        <div>
                                            <strong>{end.rua}, {end.numero}</strong>
                                            <small>{end.bairro} - {end.cidade}</small>
                                        </div>
                                    </label>
                                ))}
                                
                                {enderecos.length === 0 && (
                                    <p style={{color:'#aaa', fontStyle:'italic', textAlign:'center', marginTop:'10px'}}>
                                        Sem endereços. Cadastre um novo acima.
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className='metodos'>
                            <button className="metodo-pix">Pix</button>
                            <button className="metodo-cartao">Cartão</button>
                            <button className="metodo-boleto">Boleto</button>
                        </div>
                        
                        <aside className="resumo">
                            <p className="envio">
                                Envio: {valorFrete === 0 && entregaSelecionada === 'loja' 
                                    ? <span style={{color: '#4caf50'}}>Grátis</span> 
                                    : valorFrete.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                                }
                            </p>
                            <hr className='risco'/>
                            <p className="total-label">Total:</p>
                            <p className="total">{totalFinal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                        </aside>
                        
                        <button className="btn-prosseguir" onClick={handleFinalizarCompra} disabled={isProcessing || cartItems.length === 0 || !entregaSelecionada} style={{ opacity: (!entregaSelecionada || cartItems.length === 0) ? 0.5 : 1 }}>
                            {isProcessing ? 'FORJANDO...' : 'PAGAR'}
                        </button>
                        
                        {statusMessage && <p className="msg-status">{statusMessage}</p>}
                    </aside>
                </main>
            </div>

            {/* --- MODAL DE NOVO ENDEREÇO (Igual ao MeusDados) --- */}
            {dialogAberto && (
                <div className="dialog-overlay">
                    <div className="dialog-box">
                        <div className="dialog-header">
                            <h2>Novo Endereço de Entrega</h2>
                            <button className="btn-fechar-dialog" onClick={() => setDialogAberto(false)}>×</button>
                        </div>
                        <div className="dialog-body">
                            <div className="row-cep">
                                <input type="text" placeholder="CEP" value={novoEndereco.cep} onChange={(e) => setNovoEndereco({...novoEndereco, cep: e.target.value})} maxLength={9}/>
                                <button onClick={buscarCEP} disabled={loadingCep}>{loadingCep ? "..." : "🔍"}</button>
                            </div>
                            <div className="grid-endereco">
                                <input type="text" placeholder="Rua" value={novoEndereco.rua} onChange={(e) => setNovoEndereco({...novoEndereco, rua: e.target.value})} className="full-width" />
                                <input type="text" placeholder="Número" value={novoEndereco.numero} onChange={(e) => setNovoEndereco({...novoEndereco, numero: e.target.value})}/>
                                <input type="text" placeholder="Bairro" value={novoEndereco.bairro} onChange={(e) => setNovoEndereco({...novoEndereco, bairro: e.target.value})} />
                                <input type="text" placeholder="Cidade" value={novoEndereco.cidade} onChange={(e) => setNovoEndereco({...novoEndereco, cidade: e.target.value})} />
                                <input type="text" placeholder="UF" value={novoEndereco.uf} onChange={(e) => setNovoEndereco({...novoEndereco, uf: e.target.value.toUpperCase()})} style={{width: '60px'}} maxLength={2}/>
                                <input type="text" placeholder="Complemento" value={novoEndereco.complemento} onChange={(e) => setNovoEndereco({...novoEndereco, complemento: e.target.value})} className="full-width"/>
                            </div>
                        </div>
                        <div className="dialog-footer">
                            <button className="btn-salvar-endereco" onClick={salvarNovoEndereco}>Confirmar Endereço</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PaginaPagamento;