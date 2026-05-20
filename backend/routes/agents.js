import express from 'express';
import admin from 'firebase-admin';
import OpenAI from 'openai';

const router = express.Router();
const db = admin.firestore();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Helper: Get conversation history
async function getHistory(userId, limit = 20) {
  const snap = await db.collection('users').doc(userId)
    .collection('conversations')
    .orderBy('timestamp', 'desc')
    .limit(limit)
    .get();
  return snap.docs.map(d => d.data()).reverse();
}

// Enhanced chat with memory + function calling
router.post('/chat', async (req, res) => {
  try {
    const { userId, message } = req.body;
    if (!userId || !message) {
      return res.status(400).json({ error: 'userId and message are required' });
    }

    const history = await getHistory(userId);
    const userRef = db.collection('users').doc(userId);

    // Build messages
    const messages = [
      { role: 'system', content: `You are Nexus, an advanced AI agent with memory, task management, scheduling, and web search capabilities. 
        You can schedule appointments, create tasks, store notes, generate images, and search the web. 
        Keep responses concise, helpful, and friendly.` },
      ...history.map(h => ({ role: h.role, content: h.content })),
      { role: 'user', content: message }
    ];

    // Tools/Functions
    const tools = [
      {
        type: 'function',
        function: {
          name: 'schedule_appointment',
          description: 'Schedule an appointment',
          parameters: {
            type: 'object',
            properties: {
              date: { type: 'string', description: 'YYYY-MM-DD' },
              time: { type: 'string', description: 'HH:MM' },
              title: { type: 'string' }
            }
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'create_task',
          description: 'Create a task',
          parameters: {
            type: 'object',
            properties: {
              task: { type: 'string' },
              priority: { type: 'string', enum: ['high', 'medium', 'low'] }
            }
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'store_note',
          description: 'Store a note for the user',
          parameters: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              content: { type: 'string' },
              tags: { type: 'array', items: { type: 'string' } }
            }
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'search_web',
          description: 'Search the web for current information',
          parameters: {
            type: 'object',
            properties: {
              query: { type: 'string' }
            }
          }
        }
      }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      tools,
      tool_choice: 'auto',
    });

    const responseMsg = completion.choices[0].message;

    // Save user message to history
    await userRef.collection('conversations').add({
      role: 'user',
      content: message,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    // Handle tool calls
    if (responseMsg.tool_calls) {
      for (const call of responseMsg.tool_calls) {
        const args = JSON.parse(call.function.arguments);
        const name = call.function.name;

        if (name === 'schedule_appointment') {
          await db.collection('appointments').add({
            userId, ...args, createdAt: admin.firestore.FieldValue.serverTimestamp()
          });
          return res.json({ 
            message: `📅 Appointment '${args.title}' scheduled for ${args.date} at ${args.time}` 
          });
        }

        if (name === 'create_task') {
          await db.collection('tasks').add({
            userId, ...args, completed: false, createdAt: admin.firestore.FieldValue.serverTimestamp()
          });
          return res.json({ 
            message: `✅ Task '${args.task}' (${args.priority}) created` 
          });
        }

        if (name === 'store_note') {
          await db.collection('notes').add({
            userId, ...args, createdAt: admin.firestore.FieldValue.serverTimestamp()
          });
          return res.json({ message: `📝 Note '${args.title}' stored with tags: ${args.tags?.join(', ') || 'none'}` });
        }

        if (name === 'search_web') {
          // Simulated web search (you could integrate a real API like SerpAPI)
          return res.json({ message: `🔍 Searching web for: "${args.query}" (integration coming soon!)` });
        }
      }
    }

    // Save assistant response
    await userRef.collection('conversations').add({
      role: 'assistant',
      content: responseMsg.content,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ response: responseMsg.content });

  } catch (error) {
    console.error('Agent Error:', error);
    res.status(500).json({ error: 'Agent internal error' });
  }
});

export default router;
