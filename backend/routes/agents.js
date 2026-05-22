import express from 'express';
import admin from 'firebase-admin';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ Helper: Get conversation history (memory)
async function getHistory(db, userId, limit = 20) {
  const snap = await db.collection('users').doc(userId)
    .collection('conversations')
    .orderBy('timestamp', 'desc')
    .limit(limit)
    .get();
  return snap.docs.map(d => d.data()).reverse();
}

// ✅ Enhanced chat with memory + function calling
router.post('/chat', async (req, res) => {
  try {
    const { userId, message } = req.body;
    if (!userId || !message) {
      return res.status(400).json({ error: 'userId and message are required' });
    }

    const db = admin.firestore();
    const history = await getHistory(db, userId);
    const userRef = db.collection('users').doc(userId);

    // ✅ Build conversation history for Gemini
    const geminiHistory = history.map(h => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.content }]
    }));

    // ✅ Use the correct model name from your JSON
    const model = genAI.getGenerativeModel({ model: 'models/gemini-2.0-flash-001' });
    
    const chat = model.startChat({
      history: geminiHistory
    });

    // ✅ Send message to Gemini
    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    // ✅ Save user message to Firestore
    await userRef.collection('conversations').add({
      role: 'user',
      content: message,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    // ✅ Check if response contains a function call (JSON block)
    let functionCall = null;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.function && parsed.parameters) {
          functionCall = parsed;
        }
      }
    } catch (e) {
      // No valid function call found
    }

    // ✅ Handle function calls
    if (functionCall) {
      const { function: name, parameters: args } = functionCall;

      if (name === 'schedule_appointment') {
        await db.collection('appointments').add({
          userId,
          ...args,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        return res.json({
          message: `📅 Appointment '${args.title}' scheduled for ${args.date} at ${args.time}`
        });
      }

      if (name === 'create_task') {
        await db.collection('tasks').add({
          userId,
          ...args,
          completed: false,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        return res.json({
          message: `✅ Task '${args.task}' (${args.priority}) created`
        });
      }

      if (name === 'store_note') {
        await db.collection('notes').add({
          userId,
          ...args,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        return res.json({
          message: `📝 Note '${args.title}' stored with tags: ${args.tags?.join(', ') || 'none'}`
        });
      }

      if (name === 'search_web') {
        return res.json({
          message: `🔍 Searching web for: "${args.query}" (integration coming soon!)`
        });
      }
    }

    // ✅ Save assistant response (if no function call was made)
    if (!functionCall) {
      await userRef.collection('conversations').add({
        role: 'assistant',
        content: responseText,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    res.json({ 
      response: functionCall ? 'Action performed successfully' : responseText 
    });

  } catch (error) {
    console.error('Gemini Error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
