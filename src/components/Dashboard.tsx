import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  calculateTotalEarnings, 
  calculateTotalExpenses, 
  calculateNetProfit,
  calculateTotalMileage,
  calculateTotalTrips,
  calculateAverageEarningsPerTrip,
  calculateFuelEfficiency,
  formatCurrency
} from '../utils/calculations';
import { DollarSign, BarChart2, TrendingUp, Calendar, Activity } from 'lucide-react';
import RecordsList from './RecordsList';
import GoalTracker from './GoalTracker';

const Dashboard: React.FC = () => {
  const { state } = useAppContext();
  const [timeRange, setTimeRange] = useState<'all' | 'week' | 'month'>('week');
  
  // Filter records based on selected time range
  const filteredRecords = state.records.filter(record => {
    const recordDate = new Date(record.date);
    const today = new Date();
    
    if (timeRange === 'week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(today.getDate() - 7);
      return recordDate >= oneWeekAgo;
    } else if (timeRange === 'month') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(today.getMonth() - 1);
      return recordDate >= oneMonthAgo;
    }
    
    return true; // 'all' option
  });

  const totalEarnings = calculateTotalEarnings(filteredRecords);
  const totalExpenses = calculateTotalExpenses(filteredRecords);
  const netProfit = calculateNetProfit(filteredRecords);
  const totalTrips = calculateTotalTrips(filteredRecords);
  const totalMileage = calculateTotalMileage(filteredRecords);
  const avgEarningsPerTrip = calculateAverageEarningsPerTrip(filteredRecords);
  const fuelEfficiency = calculateFuelEfficiency(filteredRecords);

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Time Range Selector */}
      <div className="mb-6">
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg inline-flex">
          <button 
            className={`px-4 py-2 rounded-md ${timeRange === 'week' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
            onClick={() => setTimeRange('week')}
          >
            Semana
          </button>
          <button 
            className={`px-4 py-2 rounded-md ${timeRange === 'month' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
            onClick={() => setTimeRange('month')}
          >
            Mês
          </button>
          <button 
            className={`px-4 py-2 rounded-md ${timeRange === 'all' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
            onClick={() => setTimeRange('all')}
          >
            Todos
          </button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 transition-all hover:shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full mr-4">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Ganhos Totais</p>
              <h3 className="text-xl font-bold">{formatCurrency(totalEarnings, state.settings.currency)}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 transition-all hover:shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-full mr-4">
              <BarChart2 className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Despesas</p>
              <h3 className="text-xl font-bold">{formatCurrency(totalExpenses, state.settings.currency)}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 transition-all hover:shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full mr-4">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Lucro Líquido</p>
              <h3 className="text-xl font-bold">{formatCurrency(netProfit, state.settings.currency)}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 transition-all hover:shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full mr-4">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total de Viagens</p>
              <h3 className="text-xl font-bold">{totalTrips}</h3>
            </div>
          </div>
        </div>
      </div>
      
      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Estatísticas Adicionais</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Quilometragem Total:</span>
              <span className="font-medium">{totalMileage.toFixed(1)} {state.settings.distanceUnit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Média por Viagem:</span>
              <span className="font-medium">{formatCurrency(avgEarningsPerTrip, state.settings.currency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Eficiência Combustível:</span>
              <span className="font-medium">{fuelEfficiency.toFixed(1)} {state.settings.distanceUnit}/{state.settings.fuelUnit}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 md:col-span-2">
          <GoalTracker />
        </div>
      </div>
      
      {/* Recent Records */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Registros Recentes</h3>
        </div>
        <RecordsList records={filteredRecords.slice(0, 5)} showActions={false} />
      </div>
    </div>
  );
};

export default Dashboard;