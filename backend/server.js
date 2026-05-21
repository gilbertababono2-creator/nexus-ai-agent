import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import admin from 'firebase-admin';

dotenv.config();

// 🔥 Initialize Firebase FIRST
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// ✅ Firestore is now ready
const db = admin.firestore();

// ✅ Import routes AFTER Firebase is ready
import authRoutes from './routes/auth.js';
import agentRoutes from './routes/agents.js';
import appointmentRoutes from './routes/appointments.js';
import taskRoutes from './routes/tasks.js';
import fileRoutes from './routes/files.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use('/api/', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/files', fileRoutes);

// Health check
app.get('/health', (req, res) => res.status(200).send('OK'));

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

console.log('✅ Firebase initialized successfully');
console.log('📦 Firestore ready:', !!admin.firestore());
