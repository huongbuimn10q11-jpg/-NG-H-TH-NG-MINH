
import React from 'react';

interface ClockProps {
  hour: number;
  minute: number;
  onAdjust?: (h: number, m: number) => void;
  interactive?: boolean;
}

const Clock: React.FC<ClockProps> = ({ hour, minute, onAdjust, interactive = false }) => {
  // Requirement: Hour hand points EXACTLY at the number even if minute is 30
  const hourRotation = (hour % 12) * 30; 
  const minuteRotation = minute * 6; 

  const handleHourChange = (delta: number) => {
    if (!onAdjust) return;
    let newHour = (hour + delta + 12) % 12;
    if (newHour === 0) newHour = 12;
    onAdjust(newHour, minute);
  };

  const handleMinuteChange = (delta: number) => {
    if (!onAdjust) return;
    // We only focus on :15 and :30
    const newMinute = minute === 15 ? 30 : 15;
    onAdjust(hour, newMinute);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full border-[12px] border-yellow-400 bg-white shadow-2xl flex items-center justify-center">
        {/* Numbers */}
        {[...Array(12)].map((_, i) => {
          const num = i + 1;
          const angle = (num * 30 - 90) * (Math.PI / 180);
          const x = 50 + 40 * Math.cos(angle);
          const y = 50 + 40 * Math.sin(angle);
          return (
            <div
              key={num}
              className="absolute text-2xl md:text-3xl font-bold text-gray-800 font-funny"
              style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
            >
              {num}
            </div>
          );
        })}

        {/* Hour Hand - RED (Short) */}
        <div
          className="absolute w-3 h-16 md:h-20 bg-red-500 rounded-full origin-bottom transition-transform duration-300"
          style={{ 
            transform: `translateX(-50%) rotate(${hourRotation}deg)`, 
            bottom: '50%',
            left: '50%' 
          }}
        />

        {/* Minute Hand - BLUE (Long) */}
        <div
          className="absolute w-2 h-24 md:h-30 bg-blue-500 rounded-full origin-bottom transition-transform duration-300"
          style={{ 
            transform: `translateX(-50%) rotate(${minuteRotation}deg)`, 
            bottom: '50%',
            left: '50%'
          }}
        />

        {/* Center Point */}
        <div className="absolute w-6 h-6 bg-gray-900 rounded-full z-10 shadow-md" />
      </div>

      {interactive && onAdjust && (
        <div className="flex gap-8 mt-10">
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => handleHourChange(1)}
              className="w-24 h-24 bg-red-500 text-white font-bold rounded-full shadow-xl btn-bounce text-2xl border-b-8 border-red-700 flex items-center justify-center font-funny"
            >
              GIỜ
            </button>
          </div>
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => handleMinuteChange(15)}
              className="w-24 h-24 bg-blue-500 text-white font-bold rounded-full shadow-xl btn-bounce text-2xl border-b-8 border-blue-700 flex items-center justify-center font-funny"
            >
              PHÚT
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clock;
