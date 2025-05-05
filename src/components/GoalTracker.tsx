import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { calculateGoalProgress, formatCurrency } from '../utils/calculations';
import { GoalType } from '../types';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import GoalForm from './GoalForm';

const GoalTracker: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [editGoal, setEditGoal] = useState<GoalType | undefined>(undefined);
  
  const handleEdit = (goal: GoalType) => {
    setEditGoal(goal);
    setShowForm(true);
  };
  
  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta meta?')) {
      dispatch({ type: 'DELETE_GOAL', payload: id });
    }
  };
  
  const handleCloseForm = () => {
    setShowForm(false);
    setEditGoal(undefined);
  };

  const goalTypeLabels = {
    'earnings': 'Ganhos',
    'trips': 'Viagens',
    'mileage': 'Quilometragem'
  };
  
  const periodLabels = {
    'daily': 'Diária',
    'weekly': 'Semanal',
    'monthly': 'Mensal'
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Metas</h3>
        <button 
          onClick={() => setShowForm(true)}
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          Nova Meta
        </button>
      </div>
      
      {showForm ? (
        <GoalForm goal={editGoal} onClose={handleCloseForm} />
      ) : (
        <div>
          {state.goals.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              Nenhuma meta definida. Clique em "Nova Meta" para começar.
            </div>
          ) : (
            <div className="space-y-4">
              {state.goals.map(goal => {
                const progress = calculateGoalProgress(goal, state.records);
                
                return (
                  <div key={goal.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between mb-2">
                      <h4 className="font-medium">{goal.name}</h4>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEdit(goal)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(goal.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-2">
                      {goalTypeLabels[goal.type]} · {periodLabels[goal.period]} · 
                      {new Date(goal.startDate).toLocaleDateString('pt-BR')} até {new Date(goal.endDate).toLocaleDateString('pt-BR')}
                    </div>
                    
                    <div className="mb-1 flex justify-between text-sm">
                      <div>Progresso:</div>
                      <div>
                        {goal.type === 'earnings' 
                          ? `${formatCurrency(goal.currentValue, state.settings.currency)} / ${formatCurrency(goal.target, state.settings.currency)}`
                          : `${goal.currentValue} / ${goal.target} ${goal.type === 'mileage' ? state.settings.distanceUnit : 'viagens'}`
                        }
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GoalTracker;