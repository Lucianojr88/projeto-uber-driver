import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import RecordsList from './RecordsList';
import RecordForm from './RecordForm';
import { DailyRecord } from '../types';
import { PlusCircle, Download } from 'lucide-react';

const Records: React.FC = () => {
  const { state } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [editRecord, setEditRecord] = useState<DailyRecord | undefined>(undefined);
  const [filterMonth, setFilterMonth] = useState<string>('');
  
  const handleAddNew = () => {
    setEditRecord(undefined);
    setShowForm(true);
  };
  
  const handleEdit = (record: DailyRecord) => {
    setEditRecord(record);
    setShowForm(true);
  };
  
  const handleCloseForm = () => {
    setShowForm(false);
    setEditRecord(undefined);
  };
  
  const exportToCSV = () => {
    // Filter records if month filter is applied
    const recordsToExport = filterMonth 
      ? state.records.filter(record => record.date.startsWith(filterMonth))
      : state.records;
    
    // Sort records by date
    const sortedRecords = [...recordsToExport].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // Create CSV header
    const headers = [
      'Data',
      'Quilometragem',
      'Viagens',
      'Ganhos',
      'Combustível (Litros)',
      'Combustível (Custo)',
      'Despesa: Manutenção',
      'Despesa: Alimentação',
      'Despesa: Outras',
      'Notas'
    ];
    
    // Create CSV rows
    const rows = sortedRecords.map(record => [
      new Date(record.date).toLocaleDateString('pt-BR'),
      record.mileage,
      record.tripCount,
      record.earnings,
      record.fuelConsumption.liters,
      record.fuelConsumption.cost,
      record.expenses.maintenance,
      record.expenses.food,
      record.expenses.other,
      `"${record.notes.replace(/"/g, '""')}"`
    ]);
    
    // Combine header and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'registros-uber.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Get unique months from records for filter
  const months = [...new Set(state.records.map(record => record.date.substring(0, 7)))].sort();
  
  // Filter records based on selected month
  const filteredRecords = filterMonth
    ? state.records.filter(record => record.date.startsWith(filterMonth))
    : state.records;

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Registros Diários</h1>
        
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 w-full md:w-auto">
          <div className="w-full md:w-auto">
            <select
              value={filterMonth}
              onChange={e => setFilterMonth(e.target.value)}
              className="block w-full md:w-44 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos os Meses</option>
              {months.map(month => {
                const date = new Date(month + '-01');
                const monthName = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
                return (
                  <option key={month} value={month}>
                    {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
                  </option>
                );
              })}
            </select>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={exportToCSV}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Download className="h-5 w-5 mr-2" />
              Exportar
            </button>
            
            <button
              onClick={handleAddNew}
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Novo Registro
            </button>
          </div>
        </div>
      </div>
      
      {showForm ? (
        <div className="mb-6">
          <RecordForm record={editRecord} onClose={handleCloseForm} />
        </div>
      ) : null}
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <RecordsList records={filteredRecords} onEdit={handleEdit} />
      </div>
    </div>
  );
};

export default Records;