import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [settings, setSettings] = useState({
    currency: state.settings.currency,
    distanceUnit: state.settings.distanceUnit,
    fuelUnit: state.settings.fuelUnit
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: settings
    });
    alert('Configurações salvas com sucesso!');
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Configurações</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b bg-blue-50">
          <div className="flex items-center">
            <SettingsIcon className="h-5 w-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold">Preferências do Aplicativo</h2>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Moeda
              </label>
              <select
                name="currency"
                value={settings.currency}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="R$">Real (R$)</option>
                <option value="$">Dólar ($)</option>
                <option value="€">Euro (€)</option>
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Moeda utilizada para exibir valores monetários.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unidade de Distância
              </label>
              <select
                name="distanceUnit"
                value={settings.distanceUnit}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="km">Quilômetros (km)</option>
                <option value="mi">Milhas (mi)</option>
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Unidade utilizada para medir distâncias.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unidade de Combustível
              </label>
              <select
                name="fuelUnit"
                value={settings.fuelUnit}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="l">Litros (l)</option>
                <option value="gal">Galões (gal)</option>
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Unidade utilizada para medir volume de combustível.
              </p>
            </div>
          </div>
          
          <div className="mt-8">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Salvar Configurações
            </button>
          </div>
        </form>
        
        <div className="p-6 bg-gray-50 border-t">
          <h3 className="text-lg font-medium mb-4">Exportar/Importar Dados</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Faça backup dos seus dados exportando-os para um arquivo.
              </p>
              <button
                type="button"
                onClick={() => {
                  const dataStr = JSON.stringify(state);
                  const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
                  
                  const exportFileDefaultName = `uber-driver-data-${new Date().toISOString().slice(0, 10)}.json`;
                  
                  const linkElement = document.createElement('a');
                  linkElement.setAttribute('href', dataUri);
                  linkElement.setAttribute('download', exportFileDefaultName);
                  linkElement.click();
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Exportar Dados
              </button>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Restaure seus dados a partir de um arquivo de backup.
              </p>
              <label className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer inline-block">
                Importar Dados
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    
                    const reader = new FileReader();
                    reader.onload = (evt) => {
                      try {
                        const result = evt.target?.result;
                        if (typeof result === 'string') {
                          const parsedData = JSON.parse(result);
                          if (confirm('Tem certeza que deseja substituir todos os dados atuais?')) {
                            dispatch({ type: 'LOAD_DATA', payload: parsedData });
                            alert('Dados importados com sucesso!');
                          }
                        }
                      } catch (error) {
                        alert('Erro ao importar arquivo. Verifique se o formato é válido.');
                        console.error('Import error:', error);
                      }
                    };
                    reader.readAsText(file);
                  }}
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;