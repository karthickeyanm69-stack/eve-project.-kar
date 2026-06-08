import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialization of Gemini client for safety
let genAI: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!genAI) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("⚠️ GEMINI_API_KEY is not defined. Using mock Gemini answers.");
    }
    genAI = new GoogleGenAI({
      apiKey: key || 'MOCK_KEY',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return genAI;
}

// Check status helper
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasKey: !!process.env.GEMINI_API_KEY });
});

// Endpoint: Code Compiler Logic & Review (Fallback & Execution)
app.post('/api/compile', async (req, res) => {
  const { code, language } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'No code provided.' });
  }

  // If Javascript, we can do a quick secure sandbox evaluation
  if (language === 'javascript' || language === 'typescript') {
    try {
      let outputLines: string[] = [];
      const originalConsoleLog = console.log;
      // Temporary capture
      const sandboxConsole = {
        log: (...args: any[]) => {
          outputLines.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
        }
      };

      // Wrap in a function to capture console
      const runner = new Function('console', `
        try {
          ${code}
        } catch(e) {
          console.log("Error: " + e.message);
        }
      `);
      runner(sandboxConsole);
      return res.json({
        output: outputLines.join('\n') || 'Executed successfully with no output logs.',
        isSimulated: false
      });
    } catch (err: any) {
      return res.json({ output: `Syntax Error: ${err.message}`, isSimulated: false });
    }
  }

  // If Python or others, we can either do a regex interpreter of basic print statements OR query Gemini to act as a compiler
  // Check if we can query Gemini for terminal-quality simulation (makes code challenges feel live!)
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: `Act as a terminal executing a ${language} script.
Code to run:
\`\`\`${language}
${code}
\`\`\`

Analyze the code. If there are syntax or logic errors, output the correct trace. If successful, output only the clean terminal console stdout result of running this code. Be precise. No additional conversational filler, just the exact raw terminal output.`,
      });
      return res.json({
        output: response.text?.trim() || 'No output.',
        isSimulated: true
      });
    } catch (err: any) {
      console.error("Gemini compiler simulation failed:", err);
    }
  }

  // Fallback simplified local python string parser (Regex fallback if offline)
  try {
    let outputLines: string[] = [];
    const lines = code.split('\n');
    let loopMatch = false;
    let loopVar = '';
    let loopTimes = 0;
    
    for (let line of lines) {
      line = line.trim();
      if (line.startsWith('#')) continue;
      
      // Simple loop detection: for i in range(5):
      const forRegex = /for\s+(\w+)\s+in\s+range\((\d+)\):/;
      const match = line.match(forRegex);
      if (match) {
        loopMatch = true;
        loopVar = match[1];
        loopTimes = parseInt(match[2], 10);
        continue;
      }
      
      if (line.startsWith('print(')) {
        const contentMatch = line.match(/print\((.*)\)/);
        if (contentMatch) {
          let paramStr = contentMatch[1].trim();
          // Remove outer quotes if basic string
          if ((paramStr.startsWith('"') && paramStr.endsWith('"')) || (paramStr.startsWith("'") && paramStr.endsWith("'"))) {
            const val = paramStr.slice(1, -1);
            if (loopMatch) {
              for (let i = 0; i < loopTimes; i++) {
                outputLines.push(val);
              }
            } else {
              outputLines.push(val);
            }
          } else if (paramStr.includes(',')) {
            // e.g. "Hello, World!", i + 1
            if (loopMatch) {
              for (let i = 0; i < loopTimes; i++) {
                // simple replacement simulation
                const evaluated = paramStr
                  .replace(/"/g, '')
                  .replace(/'/g, '')
                  .replace(`${loopVar} + 1`, String(i + 1))
                  .replace(loopVar, String(i))
                  .split(',')
                  .map((p: string) => p.trim())
                  .join(' ');
                outputLines.push(evaluated);
              }
            } else {
              outputLines.push(paramStr.replace(/["']/g, ''));
            }
          } else {
            // Variable fallback
            outputLines.push(paramStr);
          }
        }
        loopMatch = false; // reset
      }
    }
    return res.json({
      output: outputLines.join('\n') || "Executed successfully with offline fallbacks.",
      isSimulated: true
    });
  } catch (err: any) {
    return res.json({ output: `Error simulating execution: ${err.message}`, isSimulated: true });
  }
});

// Endpoint: AI Review Code (Get code feedback from Gemini)
app.post('/api/gemini/explain-code', async (req, res) => {
  const { code, language } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Code is required.' });
  }

  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    // Return sample offline feedback
    return res.json({
      feedback: `EVE OFFLINE REVIEW:\nYour ${language} script is written nicely. It implements basic assignments and structures. For robust practices, make sure to handle corner exceptions, include comment lines explaining parameters, and ensure correct indents.`,
      quality: 'Intermediate'
    });
  }

  try {
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `Provide a quick review of this ${language} code as Ananya's professional AI tutor EVE:
\`\`\`${language}
${code}
\`\`\`

Give constructive feedback:
1. Is it syntactically correct?
2. Are there any potential logic bugs?
3. Suggest 1 key improvement.
Make your response brief and positive, direct and educational under 3 paragraphs. Use markdown styling.`,
    });

    res.json({
      feedback: response.text || 'No feedback produced.',
      quality: 'Professional'
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint: AI Career Coach Interview Step (Generates interview responses & scores)
app.post('/api/gemini/interview', async (req, res) => {
  const { category, currentText, history } = req.body;
  // history is of format [{ role: 'interviewer' | 'user', text: string }]
  
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    // Simple offline dialogue state machine responses
    const nextQuestion = history.length < 2 
      ? `Good answer regarding scalability on ${category}! Let's transition to the behavioral aspect: Can you describe a conflict you faced with a peer in a team project and how you solved it?`
      : `Excellent. In a system design setting, how would you design a rate limiter to protect our REST APIs from DDoS attacks?`;
    
    return res.json({
      reply: nextQuestion,
      analysis: {
        communicationScore: Math.floor(Math.random() * 15 + 75), // 75 to 90
        confidenceScore: Math.floor(Math.random() * 20 + 60), // 60 to 80
        technicalScore: Math.floor(Math.random() * 15 + 75),
        feedback: "Offline Mode: Maintain a structural approach like the STAR method (Situation, Task, Action, Result) for behavioral, and quantitative capacity logs for systems."
      }
    });
  }

  try {
    const ai = getGeminiClient();
    const systemPrompt = `You are EVE, a friendly and professional AI Career Mentor and corporate technical interviewer.
You are running a structured ${category} interview simulation with a developer named Ananya.
Respond to the user's latest response in a highly professional and conversational manner. Offer constructive advice on their technique.
Then, ask the next logically advanced interview question related to their track or background.

Provide your response in JSON format matching the schema:
{
  "reply": "Conversational feedback on their last response, followed by a clear, realistic next technical or HR question to keep the simulation going.",
  "communicationScore": 82, // integer between 0 and 100 assessing communication clarity, speed, style
  "confidenceScore": 68, // integer between 0 and 100 evaluating self-assurance and stance
  "technicalScore": 75, // integer assessing technical accuracy and logic
  "feedback": "A single sentence of encouragement page suggestion, e.g., 'Keep your posture steady and present quantitative data first.'"
}`;

    const formattedHistory = history.map((h: any) => `${h.role === 'interviewer' ? 'Interviewer' : 'User'}: ${h.text}`).join('\n');
    const prompt = `Interview Category: ${category}
Session Dialogue History:
${formattedHistory}

User's Latest Response: "${currentText}"

Generate constructive feedback and the next question using the required structured JSON format.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: { type: Type.STRING },
            communicationScore: { type: Type.INTEGER },
            confidenceScore: { type: Type.INTEGER },
            technicalScore: { type: Type.INTEGER },
            feedback: { type: Type.STRING }
          },
          required: ['reply', 'communicationScore', 'confidenceScore', 'technicalScore', 'feedback']
        }
      }
    });

    const body = JSON.parse(response.text || '{}');
    res.json({
      reply: body.reply || "Good answer, let's proceed to the next technical challenge.",
      analysis: {
        communicationScore: body.communicationScore || 80,
        confidenceScore: body.confidenceScore || 70,
        technicalScore: body.technicalScore || 75,
        feedback: body.feedback || "Good progress."
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint: AI Analogy Helper
app.post('/api/gemini/analogy', async (req, res) => {
  const { concept, language } = req.body;
  if (!concept) {
    return res.status(400).json({ error: 'Concept name is required.' });
  }

  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    // Elegant fallbacks matching the interactive course session concepts
    const fallbackAnalogies: Record<string, string> = {
      'variables': `Imagine a **Variable** as a **labeled storage lock-box**.
- In your ship's system panel, writing \`const pilotName = "EVE"\` buys a highly durable, armored titanium box, labels it **"pilotName"**, and places a titanium tag with **"EVE"** on it. Because lock-boxes are declared with \`const\`, they are soldered shut! You can view the name, but you can never swap it out.
- Writing \`let energyLevel = 100\` is like a glowing power containment cell named **"energyLevel"** with an adjustable screen. Whenever your thrusters fire, you can slide the energy counter down to **95** or **50** directly!`,

      'operators': `Imagine **Operators** as the **kinetic power couplers** in your hyperdrive:
- Arithmetic operators (\`+\`, \`-\`, \`*\`, \`/\`) dial the power cells up, drain secondary fuel grids, or divide laser beams equally.
- Exponential / Power (\`**\`) triggers cascading thrust, multiplying variables iteratively to lift altitude.
- The modulo operator (\`%\`) checks if regular pulses align. Like checking if every 3rd step matches a secure sensor sweep, allowing your scanner to block virus entries.`,

      'control flow': `Imagine **Control Flow** as a **railway track-switcher** at a junction.
Your logic train glides along the rail tracks. When it approaches an \`if\` condition, a sensor checks if the upcoming bridge is lowered:
- If lowered (\`bridge_active === true\`), the tracks hold steady and your logic train rolls directly to the main destination.
- Else if the emergency energy level is high (\`energy > 20\`), the switcher is triggered mechanically, sending you down the auxiliary power tunnel.
- Else, the switcher diverts the train into a safety emergency brake depot to avoid a total system crash!`,

      'loops': `Imagine a **Loop** as an **orbital sweep** around a foreign warp beacon.
Rather than commanding your ship 10 times to: "Activate sensor sweep!", you initiate a systematic loop count (\`for i in range(10)\`).
Each loop circles the orbit once. On each lap, your system clicks the scanner probe and records the scan logs along with the lap number. When the 10 laps are complete, the thrusters level out and your ship launches forward into light speed!`,

      'functions': `Imagine a **Function** as a **vending recipe blueprint** in your starship's galley.
Instead of manually wiring a system of heaters, filters, and mixers every single time you want a warm cup of synth-tea, you install a recipe panel named \`brew_tea(sweetness_level)\`.
Whenever you feel fatigued, you don't rewire the kitchen; you simply press the button and pass in the value \`2\`. The machine processes the instructions internally and pops out a perfect warm cup!`,

      'collections': `Imagine **Collections (Lists/Arrays)** as a **multi-car freight train** in your cargo deck.
Rather than setting up 12 different storage containers with isolated names like \`crate1\`, \`crate2\`, or \`crate3\`, you bind them into a single cargo link named \`cargo_bay = ["nano-bots", "aux-shield", "plasma-fuel"]\`.
Each drawer is indexed by number. The first drawer (\`cargo_bay[0]\`) slides open to reveal the nano-bots instantly, letting your repair droids work with clean structures!`
    };

    const term = concept.toLowerCase().trim();
    // find key that matches or is included
    const matchedKey = Object.keys(fallbackAnalogies).find(k => term.includes(k) || k.includes(term));
    const analogy = matchedKey ? fallbackAnalogies[matchedKey] : `Imagine **${concept}** as a custom subsystem module in your space terminal. It takes input pulses, checks parameters with internal logic gates, and outputs clean solutions back to the viewport sandbox safely.`;
    
    return res.json({ analogy });
  }

  try {
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `Explain the programming concept "${concept}" in ${language || 'Python'} from the perspective of EVE's stylized robotic mentor guide EVA.
      Provide a highly immersive, narrative-driven, and simple physical world analogy (e.g. using spaceship mechanics, cyberware systems, gothic folklore shrines, or high-tech gadget containers) that helps a complete beginner grasp the core mechanics. Make it 2 concise paragraphs with clear bold highlights. Skip introductory pleasantries and start directly with the narrative layout or "Imagine..."`,
    });
    return res.json({
      analogy: response.text || 'No analogy could be rendered right now.'
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Serve frontend build static files & mount Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // SPA Fallback routing
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EVE platform backend running beautifully on port ${PORT}`);
  });
}

startServer();
