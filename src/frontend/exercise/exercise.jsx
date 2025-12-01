import React, { useState, useEffect } from 'react';
import NavBar from '../Navbar/NavBar';
import axios from 'axios';
import './exercise.css';

const exercise = () => {
    const [selectedDay, setSelectedDay] = useState(null);
    const [workoutPlan, setWorkoutPlan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    // Load user data from localStorage (from the form they filled out)
    const getUserData = () => {
      const savedData = localStorage.getItem('userFormData');
      
      if (savedData) {
        const data = JSON.parse(savedData);
        
        // Convert to format expected by backend
        return {
          age: parseInt(data.age) || 25,
          weight_kg: parseFloat(data.weight) * 0.453592 || 70, // Convert lbs to kg
          height_cm: convertHeightToCm(data.height) || 175,
          experience_level: data.excerciseType?.toLowerCase() || 'intermediate',
          goal: data.goals?.toLowerCase() || 'muscle gain'
        };
      }
      
      // Default data if no user data exists
      return {
        age: 25,
        weight_kg: 70,
        height_cm: 175,
        experience_level: 'intermediate',
        goal: 'muscle gain'
      };
    };

    // Helper function to convert height like "5'10"" to cm
    const convertHeightToCm = (heightStr) => {
      if (!heightStr) return 175;
      
      const match = heightStr.match(/(\d+)'(\d+)"/);
      if (match) {
        const feet = parseInt(match[1]);
        const inches = parseInt(match[2]);
        return Math.round((feet * 12 + inches) * 2.54);
      }
      return 175;
    };
  
    // Generate workout plan on component mount
    // useEffect(() => {
    //   generateWorkoutPlan();
    // }, []);
  
    const generateWorkoutPlan = async () => {
      setLoading(true);
      setError(null);
  
      try {
        const userData = getUserData();
        console.log("Sending user data to backend:", userData);
        
        // Call your backend API on port 5000
        const response = await axios.post('http://localhost:5000/generate-workout', userData);
        
        console.log("Received workout plan:", response.data);
        
        // Format the AI response into the day structure
        const formattedPlan = formatWorkoutPlan(response.data);
        setWorkoutPlan(formattedPlan);
        
      } catch (err) {
        console.error('Error generating workout:', err);
        setError('Failed to generate workout plan. Using default plan.');
        // Use default data if API fails
        setWorkoutPlan(getDefaultPlan());
      } finally {
        setLoading(false);
      }
    };
  
    // Format the AI response into the day structure your UI expects
    const formatWorkoutPlan = (aiResponse) => {
      const workoutPlan = aiResponse.workout_plan || [];
      
      return workoutPlan.map((day, index) => {
        return {
          name: day.day, // "Day 1", "Day 2", etc.
          date: day.focus, // Use focus as the subtitle
          items: day.exercises.map(exercise => ({
            name: exercise.exercise_name,
            details: exercise.reps,
            muscle: exercise.muscle_group,
            instructions: exercise.notes
          }))
        };
      });
    };
  
    const getDefaultPlan = () => [
      { name: 'Day 1', date: 'Upper Body', items: [{ name: 'Push-ups', details: '3 × 12', muscle: 'Chest, Triceps', instructions: 'Keep core tight' }] },
      { name: 'Day 2', date: 'Lower Body', items: [{ name: 'Squats', details: '4 × 10', muscle: 'Legs', instructions: 'Keep back straight' }] },
      { name: 'Day 3', date: 'Back & Biceps', items: [{ name: 'Pull-ups', details: '3 × 8', muscle: 'Back', instructions: 'Full range of motion' }] },
      { name: 'Day 4', date: 'Legs', items: [{ name: 'Lunges', details: '3 × 12', muscle: 'Legs', instructions: 'Knee over ankle' }] },
      { name: 'Day 5', date: 'Core', items: [{ name: 'Planks', details: '3 × 30 sec', muscle: 'Core', instructions: 'Keep hips level' }] },
      { name: 'Day 6', date: 'Cardio', items: [{ name: 'Cardio', details: '30 min', muscle: 'Cardio', instructions: 'Moderate intensity' }] },
      { name: 'Day 7', date: 'Rest', items: [{ name: 'Rest Day', details: 'Recovery', muscle: 'Rest', instructions: 'Active recovery or full rest' }] }
    ];

    if (loading) {
      return (
        <div className="page-wrapper-exercise">
          <NavBar />
          <div className="loading-container">
            <div className="spinner"></div>
            <div className="loading-text">Generating your personalized workout plan...</div>
          </div>
        </div>
      );
    }

    const days = workoutPlan || getDefaultPlan();

    return (
      <div className="planner-wrapper">
        <NavBar />

        <div className="planner-container">
          <a href="/" className="back-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Home
          </a>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h1 className="planner-title">Weekly Exercise Planner</h1>
            <button className="generateWorkout" onClick={generateWorkoutPlan} disabled={loading}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
              </svg>
              {loading ? 'Generating...' : '  Regenerate Plan'}
            </button>
          </div>

          {error && (
            <div style={{
              padding: '1rem',
              background: '#fef2f2',
              border: '1px solid #fca5a5',
              borderRadius: '8px',
              color: '#991b1b',
              marginBottom: '1rem'
            }}>
              {error}
            </div>
          )}

          <div className="days-container">
            {days.map((day, index) => (
              <div
                key={index}
                className={`day-card ${selectedDay === index ? 'active' : ''}`}
                onClick={() => setSelectedDay(index)}
              >
                <div className="day-header">
                  <div className="day-number">{day.name}</div>
                  <h2 className="day-focus">{day.date}</h2>
                </div>

                <div className="day-items">
                  {day.items.map((item, i) => (
                    <div key={i} className="day-item">
                      <h3>{item.name}</h3>
                      <p>{item.details}</p>
                      <p><strong>Muscle:</strong> {item.muscle}</p>
                      {item.instructions && <p className="instructions">{item.instructions}</p>}
                    </div>
                  ))}
                </div>

                <button className="add-item">+ Add Item</button>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          .instructions {
            font-style: italic;
            color: #666;
            font-size: 0.9em;
          }
        `}</style>
      </div>
    );
};

export default exercise;