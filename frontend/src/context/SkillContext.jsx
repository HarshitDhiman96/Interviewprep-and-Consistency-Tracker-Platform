import React, { createContext, useContext, useState } from 'react';

const SkillContext = createContext();

export function SkillProvider({ children }) {
  // We'll manage selected skills across the app. DSA is mandatory by default.
  const [selectedSkills, setSelectedSkills] = useState(['DSA']);
  
  // Fake mock state for streaks and hours as per design
  const [streak, setStreak] = useState(5);
  const [totalHours, setTotalHours] = useState(42.5);
  
  // Fake Daily Log state, we can add items as per requirements
  const [dailyLogs, setDailyLogs] = useState([]);
  
  // Determine consistency percentage mock
  const [consistency, setConsistency] = useState(87);

  const addDailyLog = (log) => {
    setDailyLogs(prev => [log, ...prev]);
    // Optionally augment total hours locally
    setTotalHours(prev => prev + Number(log.timeSpent));
  };
  
  const value = {
    selectedSkills,
    setSelectedSkills,
    streak,
    setStreak,
    totalHours,
    consistency,
    dailyLogs,
    addDailyLog
  };

  return (
    <SkillContext.Provider value={value}>
      {children}
    </SkillContext.Provider>
  );
}

export function useSkillContext() {
  return useContext(SkillContext);
}
