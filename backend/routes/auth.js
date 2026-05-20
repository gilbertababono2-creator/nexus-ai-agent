
import express from 'express';
import admin from 'firebase-admin';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { token } = req.body;
    const decodedToken = await admin.auth().verifyIdToken(token);
    res.json({ uid: decodedToken.uid, email: decodedToken.email, name: decodedToken.name });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
