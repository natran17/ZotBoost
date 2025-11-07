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
        return JSON.parse(savedData);
      }
      // Default data if no user data exists
      return {
        name: 'User',
        age: 25,
        gender: 'Male',
        weight: '180',
        height: '5\'10"',
        goals: 'Muscle Gain',
        excerciseType: 'Intermediate'
      };
    };
  
    // Generate workout plan on component mount
    useEffect(() => {
      generateWorkoutPlan();
    }, []);
  
    const generateWorkoutPlan = async () => {
      setLoading(true);
      setError(null);
  
      try {
        const userData = getUserData();
        console.log("Loaded user data from localStorage:", userData);

        
        // Call your backend API
        const response = await axios.post('http://localhost:5055/api/generate-workout', userData);
        
        if (response.data.success) {
          // Convert the workout plan to the format needed for the UI
          const formattedPlan = formatWorkoutPlan(response.data.workoutPlan);
          setWorkoutPlan(formattedPlan);
        }
      } catch (err) {
        console.error('Error generating workout:', err);
        setError('Failed to generate workout plan. Using default plan.');
        // Use default data if API fails
        setWorkoutPlan(getDefaultPlan());
      } finally {
        setLoading(false);
      }
    };
  
    // Format the AI response into the day structure
    const formatWorkoutPlan = (aiPlan) => {
      const dayMapping = {
        monday: { name: 'Monday', date: 'Week 1' },
        tuesday: { name: 'Tuesday', date: 'Week 1' },
        wednesday: { name: 'Wednesday', date: 'Week 1' },
        thursday: { name: 'Thursday', date: 'Week 1' },
        friday: { name: 'Friday', date: 'Week 1' },
        saturday: { name: 'Saturday', date: 'Week 1' },
        sunday: { name: 'Sunday', date: 'Week 1' }
      };
  
      return Object.keys(dayMapping).map(dayKey => {
        const exercises = aiPlan[dayKey] || [];
        return {
          name: dayMapping[dayKey].name,
          date: dayMapping[dayKey].date,
          items: exercises.map(ex => ({
            name: ex.name,
            details: `${ex.sets} × ${ex.reps}`,
            muscle: ex.muscle,
            equipment: ex.equipment,
            instructions: ex.instructions
          }))
        };
      });
    };
  
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
      const getDefaultPlan = () => [
        { name: 'Monday', date: 'Week 1', items: [{ name: 'Push-ups', details: '3 sets × 12 reps', muscle: 'chest' }] },
        { name: 'Tuesday', date: 'Week 1', items: [{ name: 'Squats', details: '4 sets × 10 reps', muscle: 'legs' }] },
        { name: 'Wednesday', date: 'Week 1', items: [{ name: 'Pull-ups', details: '3 sets × 8 reps', muscle: 'back' }] },
        { name: 'Thursday', date: 'Week 1', items: [{ name: 'Lunges', details: '3 sets × 12 reps', muscle: 'legs' }] },
        { name: 'Friday', date: 'Week 1', items: [{ name: 'Planks', details: '3 sets × 30 sec', muscle: 'core' }] },
        { name: 'Saturday', date: 'Week 1', items: [{ name: 'Cardio', details: '30 min', muscle: 'cardio' }] },
        { name: 'Sunday', date: 'Week 1', items: [{ name: 'Rest Day', details: 'Recovery', muscle: 'rest' }] }
      ];

      const days = workoutPlan || getDefaultPlan()
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
        <button className="generateWorkout" onClick={generateWorkoutPlan}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
          </svg>
          Regenerate Plan
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
              <h2>{day.name}</h2>
              <p>{day.date}</p>
            </div>

            <div className="day-items">
            {day.items.map((item, i) => (
              <div key={i} className="day-item">
                <h3>{item.name}</h3>
                <p>{item.details}</p>
                <p><strong>Muscle:</strong> {item.muscle}</p>
                {item.instructions && <p>{item.instructions}</p>}
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
    `}</style>
  </div>

  );
};

export default exercise;