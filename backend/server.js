import dotenv from "dotenv";
import OpenAI from "openai";
dotenv.config();

const client = new OpenAI(
    {
      apiKey: process.env.OPENAI_API_KEY,
    });

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
          content: JSON.stringify({
            age: 22,
            weight_kg: 65,
            height_cm: 170,
            experience_level: "intermediate",
            goal: "fat loss"
          })
        }
      ]
    });
    
// ✅ Print the pure JSON text
console.log(response.output_text);

// ✅ Parse the JSON if you want to work with it
const workoutPlan = JSON.parse(response.output_text);
console.log(workoutPlan.workout_plan[0].exercises[0]);