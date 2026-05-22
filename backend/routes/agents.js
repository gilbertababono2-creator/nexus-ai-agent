import express from 'express';
import admin from 'firebase-admin';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper: Get conversation history
async function getHistory(db, userId, limit = 20) {
  const snap = await db.collection('users').doc(userId)
    .collection('conversations')
    .orderBy('timestamp', 'desc')
    .limit(limit)
    .get();
  return snap.docs.map(d => d.data()).reverse();
}

// Enhanced chat with memory + function calling (Gemini)
router.post('/chat', async (req, res) => {
  const db = admin.firestore();
  try {
    const { userId, message } = req.body;
    if (!userId || !message) {
      return res.status(400).json({ error: 'userId and message are required' });
    }

    const history = await getHistory(db, userId);
    const userRef = db.collection('users').doc(userId);

    // Build messages for Gemini
    const geminiHistory = history.map(h => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.content }]
    }));

    // System prompt as first message
    const systemPrompt = {
      role: 'user',
      parts: [{
        text: `You are Nexus, an advanced AI agent with memory, task management, scheduling, and web search capabilities.
        You can schedule appointments, create tasks, store notes, generate images, and search the web.
        Keep responses concise, helpful, and friendly.

        If you need to perform an action, respond with a JSON block using the following format:
        {
          "function": "function_name",
          "parameters": { ... }
        }

        Available functions:
        - schedule_appointment: { "date": "YYYY-MM-DD", "time": "HH:MM", "title": "string" }
        - create_task: { "task": "string", "priority": "high|medium|low" }
        - store_note: { "title": "string", "content": "string", "tags": ["string"] }
        - search_web: { "query": "string" }
        
        If no action is needed, just respond normally.`
      }]
    };

    const chat = genAI.getGenerativeModel({ model: 'gemini-1.0-pro' }).startChat({
      history: [...geminiHistory]
    });

    // Send message
    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    // Check if response contains a JSON function call
    let functionCall = null;
    try {
      // Look for JSON block in response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.function && parsed.parameters) {
          functionCall = parsed;
        }
      }
    } catch (e) {
      // No valid JSON function call found, treat as normal response
    }

    // Handle function calls
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

    // Save user message
    await userRef.collection('conversations').add({
      role: 'user',
      content: message,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    // Save assistant response (if no function call was made)
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
