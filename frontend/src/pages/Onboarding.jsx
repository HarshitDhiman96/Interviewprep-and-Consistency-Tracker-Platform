import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSkillContext } from '../context/SkillContext';

const availableSkills = [
  'DSA', 
  'Web Development', 
  'AI/ML', 
  'System Design', 
  'Core CS'
];

export default function Onboarding() {
  const { selectedSkills, setSelectedSkills } = useSkillContext();
  const navigate = useNavigate();

  const toggleSkill = (skill) => {
    if (skill === 'DSA') return; // Fixed
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleLaunch = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen pt-24 px-6 relative z-10 flex flex-col items-center justify-center" style={{ backgroundColor: 'transparent' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="glass p-10 md:p-14 rounded-[32px] w-full max-w-2xl text-center relative overflow-hidden"
        style={{ 
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
          border: 'none' // Adhering to no 1px solid border rule
        }}
      >
        {/* Header */}
        <h2 
          className="text-4xl md:text-5xl font-black mb-4 tracking-tight"
          style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--on-surface)' }}
        >
          Define Your Path
        </h2>
        <p 
          className="text-gray-400 mb-10 text-lg"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          Select the core skills you want to focus on tracking. 
          <span className="block mt-1" style={{ color: '#84adff' }}>DSA is required for foundational consistency.</span>
        </p>

        {/* Grid Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {availableSkills.map((skill, index) => {
            const isSelected = selectedSkills.includes(skill);
            const isMandatory = skill === 'DSA';

            return (
              <motion.button
                key={skill}
                whileHover={!isMandatory ? { scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.1)' } : {}}
                whileTap={!isMandatory ? { scale: 0.98 } : {}}
                onClick={() => toggleSkill(skill)}
                className="py-4 px-6 rounded-2xl transition-all duration-300 relative group"
                style={{ 
                  background: isSelected 
                    ? (isMandatory ? 'rgba(132, 173, 255, 0.15)' : 'rgba(132, 173, 255, 0.1)') 
                    : 'rgba(255, 255, 255, 0.02)',
                  border: isSelected ? '1px solid rgba(132, 173, 255, 0.3)' : '1px solid transparent', // Slight ghost border for active state using primary blue token
                  color: isSelected ? '#84adff' : '#a0a0a0',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600
                }}
              >
                {skill}
                {isMandatory && (
                  <span 
                    className="absolute top-2 right-2 text-[10px] uppercase tracking-wider font-bold"
                    style={{ color: '#84adff', opacity: 0.7 }}
                  >
                    Required
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Launch Dashboard Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLaunch}
          className="btn-primary w-full py-4 text-lg font-bold rounded-xl relative overflow-hidden"
          style={{ 
            fontFamily: 'Manrope, sans-serif',
            background: 'linear-gradient(135deg, #84adff 0%, #6c9fff 100%)',
            color: '#002d64',
            border: 'none',
            boxShadow: '0 0 20px rgba(132, 173, 255, 0.3)'
          }}
        >
          <span className="relative z-10">Launch Dashboard</span>
          <div className="absolute inset-0 bg-white opacity-0 hover:opacity-20 transition-opacity duration-300" />
        </motion.button>

      </motion.div>
    </div>
  );
}
