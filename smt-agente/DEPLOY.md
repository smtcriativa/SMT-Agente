# Guia de Deploy — Agente de Conteúdo SMT
**Tempo estimado: 30 a 40 minutos. Sem custo. Sem necessidade de programador.**

---

## O que você vai criar

- Um **banco de dados gratuito** no Supabase (guarda clientes e histórico de planejamentos)
- Um **app web gratuito** no Vercel (a interface que a equipe usa, acessível por link)

O agente monta o prompt completo e a equipe cola no Claude.ai normalmente — sem custo de API.

---

## PARTE 1 — Supabase (banco de dados)

### Passo 1 — Criar conta no Supabase
1. Acesse **https://supabase.com**
2. Clique em **Start your project**
3. Entre com Google ou crie conta com e-mail
4. Clique em **New Project** e preencha:
   - Name: `smt-agente`
   - Database Password: crie uma senha forte e anote
   - Region: **South America (São Paulo)**
5. Clique em **Create new project** e aguarde ~2 minutos

### Passo 2 — Criar as tabelas do banco
1. No menu lateral, clique em **SQL Editor** (ícone `>_`)
2. Clique em **New Query**
3. Abra o arquivo `supabase_schema.sql` da pasta do projeto
4. Copie tudo (Ctrl+A, Ctrl+C) e cole no SQL Editor
5. Clique em **Run**
6. Deve aparecer "Success. No rows returned" — correto

### Passo 3 — Copiar as chaves do Supabase
1. No menu lateral, clique em **Project Settings** → **API**
2. Copie e guarde em um bloco de notas:
   - **Project URL** — começa com `https://`
   - **Publishable key** (aba "Publishable and secret API keys") — começa com `sb_publishable_`

---

## PARTE 2 — GitHub (onde fica o código)

### Passo 4 — Criar conta no GitHub
1. Acesse **https://github.com** e crie uma conta gratuita
2. Confirme o e-mail

### Passo 5 — Fazer upload do código
1. Clique em **+** no canto superior direito → **New repository**
2. Preencha:
   - Repository name: `smt-agente`
   - Marque **Private**
3. Clique em **Create repository**
4. Clique em **uploading an existing file**
5. Arraste a pasta `smt-agente` inteira para a área de upload
6. Clique em **Commit changes**

---

## PARTE 3 — Vercel (onde o app fica online)

### Passo 6 — Conectar ao Vercel
1. Acesse **https://vercel.com** e faça login com **Continue with GitHub**
2. Clique em **Add New Project**
3. Selecione o repositório **smt-agente** e clique em **Import**
4. Em Framework Preset, selecione **Create React App**

### Passo 7 — Adicionar as variáveis de ambiente
Antes de clicar em Deploy, expanda **Environment Variables** e adicione:

| Nome | Valor |
|---|---|
| `REACT_APP_SUPABASE_URL` | A URL do Supabase (Passo 3) |
| `REACT_APP_SUPABASE_ANON_KEY` | A publishable key do Supabase (Passo 3) |

### Passo 8 — Deploy
1. Clique em **Deploy**
2. Aguarde ~3 minutos
3. O Vercel mostra um link como `https://smt-agente-xyz.vercel.app`
4. Esse link é o app — compartilhe com toda a equipe

---

## Como a equipe usa

1. Acessa o link do Vercel no navegador
2. Cria ou seleciona o cliente
3. Preenche as perguntas (Bloco 1 uma vez, Bloco 2 todo mês)
4. Copia o prompt gerado
5. Cola no Claude.ai e recebe o calendário editorial

---

## Problemas comuns

**O app abre mas não salva:**
→ Rode o SQL do Passo 2 novamente no Supabase.

**Erro de variável de ambiente:**
→ No Vercel, vá em Project Settings → Environment Variables e verifique os dois valores.

**Preciso atualizar o app:**
→ Edite o arquivo no GitHub → Commit → Vercel faz o deploy automático em ~2 minutos.

---

## Resumo de custos

| Serviço | Custo |
|---|---|
| Supabase | Gratuito |
| GitHub | Gratuito |
| Vercel | Gratuito |
| Claude.ai | Assinatura que você já tem |

**Total adicional: R$ 0,00**
