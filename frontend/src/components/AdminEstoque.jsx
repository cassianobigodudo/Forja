import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminEstoque.css';

// --- ÍCONES SVG (Visual Limpo e Industrial) ---
const IconeCubo = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
);
const IconeCaixa = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path><path d="m3.3 7 8.7 5 8.7-5"></path><path d="M12 22V12"></path></svg>
);
const IconeTerminal = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>
);
const IconeEditar = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
);
const IconeCheck = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
);
const IconeRefresh = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"></path><path d="M1 20v-6h6"></path><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
);

function AdminEstoque() {
    const [blocos, setBlocos] = useState([]);
    const [slots, setSlots] = useState([]);
    const [logs, setLogs] = useState([]);

    const API_URL = 'https://forja-qvex.onrender.com/api/estoque';

    const carregarDados = async () => {
        try {
            const [resBlocos, resSlots, resLogs] = await Promise.all([
                axios.get(`${API_URL}/pecas`),
                axios.get(`${API_URL}/expedicao`),
                axios.get(`${API_URL}/logs`)
            ]);
            setBlocos(resBlocos.data);
            setSlots(resSlots.data);
            setLogs(resLogs.data);
        } catch (error) {
            console.error("Erro Admin:", error);
        }
    };

    useEffect(() => {
        carregarDados();
        const intervalo = setInterval(carregarDados, 5000);
        return () => clearInterval(intervalo);
    }, []);

    const handleEditarEstoque = async (bloco) => {
        const novaQtd = prompt(`Ajustar quantidade de chassis ${bloco.cor_nome}:`, bloco.quantidade);
        if (novaQtd === null) return;
        try {
            await axios.put(`${API_URL}/pecas/${bloco.id}`, { quantidade: parseInt(novaQtd) });
            carregarDados();
        } catch (e) { alert("Erro ao atualizar."); }
    };

    const handleConfirmarEntrega = async (slotNumero) => {
        if (!window.confirm(`Confirmar retirada do Slot ${slotNumero}?`)) return;
        try {
            await axios.post(`${API_URL}/expedicao/${slotNumero}/liberar`);
            carregarDados();
        } catch (e) { alert("Erro ao liberar slot."); }
    };

    return (
        <div className="admin-painel">
            <div className="admin-header">
                <h2>Controle de Produção</h2>
                <button className="btn-refresh" onClick={carregarDados}>
                    <IconeRefresh /> Atualizar
                </button>
            </div>

            {/* SEÇÃO 1: BLOCOS (CHASSIS) */}
            <div className="secao-admin">
                <div className="titulo-secao">
                    <IconeCubo /> <h3>Estoque de Matéria-Prima</h3>
                </div>
                
                <div className="grid-blocos">
                    {blocos.map(bloco => (
                        <div key={bloco.id} className="card-bloco" style={{ borderColor: bloco.cor_hex }}>
                            <div className="bloco-header">
                                <span className="bloco-nome">{bloco.cor_nome}</span>
                            </div>
                            
                            {/* Visual Esquemático do Bloco */}
                            <div className="bloco-schematic" style={{ borderColor: bloco.cor_hex }}>
                                <div className="bloco-fill" style={{ backgroundColor: bloco.cor_hex }}></div>
                            </div>

                            <div className="bloco-footer">
                                <span className="bloco-qtd">{bloco.quantidade} un.</span>
                                <button className="btn-icon" onClick={() => handleEditarEstoque(bloco)} title="Editar Estoque">
                                    <IconeEditar />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* SEÇÃO 2: SLOTS (EXPEDIÇÃO) */}
            <div className="secao-admin">
                <div className="titulo-secao">
                    <IconeCaixa /> <h3>Expedição & Retirada</h3>
                </div>

                <div className="grid-slots">
                    {slots.map(s => (
                        <div key={s.numero_slot} className={`slot-card ${s.status === 'ocupado' ? 'ocupado' : 'livre'}`}>
                            <div className="slot-id">BOX 0{s.numero_slot}</div>
                            
                            <div className="slot-body">
                                {s.status === 'ocupado' ? (
                                    <>
                                        <div className="pedido-info">
                                            <span className="label">Pedido</span>
                                            <span className="valor">{s.orderid_externo}</span>
                                        </div>
                                        <div className="pedido-info">
                                            <span className="label">Cliente</span>
                                            <span className="valor">{s.nome_usuario || '---'}</span>
                                        </div>
                                        <button className="btn-liberar" onClick={() => handleConfirmarEntrega(s.numero_slot)}>
                                            <IconeCheck /> Confirmar Entrega
                                        </button>
                                    </>
                                ) : (
                                    <span className="status-livre">Disponível</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* SEÇÃO 3: LOGS */}
            <div className="secao-admin logs-container">
                <div className="titulo-secao">
                    <IconeTerminal /> <h3>Telemetria da Máquina</h3>
                </div>
                <div className="console-logs">
                    {logs.map(log => (
                        <div key={log.id} className="log-linha">
                            <span className="log-time">ID: {log.orderid_externo}</span>
                            <span className={`log-tag ${log.status.toLowerCase()}`}>{log.status}</span>
                            <div className="log-json">
                                {JSON.stringify(log.log_producao).substring(0, 150)}...
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AdminEstoque;