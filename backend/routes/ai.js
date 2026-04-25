const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const CA = require('../models/CA');

router.post('/chat', async (req, res) => {
  const { message, history } = req.body;
  const apiKey = (process.env.GEMINI_API_KEY || "").trim();
  
  if (!apiKey) {
    return res.status(500).json({ error: "Gemini API key is missing." });
  }

  // Fetch all CAs to give the AI context about real experts on the platform
  let caContext = "";
  try {
    const cas = await CA.find().limit(10);
    caContext = cas.map(c => `- ${c.name} (Specialization: ${c.specialization}, Exp: ${c.experience}, Rating: ${c.rating}, Location: ${c.location})`).join('\n');
  } catch (e) {
    console.error("Error fetching CA context:", e);
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    const modelName = "gemini-flash-latest";
    const model = genAI.getGenerativeModel({ 
      model: modelName,
      systemInstruction: `You are the official AI Assistant for 'KnowYourCA'. 
      
      Here are some of the top-rated Chartered Accountants currently on our platform:
      ${caContext}
      
      When users ask for the 'best' CA or recommendations, you can mention these professionals by name and explain their specializations. Always encourage users to visit the 'Experts' section to see full profiles and more professionals.
      
      Your goal is to help users understand how the platform works, find the right CA for their needs, and provide general financial guidance. Always be professional, helpful, and focused on financial/CA services.`
    });
    
    const validHistory = (history || []).filter(m => m.role === 'user' || m.role === 'model');
    
    const chat = model.startChat({
      history: validHistory,
    });

    const result = await chat.sendMessage(message);
    const text = result.response.text();
    
    console.log(`Gemini response success using ${modelName}`);
    res.json({ text });
  } catch (error) {
    console.error("Gemini Error:", error);
    // If it's a 404, maybe try gemini-pro explicitly if we haven't already
    res.status(500).json({ error: error.message || "Failed to get AI response" });
  }
});

module.exports = router;
