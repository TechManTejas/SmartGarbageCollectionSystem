import { useEffect, useState } from 'react';
import io from 'socket.io-client';

// Define the shape of your bin data
interface Bin {
  id: string;
  count: number;
  randomText: string;
}

// Connect to the server
const socket = io('http://localhost:4000');

export const Dashboard = () => {
  const [bins, setBins] = useState<Bin[]>([]);

  useEffect(() => {
    // Listen for updates on bins list
    socket.on('updateBinsList', (updatedBins: Bin[]) => {
      setBins(updatedBins);
    });

    // Clean up on component unmount
    return () => {
      socket.off('updateBinsList');
    };
  }, []);

  return (
    <div>
      <h2>Bins Information</h2>
      <ul>
        {bins.map((bin) => (
          <li key={bin.id}>
            ID: {bin.id}, Count: {bin.count}, Random Text: {bin.randomText}
          </li>
        ))}
      </ul>
    </div>
  );
};
