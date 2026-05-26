import React, { useState, useEffect } from 'react';
import { gerarBloco1, gerarBloco2, gerarPromptCompleto } from '../lib/prompts';
import { supabase } from '../lib/supabase';

export default function Output({ data, cliente, onVoltar, onIniciarBloco2 }) {
  const [copiado, setCopiado] = useState(null);
  const [salvo, setSalvo] = useState(false);

  const isBloco2 = data?.tipo === 'bloco2';
  const bloco1dados = isBloco2 ? data.bloco1 : data?.dados;
  const bloco2dados = isBloco2 ? data.dadosBloco2 : null;

  const b1texto = bloco1dados ? gerarBloco1(bloco1dados) : '';
  const promptCompleto = bloco2dados ? gerarPromptCompleto(bloco1dados, bloco2dados) : b1texto;

  useEffect(() => {
    if (isBloco2 && data.clienteId && bloco2dados?.mes && !salvo) {
      setSalvo(true);
      supabase.from('planejamentos').insert({
        cliente_id: data.clienteId,
        mes: bloco2dados.mes,
        dados_bloco2: bloco2dados,
        calendario_gerado: null,
      }).then(() => {}).catch(() => {});
    }
  }, []);

  function copiar(txt, id) {
    navigator.clipboard.writeText(txt).catch(() => {});
    setCopiado(id);
    setTimeout(() => setCopiado(null), 2500);
  }

  const nomecliente = cliente?.bloco1?.nome || cliente?.nome || 'cliente';

  return (
    <div>
      <div className="topbar">
        <div className="topbar-brand">
          <div className="brand-dot" />
          <div>
            <div className="brand-name">{nomecliente}</div>
            <div className="brand-sub">
              {isBloco2 ? `Planejamento — ${bloco2dados?.mes || ''}` : 'Posicionamento salvo'}
            </div>
          </div>
        </div>
        <div className="topbar-right">
          <button className="btn btn-ghost" onClick={onVoltar}>← Início</button>
        </div>
      </div>

      <div className="output-wrap">

        <div className="output-header">
          <div className="output-check">✓</div>
          <div>
            <div className="output-title">
              {isBloco2 ? 'Prompt pronto para usar' : 'Posicionamento salvo'}
            </div>
            <div className="output-sub">
              {isBloco2
                ? `${nomecliente} · ${bloco2dados?.mes || ''}`
                : `${nomecliente} · Bloco 1 salvo para toda a equipe`}
            </div>
          </div>
        </div>

        {isBloco2 && (
          <div className="info-box">
            <strong>Como usar:</strong> Copie o prompt abaixo e cole diretamente no Claude.ai.
            O calendário editorial será gerado na conversa — sem custo adicional além da sua assinatura atual.
          </div>
        )}

        {isBloco2 && (
          <div className="prompt-block">
            <div className="prompt-block-header">
              <span className="prompt-block-label">📋 Prompt completo — cole no Claude.ai</span>
              <button
                className={`copy-btn ${copiado === 'full' ? 'copied' : ''}`}
                onClick={() => copiar(promptCompleto, 'full')}
              >
                {copiado === 'full' ? '✓ Copiado!' : '⎘ Copiar prompt'}
              </button>
            </div>
            <div className="prompt-block-body">{promptCompleto}</div>
          </div>
        )}

        {!isBloco2 && (
          <div className="prompt-block">
            <div className="prompt-block-header">
              <span className="prompt-block-label">Bloco 1 — Posicionamento</span>
              <button
                className={`copy-btn ${copiado === 'b1' ? 'copied' : ''}`}
                onClick={() => copiar(b1texto, 'b1')}
              >
                {copiado === 'b1' ? '✓ Copiado!' : '⎘ Copiar'}
              </button>
            </div>
            <div className="prompt-block-body">{b1texto}</div>
          </div>
        )}

        {!isBloco2 && (
          <div className="info-box">
            <strong>Salvo!</strong> O posicionamento de <strong>{nomecliente}</strong> está disponível
            para toda a equipe. Quando for planejar o mês, clique em "Iniciar planejamento do mês".
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {!isBloco2 && (
            <button className="btn btn-accent" onClick={onIniciarBloco2}>
              📅 Iniciar planejamento do mês →
            </button>
          )}
          {isBloco2 && (
            <button
              className="btn btn-accent"
              style={{ fontSize: 14, padding: '10px 20px' }}
              onClick={() => copiar(promptCompleto, 'full')}
            >
              {copiado === 'full' ? '✓ Copiado!' : '⎘ Copiar prompt e abrir Claude.ai →'}
            </button>
          )}
          <button className="btn" onClick={onVoltar}>Voltar ao início</button>
        </div>

      </div>
    </div>
  );
}
