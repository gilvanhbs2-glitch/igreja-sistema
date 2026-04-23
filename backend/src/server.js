import express from 'express';
import cors from 'cors';
import membersRoutes from './routes/members.js';
import presencesRoutes from './routes/presences.js';
import authRoutes from './routes/auth.js';
import { ensureDefaultAdminUser } from './services/authService.js';

const app = express();
const PORT = process.env.PORT || 3333;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/', (req, res) => {
  res.send('Backend Igreja OK');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

ensureDefaultAdminUser();

app.use('/api/auth', authRoutes);
app.use('/api/members', membersRoutes);
app.use('/api/presences', presencesRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor backend rodando em http://localhost:${PORT}`);
});
