
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Player, Question } from '../types';
import { dataProvider } from '../services/mockProvider';
import Clock from './Clock';
import { speakText } from '../services/geminiService';

const MatchingBoard: React.FC<{ 
  question: Question, 
  onComplete: () => void, 
  onFail: () => void 
}> = ({ question, onComplete, onFail }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [connections, setConnections] = useState<{from: string, to: string}[]>([]);
  const leftItems = question.options?.filter(o => o.type === 'analog') || [];
  const rightItems = question.options?.filter(o => o.type === 'digital') || [];
  
  const handleItemClick = (id: string, side: 'left' | 'right') => {
    // If already connected, do nothing
    if (connections.some(c => c.from === id || c.to === id)) return;

    if (!selected) {
      setSelected(id);
      return;
    }

    // Checking if we clicked the same side
    const isSelectedLeft = leftItems.some(item => item.id === selected);
    const isClickedLeft = side === 'left';

    if (isSelectedLeft === isClickedLeft) {
      setSelected(id);
      return;
    }

    // Logic for connecting
    const leftId = isSelectedLeft ? selected : id;
    const rightId = isSelectedLeft ? id : selected;

    const leftItem = leftItems.find(i => i.id === leftId);
    if (leftItem && leftItem.pairId === rightId) {
      const newConnections = [...connections, { from: leftId, to: rightId }];
      setConnections(newConnections);
      setSelected(null);
      speakText('Đúng rồi!');
      if (newConnections.length === leftItems.length) {
        setTimeout(onComplete, 1000);
      }
    } else {
      setSelected(null);
      onFail();
    }
  };

  return (
    <div className="relative w-full max-w-4xl flex justify-between gap-20 p-10 bg-indigo-50 rounded-[3rem] border-4 border-indigo-200">
      {/* Visual Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ overflow: 'visible' }}>
        {connections.map((conn, idx) => {
           const fromEl = document.getElementById(conn.from);
           const toEl = document.getElementById(conn.to);
           const boardEl = document.getElementById('matching-board');
           if (!fromEl || !toEl || !boardEl) return null;
           
           const boardRect = boardEl.getBoundingClientRect();
           const fromRect = fromEl.getBoundingClientRect();
           const toRect = toEl.getBoundingClientRect();

           const x1 = fromRect.right - boardRect.left;
           const y1 = fromRect.top + fromRect.height/2 - boardRect.top;
           const x2 = toRect.left - boardRect.left;
           const y2 = toRect.top + toRect.height/2 - boardRect.top;

           return (
             <line key={idx} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#6366f1" strokeWidth="8" strokeLinecap="round" strokeDasharray="1, 2" />
           );
        })}
      </svg>

      <div id="matching-board" className="w-full flex justify-between">
        {/* Left Column (Analog) */}
        <div className="flex flex-col gap-8">
          {leftItems.map(item => (
            <button
              key={item.id}
              id={item.id}
              onClick={() => handleItemClick(item.id, 'left')}
              className={`p-4 bg-white rounded-[2rem] shadow-xl border-4 transition-all btn-bounce ${
                selected === item.id ? 'border-yellow-400 scale-110' : 
                connections.some(c => c.from === item.id) ? 'border-green-400 opacity-60' : 'border-white'
              }`}
            >
              <div className="scale-50 origin-center -m-16">
                 <Clock hour={item.hour} minute={item.minute} />
              </div>
            </button>
          ))}
        </div>

        {/* Right Column (Digital) */}
        <div className="flex flex-col gap-8">
          {rightItems.map(item => (
            <button
              key={item.id}
              id={item.id}
              onClick={() => handleItemClick(item.id, 'right')}
              className={`px-10 py-8 bg-white rounded-[2rem] shadow-xl border-4 transition-all btn-bounce text-4xl font-bold font-sans ${
                selected === item.id ? 'border-yellow-400 scale-110' : 
                connections.some(c => c.to === item.id) ? 'border-green-400 opacity-60' : 'border-indigo-100'
              }`}
            >
              {item.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const PlayerUI: React.FC = () => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [stage, setStage] = useState<number | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
  const [userClock, setUserClock] = useState({ hour: 12, minute: 0 });
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    setAllPlayers(dataProvider.getPlayers());
  }, []);

  const startStage = (stageId: number) => {
    const questions = dataProvider.getQuestions().filter(q => q.stageId === stageId);
    setStage(stageId);
    setQuestionIndex(0);
    setCurrentQuestion(questions[0]);
    setUserClock({ hour: 12, minute: 0 });
    setFeedback({ type: null, message: '' });
    speakText(questions[0].questionText);
  };

  const handleNext = useCallback(() => {
    const questions = dataProvider.getQuestions().filter(q => q.stageId === stage);
    const nextIdx = questionIndex + 1;
    if (nextIdx < questions.length) {
      setQuestionIndex(nextIdx);
      setCurrentQuestion(questions[nextIdx]);
      setFeedback({ type: null, message: '' });
      setUserClock({ hour: 12, minute: 0 });
      speakText(questions[nextIdx].questionText);
    } else {
      if (selectedPlayer) {
        const updated = { ...selectedPlayer, stars: selectedPlayer.stars + 5, completedStages: [...selectedPlayer.completedStages, stage!.toString()] };
        dataProvider.savePlayer(updated);
        setSelectedPlayer(updated);
        setAllPlayers(dataProvider.getPlayers());
      }
      
      if (stage! < 3) {
          setTimeout(() => startStage(stage! + 1), 1000);
      } else {
          speakText("Tuyệt vời! Bé đã hoàn thành tất cả các chặng rồi!");
          setStage(null);
      }
    }
  }, [stage, questionIndex, selectedPlayer]);

  const checkAnswer = (answer: any) => {
    if (!currentQuestion) return;

    let isCorrect = false;
    if (currentQuestion.type === 'clock-adjust') {
        isCorrect = answer.hour === currentQuestion.correctAnswer.hour && answer.minute === currentQuestion.correctAnswer.minute;
    } else if (currentQuestion.type === 'select' || currentQuestion.type === 'activity' || currentQuestion.type === 'match') {
        isCorrect = answer === currentQuestion.correctAnswer;
    }

    if (isCorrect) {
      setFeedback({ type: 'success', message: 'Đúng rồi!' });
      speakText('Đúng rồi!');
      setTimeout(() => handleNext(), 1500);
    } else {
      setFeedback({ type: 'error', message: 'Chưa chính xác' });
      speakText('Chưa chính xác. Bé thử lại nhé!');
    }
  };

  const handleCreateNewPlayer = () => {
    if (!newName.trim()) return;
    const newPlayer: Player = { 
      id: Date.now().toString(), 
      name: newName.trim(), 
      avatar: `https://picsum.photos/seed/${Date.now()}/100/100`, 
      stars: 0, 
      completedStages: [] 
    };
    dataProvider.savePlayer(newPlayer);
    setAllPlayers(dataProvider.getPlayers());
    setSelectedPlayer(newPlayer);
    setIsAddingNew(false);
    setNewName('');
    speakText(`Chào mừng bé ${newPlayer.name} đến với trò chơi học xem giờ!`);
  };

  if (!selectedPlayer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
        <h2 className="text-4xl font-bold mb-10 text-pink-600 font-funny">Bé là ai thế nhỉ?</h2>
        
        {isAddingNew ? (
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-4 border-pink-300 w-full max-w-lg text-center">
            <h3 className="text-2xl font-bold mb-6 text-indigo-600 font-funny">Nhập tên của bé vào đây nhé:</h3>
            <input 
              type="text"
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Tên của bé là..."
              className="w-full p-4 text-2xl border-4 border-indigo-100 rounded-2xl mb-8 outline-none focus:border-indigo-400 font-funny text-center"
            />
            <div className="flex gap-4">
              <button 
                onClick={() => setIsAddingNew(false)}
                className="flex-1 py-4 bg-gray-200 text-gray-600 rounded-2xl font-bold text-xl hover:bg-gray-300 btn-bounce font-funny"
              >
                Quay lại
              </button>
              <button 
                onClick={handleCreateNewPlayer}
                className="flex-1 py-4 bg-pink-500 text-white rounded-2xl font-bold text-xl shadow-lg hover:bg-pink-600 btn-bounce font-funny border-b-8 border-pink-700"
              >
                Xong rồi!
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-8 justify-center">
            {allPlayers.map(p => (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedPlayer(p);
                  speakText(`Chào mừng bé ${p.name} đến với trò chơi học xem giờ!`);
                }}
                className="flex flex-col items-center gap-2 p-6 bg-white rounded-3xl shadow-lg border-4 border-transparent hover:border-pink-400 transition-all btn-bounce"
              >
                <img src={p.avatar} className="w-24 h-24 rounded-full border-4 border-yellow-200" alt={p.name} />
                <span className="text-2xl font-bold text-gray-700 font-funny">{p.name}</span>
                <span className="text-orange-500 font-bold text-xl">⭐ {p.stars}</span>
              </button>
            ))}
            
            <button
              onClick={() => setIsAddingNew(true)}
              className="flex flex-col items-center justify-center gap-2 p-6 bg-indigo-50 rounded-3xl shadow-lg border-4 border-dashed border-indigo-300 hover:border-indigo-500 transition-all btn-bounce w-36 h-48"
            >
              <span className="text-5xl text-indigo-400">➕</span>
              <span className="text-xl font-bold text-indigo-500 font-funny">Bé mới</span>
            </button>
          </div>
        )}

        {!isAddingNew && (
          <div className="mt-16 w-full max-w-md bg-white p-8 rounded-[2rem] shadow-2xl border-4 border-yellow-300">
              <h3 className="text-2xl font-bold mb-6 text-center text-indigo-500 font-funny">🏆 Bảng Vinh Danh Top 3</h3>
              <div className="space-y-4">
                  {allPlayers.sort((a,b) => b.stars - a.stars).slice(0, 3).map((p, idx) => (
                      <div key={p.id} className="flex items-center justify-between p-3 bg-indigo-50 rounded-2xl border-2 border-indigo-100">
                          <div className="flex items-center gap-4">
                              <span className="text-3xl">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}</span>
                              <span className="font-bold text-lg font-funny">{p.name}</span>
                          </div>
                          <span className="font-bold text-orange-600 text-xl">{p.stars} sao</span>
                      </div>
                  ))}
                  {allPlayers.length === 0 && <p className="text-gray-400 italic text-center font-funny">Hãy thêm tên bé để bắt đầu chơi nhé!</p>}
              </div>
          </div>
        )}
      </div>
    );
  }

  if (stage === null) {
    return (
      <div className="flex flex-col items-center p-8">
        <div className="flex justify-between w-full mb-12">
            <button onClick={() => setSelectedPlayer(null)} className="text-pink-500 font-bold text-xl font-funny">← Quay lại</button>
            <div className="bg-white px-6 py-3 rounded-full shadow-lg font-bold text-pink-500 border-2 border-pink-200 text-xl font-funny">Chào bé {selectedPlayer.name}! 👋</div>
        </div>
        <h2 className="text-5xl font-bold mb-16 text-indigo-600 font-funny text-center">Bé muốn chơi chặng mấy?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-5xl">
          {[1, 2, 3].map(s => (
            <button
              key={s}
              onClick={() => startStage(s)}
              className={`p-12 rounded-[3rem] shadow-2xl flex flex-col items-center gap-6 border-b-[12px] transition-all btn-bounce ${
                s === 1 ? 'bg-blue-100 border-blue-500 text-blue-700' :
                s === 2 ? 'bg-green-100 border-green-500 text-green-700' :
                'bg-orange-100 border-orange-500 text-orange-700'
              }`}
            >
              <span className="text-8xl">{s === 1 ? '⏰' : s === 2 ? '🔢' : '🌟'}</span>
              <span className="text-3xl font-bold font-funny">Chặng {s}</span>
              <span className="text-lg font-medium opacity-80 font-funny">
                {s === 1 ? 'Đồng hồ kim' : s === 2 ? 'Đồng hồ số' : 'Vận dụng'}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 flex flex-col items-center pb-24">
      {/* Progress */}
      <div className="w-full flex justify-between items-center mb-10 bg-white p-6 rounded-[2rem] shadow-xl border-2 border-indigo-100">
        <button onClick={() => setStage(null)} className="text-indigo-500 font-bold text-xl font-funny">← Thoát</button>
        <div className="flex gap-3">
            {[...Array(5)].map((_, i) => (
                <div key={i} className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-md ${i < questionIndex ? 'bg-green-500 text-white' : i === questionIndex ? 'bg-yellow-400 text-white animate-pulse scale-110' : 'bg-gray-200 text-gray-400'}`}>
                    {i + 1}
                </div>
            ))}
        </div>
        <div className="text-orange-500 font-bold text-2xl flex items-center gap-2 font-funny">⭐ {selectedPlayer.stars}</div>
      </div>

      {/* Guide Character */}
      <div className="flex items-center gap-6 mb-12 w-full max-w-3xl">
        <div className="w-28 h-28 bg-pink-100 rounded-full flex-shrink-0 border-4 border-white shadow-xl overflow-hidden animate-bounce">
            <img src="https://picsum.photos/id/1025/200/200" alt="Guide" className="w-full h-full object-cover" />
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl relative border-4 border-pink-200 flex-grow">
            <div className="absolute left-[-15px] top-10 w-0 h-0 border-t-[15px] border-t-transparent border-b-[15px] border-b-transparent border-r-[20px] border-r-white"></div>
            <p className="text-3xl font-bold text-gray-700 font-funny leading-relaxed">{currentQuestion?.questionText}</p>
            <button onClick={() => speakText(currentQuestion?.questionText || '')} className="mt-4 text-indigo-500 text-lg font-bold flex items-center gap-2 hover:scale-105 transition-transform font-funny">
                <span className="text-2xl">🔊</span> Nghe lại câu hỏi
            </button>
        </div>
      </div>

      <div className="w-full bg-white rounded-[4rem] shadow-2xl p-12 flex flex-col items-center min-h-[500px] border-4 border-yellow-100">
        
        {currentQuestion?.type === 'clock-adjust' && (
          <div className="flex flex-col items-center w-full">
            <Clock
              hour={userClock.hour}
              minute={userClock.minute}
              interactive={true}
              onAdjust={(h, m) => {
                setUserClock({ hour: h, minute: m });
                setFeedback({ type: null, message: '' });
              }}
            />
            <button
              onClick={() => checkAnswer(userClock)}
              className="mt-12 px-16 py-6 bg-green-500 text-white text-3xl font-bold rounded-[2rem] shadow-2xl hover:bg-green-600 btn-bounce border-b-[12px] border-green-700 font-funny"
            >
              KIỂM TRA
            </button>
            {feedback.type === 'success' && (
                <div className="mt-6 text-4xl font-bold text-green-500 font-funny">Đáp án: {currentQuestion.hour}:{currentQuestion.minute}</div>
            )}
          </div>
        )}

        {currentQuestion?.type === 'match' && (
           <MatchingBoard 
             question={currentQuestion} 
             onComplete={handleNext} 
             onFail={() => {
               setFeedback({ type: 'error', message: 'Chưa chính xác' });
               speakText('Chưa chính xác. Bé hãy thử lại nhé!');
             }} 
           />
        )}

        {currentQuestion?.type !== 'clock-adjust' && currentQuestion?.type !== 'match' && (
            <div className="mb-10 w-full flex justify-center">
                 {currentQuestion?.type !== 'activity' && (
                     <Clock hour={currentQuestion?.hour || 12} minute={currentQuestion?.minute || 0} />
                 )}
                 {currentQuestion?.type === 'activity' && currentQuestion.imageUrl && (
                    <img src={currentQuestion.imageUrl} className="w-full max-w-xl h-64 object-cover rounded-[3rem] border-8 border-yellow-200 shadow-xl" alt="Activity" />
                 )}
            </div>
        )}

        {(currentQuestion?.type === 'select' || currentQuestion?.type === 'activity') && (
          <div className="w-full max-w-4xl">
            {/* Chặng 2 hoặc các câu có tùy chọn đồng hồ kim */}
            {currentQuestion.options?.[0]?.hour !== undefined ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {currentQuestion.options.map((opt: any, idx: number) => (
                        <button key={idx} onClick={() => checkAnswer(idx)} className="p-6 bg-white border-8 border-blue-100 rounded-[3rem] hover:border-blue-400 btn-bounce transition-all flex flex-col items-center shadow-lg">
                            <div className="scale-75 origin-center">
                              <Clock hour={opt.hour} minute={opt.minute} />
                            </div>
                        </button>
                    ))}
                </div>
            ) : (
                /* Regular text options with Speaker for Stage 1 Q3 & Q5 */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                    {currentQuestion.options?.map((opt: any, idx: number) => (
                        <div key={idx} className="relative group">
                          <button
                            onClick={() => checkAnswer(typeof opt === 'string' ? opt : idx)}
                            className={`w-full py-12 px-8 bg-indigo-50 border-[6px] border-indigo-200 rounded-[2.5rem] text-4xl font-bold text-indigo-700 hover:bg-indigo-100 btn-bounce transition-all shadow-xl font-funny`}
                          >
                            {typeof opt === 'string' ? opt : `Đáp án ${idx + 1}`}
                          </button>
                          
                          {/* Speaker icon for reading answers in Chặng 1 Q3 & Q5 */}
                          {currentQuestion.stageId === 1 && (currentQuestion.id === 's1q3' || currentQuestion.id === 's1q5') && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                speakText(opt);
                              }}
                              className="absolute top-2 right-2 w-12 h-12 bg-white rounded-full shadow-md border-2 border-indigo-100 flex items-center justify-center text-2xl hover:bg-yellow-100 transition-colors"
                              title="Nghe đáp án"
                            >
                              🔊
                            </button>
                          )}
                        </div>
                    ))}
                </div>
            )}
          </div>
        )}

        {feedback.type && (
          <div className={`mt-10 px-12 py-6 rounded-[2rem] text-4xl font-bold animate-pulse shadow-xl flex items-center gap-4 font-funny ${feedback.type === 'success' ? 'bg-green-100 text-green-600 border-4 border-green-300' : 'bg-red-100 text-red-600 border-4 border-red-300'}`}>
            <span className="text-5xl">{feedback.type === 'success' ? '🌟' : '❌'}</span>
            {feedback.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerUI;
