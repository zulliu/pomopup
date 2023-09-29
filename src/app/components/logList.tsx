// components/LogList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Dialog, Button, DialogHeader } from '@material-tailwind/react';
import { useGlobalDispatch, useUserData, useGlobalState } from '../globalContext';

function LogList() {
  const [selectedLog, setSelectedLog] = useState(null);
  const [open, setOpen] = useState(false);
  const dispatch = useGlobalDispatch();
  const globalState = useGlobalState();
  const { logs } = globalState;
  const userId = Cookies.get('user_id');
  const [memo, setMemo] = useState('');

  const handleMemoChange = (e) => {
    setMemo(e.target.value);
  };
  const handleOpen = () => setOpen(!open);

  const saveMemo = async (logId) => {
    try {
      await axios.post('/api/editLog', { logId, memo });
      alert('Memo saved successfully');
      const newLogs = await axios.get(`/api/getLogs?userId=${userId}`);
      dispatch({ type: 'SET_LOGS', payload: newLogs.data });
    } catch (error) {
      console.error('Error saving memo:', error);
      alert('Failed to save memo');
    }
  };

  return (

    <div className="absolute w-[38rem] h-[36rem] -top-40 left-16 z-20 bg-white opacity-80 rounded-lg overflow-y-auto">
      <div className="ml-60 text-3xl mx-auto mt-6">Activity Log</div>
      <table className="mx-auto w-11/12 text-xl end-10">
        <thead>
          <tr>
            <th className="border px-0 py-1">Log Date</th>
            <th className="border px-1 py-1">Memo</th>
            <th className="border px-0 py-1">{' '}</th>
          </tr>
        </thead>
        <tbody>
          {(Array.isArray(logs) ? logs.filter((log) => log).sort((a, b) => new Date(b.start_time) - new Date(a.start_time)) : []).map((log) => (
            <tr key={log.log_id}>
              <td className="border px-2 py-1 text-center">
                {new Date(log.start_time).toLocaleString()}
              </td>
              <td className="border px-1 py-1 text-center">{log.memo ? log.memo : 'None'}</td>
              <td className="border px-1 py-1 text-center">
                <Button
                  type="button"
                  className="bg-primary px-2"
                  onClick={() => {
                    setSelectedLog(log);
                    handleOpen();
                  }}
                >
                  Add/Edit

                </Button>
              </td>
            </tr>
          ))}

        </tbody>

      </table>

      <Dialog open={open} handler={handleOpen} className="font-exe-pixel">

        <div className="fixed top-32 left-[28rem] w-72 h-60 bg-white z-30 rounded-lg  p-4 text-2xl">
          <DialogHeader
            className="font-exe-pixel text-3xl"
          >
            Edit Memo
          </DialogHeader>
          <textarea value={memo} onChange={handleMemoChange} className="w-full h-16 p-2 mt-2" />
          <button className="mt-1 bg-primary rounded-md px-4 py-0" onClick={() => saveMemo(selectedLog.log_id)}>Save Memo</button>
        </div>
      </Dialog>
    </div>

  );
}

export default LogList;
