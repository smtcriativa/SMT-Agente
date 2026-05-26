import React, { useState, useEffect, useRef } from 'react';
import { BLOCO1_STEPS, BLOCO2_STEPS } from '../lib/prompts';

export default function QAFlow({ cliente, modo, onSalvarBloco1, onSalvarPlanejamento, onConcluido, onCancelar }) {
  const steps = modo === 'bloco1' ? BLOCO1_STEPS : BLOCO2_STEPS;
  const [step, setStep] = useState(0);
  const [respostas, setRespostas] = useState(() => {
    if (modo === 'bloco1' && cliente?.bloco1) return { ...cliente.bloco1 };
    return {};
  });
  const [inputAtual, setInputAtual] = useState('');
  const [salvando, setSalvando] = useState(false);
  const inputRef = useRef(null);

  const stepAtual = steps[step];
  const progresso = Math.round((step / steps.length) * 100);

  useEffect(() => {
    const val = respostas[stepAtual?.id] || '';
    setInputAtual(val);
    setTimeout(() => {
      inputRef.current?.focus();
      if (inputRef.current && stepAtual?.tipo === 'text') inputRef.current.select();
    }, 50);
  }, [step]);

  function handleKey(e) {
    if (e.key === 'Enter' && stepAtual?.tipo === 'text') { e.preventDefault(); avancar(); }
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && stepAtual?.tipo === 'textarea') { e.preventDefault(); avancar(); }
  }

  async function avancar() {
    if (!inputAtual.trim()) return;
    const novas = { ...respostas, [stepAtual.id]: inputAtual.trim() };
    setRespostas(novas);
    if (step + 1 < steps.length) {
      setStep(step + 1);
    } else {
      await finalizar(novas);
    }
  }

  async function pular() {
    if (step + 1 < steps.length) {
      setStep(step + 1);
    } else {
      await finalizar(respostas);
    }
  }

  function voltar() {
    if (step > 0) {
      const novas = { ...respostas };
      if (inputAtual.trim()) novas[stepAtual.id] = inputAtual.trim();
      setRespostas(novas);
      setStep(step - 1);
    }
  }

  async function finalizar(dados) {
    setSalvando(true);
    try {
      if (modo === 'bloco1') {
        const clienteAtualizado = await onSalvarBloco1(cliente.id, dados);
        onConcluido({ tipo: 'bloco1', dados, cliente: clienteAtualizado || cliente });
      } else {
        onConcluido({ tipo: 'bloco2', dadosBloco2: dados, bloco1: cliente.bloco1, clienteId: cliente.id });
      }
    } catch (e) {
      console.error(e);
      setSalvando(false);
    }
  }

  return (
    <div>
      <div className="topbar">
        <div className="topbar-brand">
          <div className="brand-dot" />
          <div>
            <div className="brand-name">{cliente?.bloco1?.nome || cliente?.nome}</div>
            <div className="brand-sub">
              {modo === 'bloco1' ? 'Posicionamento' : 'Planejamento mensal'} · {step + 1}/{steps.length}
            </div>
          </div>
        </div>
        <div className="topbar-right">
          <button className="btn btn-ghost" onClick={onCancelar}>✕ Cancelar</button>
        </div>
      </div>

      <div className="progress-wrap">
        <div className="progress-fill" style={{ width: progresso + '%' }} />
      </div>

      <div className="qa-wrap">
        {step > 0 && (
          <div className="qa-history">
            {steps.slice(0, step).map(s => (
              <div className="qa-hist-item" key={s.id}>
                <div className="qa-hist-check">✓</div>
                <div>
                  <div className="qa-hist-q">{s.label}</div>
                  <div className="qa-hist-a">
                    {(respostas[s.id] || '—').length > 90
                      ? respostas[s.id].slice(0, 90) + '…'
                      : respostas[s.id] || '—'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="qa-current">
          <div className="qa-step-num">{step + 1}</div>
          <div style={{ flex: 1 }}>
            <div className="qa-label">{stepAtual.label}</div>
            {stepAtual.hint && <div className="qa-hint">{stepAtual.hint}</div>}
          </div>
        </div>

        {stepAtual.tipo === 'textarea' ? (
          <textarea
            ref={inputRef}
            className="qa-input"
            rows={4}
            placeholder="Digite aqui... (Ctrl+Enter para avançar)"
            value={inputAtual}
            onChange={e => setInputAtual(e.target.value)}
            onKeyDown={handleKey}
          />
        ) : (
          <input
            ref={inputRef}
            type="text"
            className="qa-input"
            placeholder="Digite e pressione Enter..."
            value={inputAtual}
            onChange={e => setInputAtual(e.target.value)}
            onKeyDown={handleKey}
          />
        )}

        <div className="qa-actions">
          {step > 0 && (
            <button className="btn btn-ghost" onClick={voltar}>← Voltar</button>
          )}
          <button
            className="btn btn-primary"
            onClick={avancar}
            disabled={!inputAtual.trim() || salvando}
          >
            {salvando ? 'Salvando...' : step + 1 === steps.length ? 'Finalizar →' : 'Avançar →'}
          </button>
          <button className="btn btn-ghost" style={{ marginLeft: 'auto' }} onClick={pular}>
            Pular
          </button>
        </div>
      </div>
    </div>
  );
}
