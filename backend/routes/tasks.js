import express from 'express';
import admin from 'firebase-admin';

const router = express.Router();


router.get('/:userId', async (req, res) => {
  const db = admin.firestore();
  try {
    const snap = await db.collection('tasks')
      .where('userId', '==', req.params.userId)
      .orderBy('createdAt', 'desc')
      .get();
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/complete/:taskId', async (req, res) => {
  try {
    await db.collection('tasks').doc(req.params.taskId).update({ completed: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
