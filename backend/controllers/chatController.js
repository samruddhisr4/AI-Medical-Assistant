const OpenAI = require('openai');
const Conversation = require('../models/Conversation');

const apiKey = (process.env.GROQ_API_KEY || '').trim();
const groq = new OpenAI({
  apiKey: apiKey,
  baseURL: "https://api.groq.com/openai/v1"
});

const SYSTEM_PROMPT = `You are MediAssist, an expert, empathetic, and highly professional AI medical assistant. 
Your goal is to provide users with clear, detailed, and reassuring health information.

Tone Guidelines:
- Professional yet warm and empathetic.
- Avoid robotic or overly brief responses.
- If a situation is urgent, maintain a calm but authoritative tone.

When a user describes symptoms or asks a health question, respond ONLY in the following JSON format:
{
  "symptoms": ["list", "of", "identified", "symptoms"],
  "possibleConditions": ["list", "of", "possible", "conditions"],
  "recommendedDoctorTypes": ["list", "of", "specialist", "types to consult"],
  "urgencyLevel": "low | medium | high | emergency",
  "disclaimer": "A kind reminder that this is for informational purposes only and they should consult a medical professional."
}

IMPORTANT:
- Always respond with valid JSON.
- Never diagnose definitively — always use phrases like "This could be related to..." or "One possibility is...".
- For emergencies, be very clear about seeking immediate help.
- Do not provide prescription names.`;

const sendMessage = async (req, res) => {
  const { message } = req.body;
  const userId = req.user.id; // From protect middleware

  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  try {
    // Fetch or create conversation for THIS user
    let conversation = await Conversation.findOne({ userId });
    if (!conversation) {
      conversation = new Conversation({ userId, messages: [] });
    }

    // Build message history for context (last 10 messages)
    const history = conversation.messages.slice(-10).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    // Call Groq (OpenAI compatible)
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...history,
        { role: 'user', content: message },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const rawResponse = completion.choices[0].message.content;
    let parsedResponse;

    try {
      parsedResponse = JSON.parse(rawResponse);
    } catch {
      parsedResponse = { summary: rawResponse, disclaimer: 'Always consult a qualified doctor.' };
    }

    // Save messages to DB
    conversation.messages.push({ role: 'user', content: message });
    conversation.messages.push({ role: 'assistant', content: rawResponse });
    await conversation.save();

    res.json({
      success: true,
      response: parsedResponse,
    });
  } catch (error) {
    console.error('Chat error detail:', JSON.stringify(error, null, 2));
    console.error('Chat error message:', error.message);
    res.status(500).json({ error: 'Failed to process your request. Please try again.' });
  }
};

const getHistory = async (req, res) => {
  const userId = req.user.id;
  try {
    const conversation = await Conversation.findOne({ userId });
    if (!conversation) {
      return res.json({ messages: [] });
    }
    res.json({ messages: conversation.messages });
  } catch (error) {
    console.error('History fetch error:', error.message);
    res.status(500).json({ error: 'Failed to fetch conversation history.' });
  }
};

const clearHistory = async (req, res) => {
  const userId = req.user.id;
  try {
    await Conversation.deleteOne({ userId });
    res.json({ success: true, message: 'Conversation cleared.' });
  } catch (error) {
    console.error('Clear history error:', error.message);
    res.status(500).json({ error: 'Failed to clear conversation.' });
  }
};

module.exports = { sendMessage, getHistory, clearHistory };
