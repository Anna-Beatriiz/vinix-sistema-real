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
5. Credenciais locais: `admin@vinix.local` / `Vinix@123456`.

**Troque as credenciais e o JWT_SECRET antes de qualquer publicação.**

## Rodar sem Docker

1. Instale Node.js 22+ e PostgreSQL.
2. Crie o banco e execute `db/schema.sql`.
3. Copie `.env.example` para `.env` e ajuste os valores.
4. Execute `npm install` e depois `npm start`.

## Próxima etapa de produção

Para cumprir integralmente a parte de Computação em Nuvem do Projeto Integrado, publicar a aplicação em um provedor (AWS/Azure/GCP), usar PostgreSQL gerenciado, HTTPS/domínio, armazenamento de arquivos adequado, secrets, logs/métricas e deploy CI/CD.
