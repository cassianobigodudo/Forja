import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminEstoque.css';

function AdminEstoque() {
    const [blocos, setBlocos] = useState([]);
    const [slots, setSlots] = useState([]);
    const [logs, setLogs] = useState([]);

    const API_URL = 'https://forja-qvex.onrender.com/api/estoque'; // Ajuste se for localhost

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
            console.error("Erro no Admin:", error);
        }
    };

    useEffect(() => {
        carregarDados();
        const intervalo = setInterval(carregarDados, 5000); // Atualiza a cada 5s
        return () => clearInterval(intervalo);
    }, []);

    const handleEditar = async (bloco) => {
        const qtd = prompt(`Total de blocos ${bloco.cor_nome}:`, bloco.quantidade);
        if (qtd) {
            await axios.put(`${API_URL}/pecas/${bloco.id}`, { quantidade: parseInt(qtd) });
            carregarDados();
        }
    };

    const handleLiberar = async (slot) => {
        if (window.confirm(`Liberar a caixa ${slot}?`)) {
            await axios.post(`${API_URL}/expedicao/${slot}/liberar`);
            carregarDados();
        }
    };

    return (
        <div className="admin-painel">
            <div className="admin-header">
                <h2>⚙️ Painel do Mestre de Forja</h2>
                <button onClick={carregarDados}>🔄 Atualizar</button>
            </div>

            {/* SEÇÃO 1: BLOCOS */}
            <div className="secao-admin">
                <h3>🧱 Estoque de Chassis</h3>
                <div className="grid-blocos">
                    {blocos.map(b => (
                        <div key={b.id} className="card-bloco">
                            <div className="bloco-visual" style={{backgroundColor: b.cor_hex}}>
                                <div className="pino"></div><div className="pino"></div>
                            </div>
                            <strong>{b.cor_nome}</strong>
                            <span>{b.quantidade} un.</span>
                            <button onClick={() => handleEditar(b)}>✏️ Ajustar</button>
                        </div>
                    ))}
                </div>
            </div>

            {/* SEÇÃO 2: GAVETAS */}
            <div className="secao-admin">
                <h3>🏭 Expedição (Saída)</h3>
                <div className="grid-slots">
                    {slots.map(s => (
                        <div key={s.numero_slot} className={`slot-card ${s.status}`}>
                            <div className="slot-head">BOX 0{s.numero_slot}</div>
                            {s.status === 'ocupado' ? (
                                <>
                                    <div className="slot-info">
                                        <p>📦 {s.orderid_externo}</p>
                                        <p>👤 {s.nome_usuario || '...'}</p>
                                    </div>
                                    <button className="btn-liberar" onClick={() => handleLiberar(s.numero_slot)}>
                                        ✅ Entregar
                                    </button>
                                </>
                            ) : <span className="vazio">Livre</span>}
                        </div>
                    ))}
                </div>
            </div>

            {/* SEÇÃO 3: LOGS */}
            <div className="secao-admin">
                <h3>📟 Logs da Máquina</h3>
                <div className="logs-terminal">
                    {logs.map(log => (
                        <div key={log.id} className="log-linha">
                            <span className="log-id">[{log.orderid_externo}]</span>
                            <span className="log-status">{log.status}</span>
                            <pre>{JSON.stringify(log.log_producao, null, 2)}</pre>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AdminEstoque;