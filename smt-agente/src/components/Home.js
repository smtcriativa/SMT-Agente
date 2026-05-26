import React, { useState } from 'react';

export default function Home({
  clientes, clienteSelecionado, onSelectCliente,
  onCriarCliente, onDeletarCliente, onIniciarBloco1, onIniciarBloco2
}) {
  const [criando, setCriando] = useState(false);
  const [nomeNovo, setNomeNovo] = useState('');

  function handleCriar(e) {
    e.preventDefault();
    if (!nomeNovo.trim()) return;
    onCriarCliente(nomeNovo.trim());
    setNomeNovo('');
    setCriando(false);
  }

  const c = clienteSelecionado;
  const temBloco1 = !!(c?.bloco1?.nome);

  return (
    <div>
      <div className="topbar">
        <div className="topbar-brand">
          <div className="brand-dot" />
          <div>
            <div className="brand-name">Agente de Conteúdo</div>
            <div className="brand-sub">SMT · Planejamento mensal</div>
          </div>
        </div>
      </div>

      <div className="screen">
        <div className="section-label">Clientes</div>

        <div className="client-grid">
          {clientes.map(cl => (
            <div
              key={cl.id}
              className={`client-card ${clienteSelecionado?.id === cl.id ? 'selected' : ''}`}
              onClick={() => onSelectCliente(cl)}
            >
              <div className="client-name">{cl.bloco1?.nome || cl.nome}</div>
              <div className="client-seg">{cl.bloco1?.segmento || '—'}</div>
              <span className={`client-badge ${cl.bloco1?.nome ? 'badge-ok' : 'badge-new'}`}>
                {cl.bloco1?.nome ? 'Posicionamento ok' : 'Configurar'}
              </span>
            </div>
          ))}

          {criando ? (
            <form onSubmit={handleCriar} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <input
                autoFocus
                className="qa-input"
                style={{ marginBottom: 0 }}
                placeholder="Nome do cliente..."
                value={nomeNovo}
                onChange={e => setNomeNovo(e.target.value)}
              />
              <div style={{ display: 'flex', gap: 6 }}>
                <button type="submit" className="btn btn-accent" style={{ flex: 1, justifyContent: 'center' }}>Criar</button>
                <button type="button" className="btn btn-ghost" onClick={() => setCriando(false)}>✕</button>
              </div>
            </form>
          ) : (
            <div className="add-card" onClick={() => setCriando(true)}>
              <span style={{ fontSize: 18 }}>+</span>
              Novo cliente
            </div>
          )}
        </div>

        {c && (
          <div className="action-panel">
            <div className="section-label">
              Ações — {c.bloco1?.nome || c.nome}
            </div>

            <div className="action-grid">
              <div
                className={`action-card ${!temBloco1 ? 'highlighted' : ''}`}
                onClick={() => onIniciarBloco1(c)}
              >
                <div className="action-icon">{temBloco1 ? '✏️' : '⚙️'}</div>
                <div className="action-title">
                  {temBloco1 ? 'Editar posicionamento' : 'Configurar posicionamento'}
                </div>
                <div className="action-desc">
                  {temBloco1
                    ? 'Bloco 1 configurado. Atualize só se o posicionamento mudar.'
                    : 'Feito uma vez. Define tom de voz, linhas editoriais e regras.'}
                </div>
              </div>

              <div
                className={`action-card ${temBloco1 ? 'highlighted' : ''}`}
                onClick={() => temBloco1 ? onIniciarBloco2(c) : alert('Configure o posicionamento primeiro.')}
                style={{ opacity: temBloco1 ? 1 : 0.5 }}
              >
                <div className="action-icon">📅</div>
                <div className="action-title">Iniciar planejamento do mês</div>
                <div className="action-desc">
                  {temBloco1
                    ? 'Preencha os dados do mês e gere o calendário editorial com IA.'
                    : 'Disponível após configurar o posicionamento.'}
                </div>
              </div>
            </div>

            {c.planejamentos?.length > 0 && (
              <div className="history-panel" style={{ marginTop: 12 }}>
                <div className="history-title">Histórico de planejamentos</div>
                {c.planejamentos.slice(0, 6).map(p => (
                  <div className="history-item" key={p.id}>
                    <span className="history-mes">{p.mes}</span>
                    <span className="history-data">
                      {new Date(p.criado_em).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="action-footer">
              <span />
              <button
                className="btn btn-danger"
                onClick={() => {
                  if (window.confirm(`Remover ${c.bloco1?.nome || c.nome}? Esta ação não pode ser desfeita.`)) {
                    onDeletarCliente(c.id);
                  }
                }}
              >
                🗑 Remover cliente
              </button>
            </div>
          </div>
        )}

        {clientes.length === 0 && !criando && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: 14 }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>🏢</div>
            Nenhum cliente cadastrado ainda.<br />
            Clique em "Novo cliente" para começar.
          </div>
        )}
      </div>
    </div>
  );
}
