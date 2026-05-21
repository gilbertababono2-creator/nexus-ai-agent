import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import admin from 'firebase-admin';

dotenv.config();


// Build the service account from individual environment variables
const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


// ✅ Make Firestore available globally
const db = admin.firestore();

// ✅ Import routes AFTER Firebase is ready
import authRoutes from './routes/auth.js';
import agentRoutes from './routes/agents.js';
import appointmentRoutes from './routes/appointments.js';
import taskRoutes from './routes/tasks.js';
import fileRoutes from './routes/files.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use('/api/', limiter);

app.use('/api/auth', authRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/files', fileRoutes);

app.get('/health', (req, res) => res.status(200).send('OK'));

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

console.log('✅ Firebase initialized successfully');
console.log('📦 Firestore ready:', !!admin.firestore());
