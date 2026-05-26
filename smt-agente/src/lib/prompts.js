export const BLOCO1_STEPS = [
  { id: 'nome', label: 'Nome oficial da marca', hint: 'Ex: Laboratório Qualitá, Studio Glow, Escritório Tavares', tipo: 'text' },
  { id: 'segmento', label: 'Segmento e o que a empresa oferece', hint: 'Ex: Laboratório de exames clínicos — saúde preventiva e diagnóstica', tipo: 'text' },
  { id: 'redes', label: 'Redes sociais ativas', hint: 'Ex: Instagram, Facebook, LinkedIn', tipo: 'text' },
  { id: 'publico', label: 'Público-alvo — quem são, o que buscam e quais barreiras têm', hint: 'Ex: Adultos 28-45 que procrastinam exames. Acham caro, têm medo. Comunicação deve acolher, não pressionar.', tipo: 'textarea' },
  { id: 'tom_e', label: 'A marca É — adjetivos que definem o tom de voz', hint: 'Ex: formal, educativa, acolhedora, especialista. Seja específico, não genérico.', tipo: 'text' },
  { id: 'tom_nao', label: 'A marca NÃO É — o que jamais deve parecer', hint: 'Ex: popular, apelativa, fria, sensacionalista', tipo: 'text' },
  { id: 'vocab_proibido', label: 'Vocabulário e regras proibidas (palavras, cores, expressões)', hint: 'Ex: nunca "check-up" (sempre "exames de rotina"); nunca usar preto; nunca chamar de "clínica"', tipo: 'textarea' },
  { id: 'linhas', label: 'Linhas de conteúdo e proporção orientativa', hint: 'Ex: Educativo 35% / Datas comemorativas 20% / Institucional 20% / Serviços 15% / Depoimentos 10%', tipo: 'textarea' },
  { id: 'formatos', label: 'Frequência semanal e preferência de formatos', hint: 'Ex: 3 posts/semana — preferência por fotos. Cards devem ser clean com pouco texto.', tipo: 'text' },
  { id: 'regras_extras', label: 'Outras regras, parceiros e informações importantes', hint: 'Ex: parceiros relevantes, unidades em cidades específicas, nunca excluir posts publicados...', tipo: 'textarea' },
];

export const BLOCO2_STEPS = [
  { id: 'mes', label: 'Mês e ano do planejamento', hint: 'Ex: Agosto 2025', tipo: 'text' },
  { id: 'mote', label: 'Mote (temática) do mês — se não confirmado, escreva "não confirmado"', hint: 'Ex: Prevenção Cardiovascular / Outubro Rosa / não confirmado', tipo: 'text' },
  { id: 'datas', label: 'Datas relevantes no período e como tratar cada uma', hint: 'Ex: 05/08 Dia dos Pais — institucional afetivo / 12/08 feriado — sem post especial', tipo: 'textarea' },
  { id: 'campanhas', label: 'Campanhas ou ações previstas para o mês', hint: 'Ex: Campanha Outubro Rosa — banner + post lançamento / Sem campanha especial', tipo: 'textarea' },
  { id: 'parceiros', label: 'Parceiros ou colaboradores em destaque este mês', hint: 'Ex: Aniversário Hospital São Lucas — post institucional / Nenhum', tipo: 'text' },
  { id: 'performance', label: 'Performance do mês anterior — o que funcionou e o que não funcionou', hint: 'Ex: Melhor: reel educativo (alto salvamento). Pior: estático só texto. / Sem histórico.', tipo: 'textarea' },
  { id: 'solicitacoes', label: 'Solicitações específicas do cliente para este mês', hint: 'Ex: Destacar coleta domiciliar / Evitar posts só texto / Nenhuma', tipo: 'text' },
];

export function gerarBloco1(d) {
  return `Você é um estrategista de conteúdo especializado em ${d.segmento || '[segmento]'}.

## SOBRE A MARCA
Nome oficial: ${d.nome || '[nome]'}
Segmento: ${d.segmento || '[segmento]'}
Redes ativas: ${d.redes || '[redes]'}

## PÚBLICO-ALVO
${d.publico || '[público-alvo]'}

## TOM DE VOZ
A marca É: ${d.tom_e || '[tom positivo]'}
A marca NÃO É: ${d.tom_nao || '[tom negativo]'}

## VOCABULÁRIO E REGRAS OBRIGATÓRIAS
${d.vocab_proibido || '[regras]'}

## LINHAS DE CONTEÚDO E PROPORÇÃO
${d.linhas || '[linhas editoriais]'}

## FORMATOS E FREQUÊNCIA
${d.formatos || '[formatos]'}

## REGRAS E INFORMAÇÕES DE APOIO
${d.regras_extras || '[informações adicionais]'}`;
}

export function gerarBloco2(d) {
  const moteOk = d.mote && !d.mote.toLowerCase().includes('não confirmado') && d.mote.trim() !== '';
  const moteTexto = moteOk
    ? d.mote
    : 'Mote não confirmado — antes de montar o calendário, sugira 3 opções alinhadas ao calendário de saúde do mês de referência para validação com o cliente.';
  return `## MÊS DE REFERÊNCIA
Mês planejado: ${d.mes || '[mês]'}

## MOTE DO MÊS
${moteTexto}

## DATAS RELEVANTES NO PERÍODO
${d.datas || '[datas]'}

## CAMPANHAS OU AÇÕES PREVISTAS
${d.campanhas || 'Sem campanha especial prevista'}

## PARCEIROS OU COLABORADORES EM DESTAQUE
${d.parceiros || 'Sem destaque de parceiros este mês'}

## PERFORMANCE DO MÊS ANTERIOR
${d.performance || 'Sem histórico disponível'}

## SOLICITAÇÕES ESPECÍFICAS DO CLIENTE
${d.solicitacoes || 'Nenhuma solicitação específica'}`;
}

export function gerarInstrucao(linhas) {
  return `## TAREFA
Monte o rascunho do calendário editorial para o mês indicado.

Para cada semana, organize os posts e indique:
1. Tema do post
2. Linha de conteúdo (${linhas || 'conforme as linhas definidas acima'})
3. Formato sugerido (foto, card, reel ou carrossel)
4. Uma frase justificando por que aquele tema faz sentido naquela semana

Regras obrigatórias:
- Respeitar a proporção orientativa das linhas de conteúdo
- Respeitar vocabulário e regras definidas no Bloco 1
- Não criar texto final de legenda — apenas o mapa de temas com justificativa
- Se o mote não foi confirmado, apresentar 3 sugestões antes do calendário
- Ao final, indique 2 alertas estratégicos: oportunidades ou riscos que a equipe deve observar no mês`;
}

export function gerarPromptCompleto(bloco1dados, bloco2dados) {
  const b1 = gerarBloco1(bloco1dados);
  const b2 = gerarBloco2(bloco2dados);
  const instrucao = gerarInstrucao(bloco1dados.linhas || '');
  return `${b1}\n\n---\n\n${b2}\n\n---\n\n${instrucao}`;
}
