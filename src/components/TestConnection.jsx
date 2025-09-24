// Add this component to test the connection
// Save as src/components/TestConnection.jsx

import React, { useState } from 'react';
import { apiConnector } from '../services/apiConnector';
import { BASE_URL } from '../services/apis';

const TestConnection = () => {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setStatus('Testing connection...');
    
    try {
      const response = await apiConnector('GET', `${BASE_URL}/test`);
      setStatus(`✅ Connection successful! ${response.data.message}`);
      console.log('Backend response:', response.data);
    } catch (error) {
      setStatus(`❌ Connection failed: ${error.message}`);
      console.error('Connection error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg m-4">
      <h3 className="text-lg font-bold mb-2">Backend Connection Test</h3>
      <button 
        onClick={testConnection}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Backend Connection'}
      </button>
      {status && (
        <div className="mt-2 p-2 bg-gray-100 rounded">
          <p>{status}</p>
          <p className="text-sm text-gray-600">Backend URL: {BASE_URL}</p>
        </div>
      )}
    </div>
  );
};

export default TestConnection;