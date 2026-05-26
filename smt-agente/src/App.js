import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Home from './components/Home';
import QAFlow from './components/QAFlow';
import Output from './components/Output';
import './App.css';

export default function App() {
  const [view, setView] = useState('home'); // home | qa | output
  const [clientes, setClientes] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [qaMode, setQaMode] = useState(null); // bloco1 | bloco2
  const [outputData, setOutputData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { carregarClientes(); }, []);

  async function carregarClientes() {
    setLoading(true);
    const { data, error } = await supabase
      .from('clientes')
      .select('*, planejamentos(id, mes, criado_em)')
      .order('atualizado_em', { ascending: false });
    if (!error && data) setClientes(data);
    setLoading(false);
  }

  async function criarCliente(nome) {
    const { data, error } = await supabase
      .from('clientes')
      .insert({ nome })
      .select()
      .single();
    if (!error && data) {
      await carregarClientes();
      setClienteSelecionado(data);
    }
  }

  async function salvarBloco1(clienteId, bloco1) {
    const { data, error } = await supabase
      .from('clientes')
      .update({ bloco1, nome: bloco1.nome })
      .eq('id', clienteId)
      .select()
      .single();
    if (!error && data) {
      await carregarClientes();
      setClienteSelecionado(data);
      return data;
    }
    return null;
  }

  async function salvarPlanejamento(clienteId, mes, dadosBloco2, calendarioGerado) {
    const { data, error } = await supabase
      .from('planejamentos')
      .insert({ cliente_id: clienteId, mes, dados_bloco2: dadosBloco2, calendario_gerado: calendarioGerado })
      .select()
      .single();
    if (!error) await carregarClientes();
    return data;
  }

  async function deletarCliente(clienteId) {
    await supabase.from('clientes').delete().eq('id', clienteId);
    setClienteSelecionado(null);
    await carregarClientes();
  }

  function iniciarBloco1(cliente) {
    setClienteSelecionado(cliente);
    setQaMode('bloco1');
    setView('qa');
  }

  function iniciarBloco2(cliente) {
    setClienteSelecionado(cliente);
    setQaMode('bloco2');
    setView('qa');
  }

  function irParaOutput(data) {
    setOutputData(data);
    setView('output');
  }

  function voltar() {
    setView('home');
    setOutputData(null);
    carregarClientes();
  }

  if (loading) return (
    <div className="loading-screen">
      <div className="loading-dot"></div>
      <span>Carregando clientes...</span>
    </div>
  );

  return (
    <div className="app">
      {view === 'home' && (
        <Home
          clientes={clientes}
          clienteSelecionado={clienteSelecionado}
          onSelectCliente={setClienteSelecionado}
          onCriarCliente={criarCliente}
          onDeletarCliente={deletarCliente}
          onIniciarBloco1={iniciarBloco1}
          onIniciarBloco2={iniciarBloco2}
        />
      )}
      {view === 'qa' && (
        <QAFlow
          cliente={clienteSelecionado}
          modo={qaMode}
          onSalvarBloco1={salvarBloco1}
          onSalvarPlanejamento={salvarPlanejamento}
          onConcluido={irParaOutput}
          onCancelar={voltar}
        />
      )}
      {view === 'output' && (
        <Output
          data={outputData}
          cliente={clienteSelecionado}
          onVoltar={voltar}
          onIniciarBloco2={() => iniciarBloco2(clienteSelecionado)}
        />
      )}
    </div>
  );
}
