# Projeto desenvolvido por ANNA BEATRIZ RA24002072

# Vinix Comunicação Visual — Sistema Web

Sistema real baseado no protótipo, com:
- site institucional responsivo;
- formulário de orçamento conectado à API;
- upload de imagem/PDF de referência;
- PostgreSQL;
- painel administrativo protegido por login e JWT em cookie HTTP-only;
- atualização de status dos orçamentos;
- endpoint de health check;
- Docker Compose para ambiente local;
- CI básico com GitHub Actions.

## Rodar localmente com Docker

1. Instale Docker Desktop.
2. Na pasta do projeto, execute:

```bash
docker compose up --build
```

3. Abra `http://localhost:3000`.
4. Painel: `http://localhost:3000/admin`.
5. Acesso administrativo: `http://localhost:3000/admin`.

**Troque as credenciais e o JWT_SECRET antes de qualquer publicação.**

## Rodar sem Docker

1. Instale Node.js 22+ e PostgreSQL.
2. Crie o banco e execute `db/schema.sql`.
3. Copie `.env.example` para `.env` e ajuste os valores.
4. Execute `npm install` e depois `npm start`.

## Implantação em nuvem

O sistema VINIX Comunicação Visual foi publicado na plataforma Render, utilizando PostgreSQL e armazenamento de arquivos pelo Supabase.

O projeto também utiliza Docker para execução local e GitHub para versionamento do código.

**Site publicado:** https://vinix-sistema-real.onrender.com

**Repositório:** https://github.com/Anna-Beatriiz/vinix-sistema-real
