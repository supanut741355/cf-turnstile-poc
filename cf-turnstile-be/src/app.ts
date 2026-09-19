import express from 'express';
import type { Express, Request, Response } from 'express';
import authRoutes from './routes/auth.ts'

const app: Express = express();
const PORT: number = 4000;

app.use(express.json());
app.use('/api', authRoutes)
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'yo server running' });
});


app.listen(PORT, () => {
  console.log(`running at ${PORT}`);
});