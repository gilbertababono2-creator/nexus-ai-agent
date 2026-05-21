
import express from 'express';
import admin from 'firebase-admin';

const router = express.Router();
const db = admin.firestore();

// Get all appointments for a user
router.get('/:userId', async (req, res) => {
  try {
    const snapshot = await db.collection('appointments')
      .where('userId', '==', req.params.userId)
      .orderBy('date', 'asc')
      .get();
    
    const appointments = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));
    
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create a new appointment
router.post('/', async (req, res) => {
  try {
    const { userId, date, time, title } = req.body;
    
    if (!userId || !date || !time || !title) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const appointmentRef = await db.collection('appointments').add({
      userId,
      date,
      time,
      title,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(201).json({ 
      id: appointmentRef.id, 
      message: 'Appointment created successfully' 
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete an appointment
router.delete('/:appointmentId', async (req, res) => {
  try {
    await db.collection('appointments').doc(req.params.appointmentId).delete();
    res.json({ success: true, message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
