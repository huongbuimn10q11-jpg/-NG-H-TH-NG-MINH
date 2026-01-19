
import React, { useState, useEffect } from 'react';
import { Player, Question } from '../types';
import { dataProvider } from '../services/mockProvider';

const AdminUI: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newStudentName, setNewStudentName] = useState('');

  useEffect(() => {
    setPlayers(dataProvider.getPlayers());
    setQuestions(dataProvider.getQuestions());
  }, []);

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;
    
    const newPlayer: Player = { 
      id: Date.now().toString(), 
      name: newStudentName.trim(), 
      avatar: `https://picsum.photos/seed/${Date.now()}/100/100`, 
      stars: 0, 
      completedStages: [] 
    };
    dataProvider.savePlayer(newPlayer);
    setPlayers(dataProvider.getPlayers());
    setNewStudentName('');
  };

  const handleClearAllPlayers = () => {
    if (confirm('Bé có chắc chắn muốn xóa TẤT CẢ người chơi không? Hành động này không thể hoàn tác.')) {
      dataProvider.clearPlayers();
      setPlayers([]);
    }
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(questions));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "questions.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = JSON.parse(e.target?.result as string);
          setQuestions(content);
          dataProvider.updateQuestions(content);
          alert('Import thành công!');
        } catch (err) {
          alert('Lỗi định dạng file!');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white rounded-3xl shadow-xl mt-10 mb-24">
      <h1 className="text-3xl font-bold mb-6 text-indigo-600 border-b pb-4 font-funny">Quản lý Giáo viên / Phụ huynh</h1>
      
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold font-funny">Danh sách Học sinh</h2>
          <div className="flex gap-2">
            <button 
              onClick={handleClearAllPlayers}
              className="text-red-500 border border-red-500 px-3 py-1 rounded-lg text-sm hover:bg-red-50 font-bold"
            >
              Xóa tất cả
            </button>
          </div>
        </div>
        
        <form onSubmit={handleAddStudent} className="flex gap-4 mb-6">
          <input 
            type="text" 
            value={newStudentName}
            onChange={(e) => setNewStudentName(e.target.value)}
            placeholder="Nhập tên học sinh mới..."
            className="flex-grow p-3 border-2 border-indigo-100 rounded-xl focus:border-indigo-400 outline-none text-lg"
          />
          <button 
            type="submit"
            className="bg-green-500 text-white px-6 py-2 rounded-xl hover:bg-green-600 font-bold shadow-md transition-colors"
          >
            Thêm học sinh
          </button>
        </form>

        <div className="grid gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {players.map(p => (
            <div key={p.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <img src={p.avatar} className="w-12 h-12 rounded-full border-2 border-indigo-200" alt={p.name} />
                <div>
                  <div className="font-bold text-lg font-funny">{p.name}</div>
                  <div className="text-sm text-gray-500">⭐ {p.stars} sao</div>
                </div>
              </div>
              <button 
                onClick={() => {
                  if (confirm(`Xóa bé ${p.name}?`)) {
                    dataProvider.deletePlayer(p.id);
                    setPlayers(dataProvider.getPlayers());
                  }
                }} 
                className="bg-red-100 text-red-600 px-4 py-2 rounded-xl hover:bg-red-200 font-bold transition-colors"
              >
                Xóa
              </button>
            </div>
          ))}
          {players.length === 0 && (
            <div className="text-center p-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400 italic font-funny text-xl">Chưa có học sinh nào. Hãy thêm tên bé để bắt đầu!</p>
            </div>
          )}
        </div>
      </section>

      <section className="border-t pt-8">
        <h2 className="text-2xl font-semibold mb-4 font-funny">Ngân hàng Câu hỏi</h2>
        <div className="flex gap-4">
          <button onClick={handleExport} className="bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 font-bold shadow-md">Export JSON</button>
          <label className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 cursor-pointer font-bold shadow-md">
            Import JSON
            <input type="file" className="hidden" onChange={handleImport} accept=".json" />
          </label>
        </div>
        <div className="mt-4 text-sm text-gray-500 italic">Tổng số câu hỏi hiện tại: {questions.length}</div>
      </section>
    </div>
  );
};

export default AdminUI;
