import axios from 'axios';

// Sample user data
const testUserData = {
  name: 'John Doe',
  age: 25,
  gender: 'Male',
  weight: '180',
  height: '5\'10"',
  goals: 'Muscle Gain',
  excerciseType: 'Intermediate'
};

console.log('🧪 Testing AI Exercise Recommender Backend\n');
console.log('=' .repeat(60));
console.log('\n📝 Test User Profile:');
console.log(JSON.stringify(testUserData, null, 2));
console.log('\n' + '='.repeat(60));

// First check if server is running
console.log('\n🔍 Checking server health...');

// Get PORT from environment
import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT || 5000;
const API_URL = `http://localhost:${PORT}`;

console.log(`   Connecting to: ${API_URL}`);

try {
  const healthCheck = await axios.get(`${API_URL}/api/health`);
  console.log('✅ Server is running!');
  if (healthCheck.data.apis) {
    console.log('   OpenAI API:', healthCheck.data.apis.openai ? '✅' : '❌');
    console.log('   Exercise API:', healthCheck.data.apis.exercises ? '✅' : '❌');
  }
} catch (error) {
  console.error('❌ Server is not running!');
  console.error(`   Please start the server on port ${PORT}: node server.js`);
  process.exit(1);
}

console.log('\n⏳ Step 1: AI is choosing exercises...');
console.log('⏳ Step 2: Fetching exercise details from API...');
console.log('\n⏱️  This may take 30-60 seconds...\n');

// Test the backend
try {
  const response = await axios.post(`${API_URL}/api/generate-workout`, testUserData);
  
  console.log('✅ SUCCESS! Backend is working!\n');
  console.log('=' .repeat(60));
  
  const plan = response.data.workoutPlan;
  const metadata = response.data.metadata;
  
  console.log('\n📊 Workout Plan Summary:');
  console.log(`  Total Days: ${metadata.totalDays}`);
  console.log(`  Total Exercises: ${metadata.totalExercises}`);
  console.log(`  Generated: ${new Date(metadata.generatedAt).toLocaleString()}`);
  
  console.log('\n' + '='.repeat(60));
  console.log('\n📅 WEEKLY WORKOUT PLAN:\n');
  
  Object.keys(plan).forEach(day => {
    console.log(`\n🗓️  ${day.toUpperCase()}`);
    console.log('-'.repeat(60));
    
    plan[day].forEach((exercise, index) => {
      console.log(`\n  ${index + 1}. ${exercise.name}`);
      console.log(`     💪 Muscle: ${exercise.muscle}`);
      console.log(`     🎯 Sets: ${exercise.sets} | Reps: ${exercise.reps}`);
      console.log(`     📈 Difficulty: ${exercise.difficulty || 'N/A'}`);
      console.log(`     🏋️  Equipment: ${exercise.equipment || 'N/A'}`);
      console.log(`     ℹ️  Type: ${exercise.type || 'N/A'}`);
      
      if (exercise.instructions) {
        const shortInstructions = exercise.instructions.substring(0, 100);
        console.log(`     📝 Instructions: ${shortInstructions}...`);
      }
    });
  });
  
  console.log('\n' + '='.repeat(60));
  console.log('\n✨ Test completed successfully!');
  console.log('\n💡 What happened:');
  console.log('   1. ✅ AI analyzed user data');
  console.log('   2. ✅ AI selected appropriate exercises');
  console.log('   3. ✅ Exercise API enriched with details');
  console.log('   4. ✅ Complete workout plan generated');
  
  console.log('\n📁 Full response saved to test-output.json');
  
  // Save to file for inspection
  const fs = await import('fs');
  fs.writeFileSync(
    'test-output.json', 
    JSON.stringify(response.data, null, 2)
  );
  
} catch (error) {
  console.error('\n❌ ERROR! Backend test failed:\n');
  console.error('=' .repeat(60));
  
  if (error.response) {
    console.error('\n📛 Server Error Response:');
    console.error(`   Status: ${error.response.status}`);
    console.error(`   Error: ${JSON.stringify(error.response.data, null, 2)}`);
    
    console.error('\n💡 Common Issues:');
    console.error('   - Invalid OpenAI API key');
    console.error('   - Invalid Exercise API key');
    console.error('   - API rate limit exceeded');
    console.error('   - Check server.js console for detailed errors');
  } else if (error.request) {
    console.error('\n🔌 No response received from server');
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Is the server running? Run: node server.js');
    console.error('   2. Check if port 5000 is available');
    console.error('   3. Verify .env file has API keys');
  } else {
    console.error('\n🚨 Request Error:');
    console.error(`   ${error.message}`);
  }
  
  console.error('\n' + '='.repeat(60));
  process.exit(1);
}