// components/LogList.js
import React, { useState } from 'react';
import axios from 'axios';

function LogList({ logs = [] }) {
  const [selectedLog, setSelectedLog] = useState(null);
  const [memo, setMemo] = useState('');
  const handleMemoChange = (e) => {
    setMemo(e.target.value);
  };

  const saveMemo = async (logId) => {
    try {
      await axios.post('/api/editLog', { logId, memo });
      alert('Memo saved successfully');
      // Update the local state or re-fetch logs here if needed
    } catch (error) {
      console.error('Error saving memo:', error);
      alert('Failed to save memo');
    }
  };

  return (

    <div className="absolute w-96 h-64 top-0 left-32 z-20 bg-white opacity-70 rounded-lg overflow-y-auto">
      <p className="ml-32 text-3xl">Activity Log</p>
      <table className="mx-2 w-full text-xl ">
        <thead>
          <tr>
            <th className="border px-0 py-1">Log Date</th>
            <th className="border px-1 py-1">Memo</th>
            <th className="border px-1 py-1">Edit Memo</th>
          </tr>
        </thead>
        <tbody>
          {(Array.isArray(logs) ? logs : []).map((log) => (
            <tr key={log.log_id}>
              <td className="border px-2 py-1 text-center">
                {new Date(log.start_time).toLocaleString()}
              </td>
              <td className="border px-1 py-1 text-center">{log.memo ? log.memo : 'None'}</td>
              <td className="border px-1 py-1 text-center">
                <button className="bg-primary rounded-md px-2" onClick={() => setSelectedLog(log)}>Add/Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedLog && (
      <>
        <div className="fixed top-0 left-0 w-full h-full bg-black opacity-50 blur z-30" onClick={() => setSelectedLog(null)} />
        <div className="fixed top-32 left-1/4 w-44 h-48 bg-white z-30 rounded-lg p-4 text-2xl">
          {' '}
          <button className="absolute top-2 right-2" onClick={() => setSelectedLog(null)}>X</button>
          <h2>Edit Memo</h2>
          <textarea value={memo} onChange={handleMemoChange} className="w-full h-16 p-2 mt-2" />
          <button className="mt-1 bg-primary rounded-md px-4 py-2" onClick={() => saveMemo(selectedLog.log_id)}>Save Memo</button>
        </div>
      </>
      )}

    </div>
  );
}

export default LogList;
