const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function listModels() {
  const apiKey = (process.env.GEMINI_API_KEY || "").trim();
  if (!apiKey) {
    console.error("No API Key found in .env");
    return;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  
  try {
    console.log("Checking API key and listing models...");
    // There isn't a direct listModels in the simple SDK, 
    // but we can try to initialize different common ones.
    const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];
    
    for (const m of models) {
      try {
        const model = genAI.getGenerativeModel({ model: m });
        const result = await model.generateContent("test");
        if (result.response) {
          console.log(`✅ Model ${m} is WORKING!`);
        }
      } catch (e) {
        console.log(`❌ Model ${m} failed: ${e.message}`);
      }
    }
  } catch (err) {
    console.error("General Error:", err.message);
  }
}

listModels();
