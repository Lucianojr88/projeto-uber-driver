import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { DailyRecord } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface RecordFormProps {
  record?: DailyRecord;
  onClose: () => void;
}

const defaultRecord: Omit<DailyRecord, 'id'> = {
  date: new Date().toISOString().split('T')[0],
  mileage: 0,
  tripCount: 0,
  earnings: 0,
  expenses: {
    fuel: 0,
    maintenance: 0,
    food: 0,
    rent: 0,
    other: 0
  },
  fuelConsumption: {
    liters: 0,
    cost: 0
  },
  notes: ''
};

const RecordForm: React.FC<RecordFormProps> = ({ record, onClose }) => {
  const { dispatch, state } = useAppContext();
  const [formData, setFormData] = useState<Omit<DailyRecord, 'id'>>(
    record ? {
      date: record.date,
      mileage: record.mileage,
      tripCount: record.tripCount,
      earnings: record.earnings,
      expenses: { ...record.expenses },
      fuelConsumption: { ...record.fuelConsumption },
      notes: record.notes
    } : defaultRecord
  );

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      expenses: {
        ...prev.expenses,
        fuel: prev.fuelConsumption.cost
      }
    }));
  }, [formData.fuelConsumption.cost]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value === '' ? '' : Number(value)
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'date' || name === 'notes' ? value : Number(value)
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (record) {
      dispatch({
        type: 'UPDATE_RECORD',
        payload: {
          id: record.id,
          ...formData
        }
      });
    } else {
      dispatch({
        type: 'ADD_RECORD',
        payload: {
          id: uuidv4(),
          ...formData
        }
      });
    }
    
    onClose();
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 bg-blue-600 text-white">
        <h2 className="text-lg font-semibold">
          {record ? 'Editar Registro' : 'Novo Registro'}
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="p-4">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quilometragem ({state.settings.distanceUnit})
              </label>
              <input
                type="number"
                name="mileage"
                value={formData.mileage}
                onChange={handleChange}
                min="0"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Viagens
              </label>
              <input
                type="number"
                name="tripCount"
                value={formData.tripCount}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ganhos Totais ({state.settings.currency})
              </label>
              <input
                type="number"
                name="earnings"
                value={formData.earnings}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Combustível</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Litros ({state.settings.fuelUnit})
                </label>
                <input
                  type="number"
                  name="fuelConsumption.liters"
                  value={formData.fuelConsumption.liters}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Custo Total ({state.settings.currency})
                </label>
                <input
                  type="number"
                  name="fuelConsumption.cost"
                  value={formData.fuelConsumption.cost}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Outras Despesas ({state.settings.currency})</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Manutenção
                </label>
                <input
                  type="number"
                  name="expenses.maintenance"
                  value={formData.expenses.maintenance}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alimentação
                </label>
                <input
                  type="number"
                  name="expenses.food"
                  value={formData.expenses.food}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aluguel
                </label>
                <input
                  type="number"
                  name="expenses.rent"
                  value={formData.expenses.rent}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Outras
                </label>
                <input
                  type="number"
                  name="expenses.other"
                  value={formData.expenses.other}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notas
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
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
            {record ? 'Atualizar' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecordForm;