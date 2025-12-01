import fetch from 'node-fetch';

async function testWorkoutPlan() {
  try {
    console.log("🏋️ Generating workout plan...\n");

    const userData = {
      age: 22,
      weight_kg: 65,
      height_cm: 170,
      experience_level: "intermediate",
      goal: "fat loss"
    };

    const response = await fetch('http://localhost:5000/generate-workout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });

    const workoutPlan = await response.json();

    console.log("✅ Workout plan generated successfully!\n");
    console.log("📊 User Summary:");
    console.log(JSON.stringify(workoutPlan.user_summary, null, 2));
    console.log("\n💪 First Exercise:");
    console.log(JSON.stringify(workoutPlan.workout_plan[0].exercises[0], null, 2));

  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

testWorkoutPlan();