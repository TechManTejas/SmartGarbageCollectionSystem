import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

export const Bin = () => {
  const [count, setCount] = useState(0);
  // State to hold the random text
  const [randomText, setRandomText] = useState('');

  useEffect(() => {
    generateRandomText()
  }, []);

  useEffect(() => {
    // Emit initial state when component mounts
    socket.emit('binConnected', { count, randomText });

    // Cleanup on disconnect or component unmount
    return () => {
      socket.emit('binDisconnected');
      socket.off();
    };
  }, []);

  useEffect(() => {
    socket.on('updateBin', (updatedBin) => {
      if (updatedBin.id === socket.id) {
        setCount(updatedBin.count);
        setRandomText(updatedBin.randomText);
      }
    });

    // Cleanup on component unmount
    return () => {
      socket.off('updateBin');
    };
  }, []);


  const increment = () => {
    socket.emit('increment');
  };

  const clear = () => {
    socket.emit('clearCount');
  };

  // Function to generate a 6-character random string and update the state
  const generateRandomText = () => {
    const result = Math.random().toString(36).substring(2, 8);
    setRandomText(result);
    socket.emit('generateRandomText', result);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 mt-10">
      <div className="text-2xl font-bold">{count}</div>
      <div className="flex space-x-4">
        <button
          onClick={increment}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          +
        </button>
        <button
          onClick={clear}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Clear
        </button>
        {/* Button to generate random text */}
        <button
          onClick={generateRandomText}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Random
        </button>
      </div>
      {/* Display the random text */}
      <div className="text-lg font-medium mt-4">{randomText}</div>
    </div>
  );
};
