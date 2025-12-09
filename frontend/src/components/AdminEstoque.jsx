import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminEstoque.css';

function AdminEstoque() {
    const [blocos, setBlocos] = useState([]);
    const [slots, setSlots] = useState([]);

    const API_URL = 'https://forja-qvex.onrender.com/api/estoque';

    // --- CARREGAR DADOS ---
    const carregarDados = async () => {
        try {
            const [resBlocos, resSlots] = await Promise.all([
                axios.get(`${API_URL}/pecas`),
                axios.get(`${API_URL}/expedicao`)
            ]);
            setBlocos(resBlocos.data);
            setSlots(resSlots.data);
        } catch (error) {
            console.error("Erro ao carregar painel admin", error);
        }
    };

    useEffect(() => {
        carregarDados();
        const intervalo = setInterval(carregarDados, 5000);
        return () => clearInterval(intervalo);
    }, []);

    // --- AÇÕES ---
    const handleEditarEstoque = async (bloco) => {
        const novaQtd = prompt(`Quantos blocos ${bloco.cor_nome} existem agora?`, bloco.quantidade);
        if (novaQtd === null) return;
        
        try {
            await axios.put(`${API_URL}/pecas/${bloco.id}`, { quantidade: parseInt(novaQtd) });
            carregarDados();
        } catch (e) { alert("Erro ao atualizar estoque."); }
    };

    const handleConfirmarEntrega = async (slotNumero) => {
        if (!window.confirm(`Liberar Slot ${slotNumero}?`)) return;
        try {
            await axios.post(`${API_URL}/expedicao/${slotNumero}/liberar`);
            carregarDados();
        } catch (e) { alert("Erro ao liberar slot."); }
    };

    return (
        <div className="admin-painel">
            <h2 className="titulo-admin">⚙️ Mestre de Forja: Controle Industrial</h2>

            {/* --- SEÇÃO 1: ESTOQUE DE CHASSIS UNIVERSAIS --- */}
            <div className="secao-admin">
                <h3>🧱 Estoque de Chassis (Blocos Universais)</h3>
                <p className="subtitulo-admin">Cada miniatura consome 3 blocos.</p>
                
                <div className="grid-blocos">
                    {blocos.map(bloco => (
                        <div key={bloco.id} className="card-bloco">
                            {/* Visual do Bloco */}
                            <div 
                                className="bloco-visual" 
                                style={{ backgroundColor: bloco.cor_hex || '#ccc' }}
                            >
                                <div className="pino"></div>
                                <div className="pino"></div>
                            </div>

                            <div className="bloco-info">
                                <strong>{bloco.cor_nome}</strong>
                                <span className={`qtd-badge ${bloco.quantidade < 20 ? 'baixo' : ''}`}>
                                    {bloco.quantidade} unid.
                                </span>
                            </div>

                            <button className="btn-ajuste" onClick={() => handleEditarEstoque(bloco)}>
                                Ajustar
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- SEÇÃO 2: SLOTS DE SAÍDA --- */}
            <div className="secao-admin">
                <h3>🏭 Slots de Expedição (Saída da Máquina)</h3>
                <div className="grid-slots">
                    {slots.map(slot => (
                        <div key={slot.numero_slot} className={`slot-card ${slot.status === 'ocupado' ? 'ocupado' : 'livre'}`}>
                            <div className="slot-header">
                                <span>CAIXA 0{slot.numero_slot}</span>
                                <div className={`luz-status ${slot.status}`}></div>
                            </div>
                            
                            <div className="slot-conteudo">
                                {slot.status === 'ocupado' ? (
                                    <>
                                        <div className="info-pedido">
                                            <strong>Pedido:</strong> {slot.orderid_externo || '---'}
                                        </div>
                                        <div className="info-cliente">
                                            <strong>Aventureiro:</strong><br/>
                                            {slot.nome_usuario || 'Desconhecido'}
                                        </div>
                                        <button 
                                            className="btn-entregar"
                                            onClick={() => handleConfirmarEntrega(slot.numero_slot)}
                                        >
                                            Entregar Item
                                        </button>
                                    </>
                                ) : (
                                    <span className="vazio-text">Vazio</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AdminEstoque;