-- Execute este SQL no painel do Supabase (SQL Editor)
-- Menu: Database > SQL Editor > New Query > cole tudo abaixo > Run

create table if not exists clientes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  bloco1 jsonb,
  criado_em timestamptz default now(),
  atualizado_em timestamptz default now()
);

create table if not exists planejamentos (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid references clientes(id) on delete cascade,
  mes text not null,
  dados_bloco2 jsonb not null,
  calendario_gerado text,
  criado_em timestamptz default now()
);

-- Atualiza automaticamente o campo atualizado_em
create or replace function atualizar_timestamp()
returns trigger as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_clientes_ts
  before update on clientes
  for each row execute function atualizar_timestamp();

-- Permite acesso público (sem autenticação) para uso interno da equipe
alter table clientes enable row level security;
alter table planejamentos enable row level security;

create policy "acesso_total_clientes" on clientes for all using (true) with check (true);
create policy "acesso_total_planejamentos" on planejamentos for all using (true) with check (true);
