import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import GoalTracker from './GoalTracker';
import { Activity } from 'lucide-react';

const Goals: React.FC = () => {
  const { state } = useAppContext();
  const [timeFilter, setTimeFilter] = useState<'all' | 'active' | 'completed'>('active');
  
  // Filter goals based on selected filter
  const filteredGoals = state.goals.filter(goal => {
    if (timeFilter === 'all') return true;
    
    const endDate = new Date(goal.endDate);
    const today = new Date();
    
    return timeFilter === 'active' 
      ? endDate >= today 
      : endDate < today;
  });

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Suas Metas</h1>
        
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            className={`px-4 py-2 text-sm font-medium border border-gray-200 rounded-l-lg 
              ${timeFilter === 'active' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            onClick={() => setTimeFilter('active')}
          >
            Ativas
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium border border-gray-200 
              ${timeFilter === 'completed' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            onClick={() => setTimeFilter('completed')}
          >
            Concluídas
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium border border-gray-200 rounded-r-lg 
              ${timeFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            onClick={() => setTimeFilter('all')}
          >
            Todas
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGoals.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center text-center">
            <Activity className="h-16 w-16 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhuma meta encontrada</h3>
            <p className="text-gray-600">
              {timeFilter === 'active' 
                ? 'Você não tem metas ativas. Crie uma nova meta para acompanhar seu progresso!'
                : timeFilter === 'completed'
                ? 'Você não tem metas concluídas. Continue trabalhando nas suas metas atuais!'
                : 'Você não tem nenhuma meta definida. Crie sua primeira meta!'
              }
            </p>
          </div>
        ) : (
          <div className="col-span-full bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4">
              <GoalTracker />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Goals;