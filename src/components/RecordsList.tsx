import React from 'react';
import { useAppContext } from '../context/AppContext';
import { DailyRecord } from '../types';
import { formatCurrency } from '../utils/calculations';
import { Edit, Trash2 } from 'lucide-react';

interface RecordsListProps {
  records: DailyRecord[];
  showActions?: boolean;
  onEdit?: (record: DailyRecord) => void;
}

const RecordsList: React.FC<RecordsListProps> = ({ 
  records, 
  showActions = true,
  onEdit 
}) => {
  const { dispatch, state } = useAppContext();
  
  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este registro?')) {
      dispatch({ type: 'DELETE_RECORD', payload: id });
    }
  };
  
  const getTotalExpenses = (record: DailyRecord): number => {
    const { fuel, maintenance, food, other } = record.expenses;
    return fuel + maintenance + food + other;
  };

  // Sort records by date (most recent first)
  const sortedRecords = [...records].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (sortedRecords.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        Nenhum registro encontrado.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              KM
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Viagens
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ganhos
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Combustível
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Despesas
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Lucro
            </th>
            {showActions && (
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedRecords.map((record) => {
            const totalExpenses = getTotalExpenses(record);
            const profit = record.earnings - totalExpenses;
            
            return (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(record.date).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {record.mileage} {state.settings.distanceUnit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {record.tripCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-green-600">
                  {formatCurrency(record.earnings, state.settings.currency)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {record.fuelConsumption.liters} {state.settings.fuelUnit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-red-600">
                  {formatCurrency(totalExpenses, state.settings.currency)}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap font-medium ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(profit, state.settings.currency)}
                </td>
                {showActions && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => onEdit?.(record)} 
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(record.id)} 
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RecordsList;