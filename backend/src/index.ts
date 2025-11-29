import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import healthRouter from './routes/health'

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api/health', healthRouter);

// Basic route placeholders
app.get('/api/admin/hotels', (req, res) => res.json({ data: [] }));

const PORT = Number(process.env.PORT) || 7000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
