import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { GoalType } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface GoalFormProps {
  goal?: GoalType;
  onClose: () => void;
}

const defaultGoal: Omit<GoalType, 'id'> = {
  name: '',
  target: 0,
  currentValue: 0,
  type: 'earnings',
  period: 'weekly',
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0]
};

const GoalForm: React.FC<GoalFormProps> = ({ goal, onClose }) => {
  const { dispatch, state } = useAppContext();
  const [formData, setFormData] = useState<Omit<GoalType, 'id'>>(
    goal ? {
      name: goal.name,
      target: goal.target,
      currentValue: goal.currentValue,
      type: goal.type,
      period: goal.period,
      startDate: goal.startDate,
      endDate: goal.endDate
    } : defaultGoal
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'type' && (value === 'earnings' || value === 'trips' || value === 'mileage')) {
      setFormData(prev => ({
        ...prev,
        type: value
      }));
    } else if (name === 'period' && (value === 'daily' || value === 'weekly' || value === 'monthly')) {
      setFormData(prev => ({
        ...prev,
        period: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'target' || name === 'currentValue' ? Number(value) : value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (goal) {
      dispatch({
        type: 'UPDATE_GOAL',
        payload: {
          id: goal.id,
          ...formData
        }
      });
    } else {
      dispatch({
        type: 'ADD_GOAL',
        payload: {
          id: uuidv4(),
          ...formData
        }
      });
    }
    
    onClose();
  };

  return (
    <div className="bg-white rounded-lg border p-4">
      <h3 className="text-lg font-semibold mb-4">
        {goal ? 'Editar Meta' : 'Nova Meta'}
      </h3>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Meta
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="earnings">Ganhos</option>
                <option value="trips">Número de Viagens</option>
                <option value="mileage">Quilometragem</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Período
              </label>
              <select
                name="period"
                value={formData.period}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="daily">Diário</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensal</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta Alvo {formData.type === 'earnings' ? `(${state.settings.currency})` : 
                         formData.type === 'mileage' ? `(${state.settings.distanceUnit})` : ''}
            </label>
            <input
              type="number"
              name="target"
              value={formData.target}
              onChange={handleChange}
              min="0"
              step={formData.type === 'earnings' ? '0.01' : '1'}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data Inicial
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data Final
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                min={formData.startDate}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {goal ? 'Atualizar' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GoalForm;