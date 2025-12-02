import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import healthRouter from './routes/health'
import bookingsRouter from './routes/bookings'
import authRouter from './routes/auth'
import adminRouter from './routes/admin'
import managerRouter from './routes/manager'
import hotelsRouter from './routes/hotels'

dotenv.config();

const app = express();
app.use(express.json());

// CORS configuration - allow both dev and production frontends
const allowedOrigins: string[] = [
  'http://localhost:5174',
  'http://localhost:5175',
  'https://tourbnb-showcase.vercel.app'  // Will be your Vercel URL
];

// Add environment variable for custom frontend origin
if (process.env.FRONTEND_ORIGIN) {
  allowedOrigins.push(process.env.FRONTEND_ORIGIN);
}

app.use(cors({ 
  origin: allowedOrigins, 
  credentials: true 
}));
app.use(cookieParser());

app.use('/api/health', healthRouter);
app.use('/api/hotels', hotelsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/manager', managerRouter);

const PORT = Number(process.env.PORT) || 7000;
function startServer(){
	app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
}

if (process.env.NODE_ENV !== 'test') {
	startServer();
}

export default app;
