# Igreja Sistema Profissional

Base refeita do zero, separada e limpa.

## Estrutura
- `frontend` → painel web React/Vite
- `backend` → API Express + SQLite
- `mobile-app` → app Expo para leitura de QR

## Rodar backend
```bash
cd backend
npm install
npm run dev
```

## Rodar frontend
```bash
cd frontend
npm install
npm run dev
```

## Backend online
- Para ambiente real, troque o SQLite por Supabase/Postgres.
- Esta versão está pronta para desenvolvimento local e para reorganizar seu deploy sem bagunça.

## Rotas principais
- `GET /api/health`
- `GET /api/members`
- `POST /api/members`
- `PUT /api/members/:id`
- `DELETE /api/members/:id`
- `GET /api/presences`
- `POST /api/presences`

## App mobile
No arquivo `mobile-app/app/index.tsx`, ajuste `API_URL` para o endereço do backend.
