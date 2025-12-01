import dotenv from "dotenv";
import OpenAI from "openai";
import express from "express";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());


app.use(cors()); // only use this for development

// this would be more secure
// app.use(cors({
//   origin: process.env.FRONTEND_URL || 'http://localhost:5173',
//   methods: ['GET', 'POST'],
//   credentials: true
// }));


const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/generate-workout", async (req, res) => {
  try {
    const userData = req.body;

    const response = await client.responses.create({
      model: "gpt-5",
      input: [
        {
          role: "developer",
          content: `
You are a professional fitness coach AI that generates structured 7-day workout plans based on user data.

Your response MUST be **valid JSON only** — no markdown, no extra text, no explanations.
Each exercise day should include a list of exercises with:
  - "exercise_name": string
  - "reps": string or number (e.g., "3x10" or "12 reps")
  - "muscle_group": main muscle worked
  - "notes": short sentence of coaching tips or form reminders

Top-level JSON format example:
{
  "user_summary": {
    "age": 25,
    "weight_kg": 70,
    "height_cm": 175,
    "experience_level": "beginner",
    "goal": "muscle gain"
  },
  "workout_plan": [
    {
      "day": "Day 1",
      "focus": "Upper Body Strength",
      "exercises": [
        {
          "exercise_name": "Push-ups",
          "reps": "3x12",
          "muscle_group": "Chest, Triceps",
          "notes": "Keep your core tight and back straight."
        }
      ]
    },
    ...
  ]
}

Always provide exactly 7 days (Day 1–Day 7).
          `
        },
        {
          role: "user",
          content: JSON.stringify(userData)
        }
      ]
    });

    const workoutPlan = JSON.parse(response.output_text);
    res.json(workoutPlan);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});