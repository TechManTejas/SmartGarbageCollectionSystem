
import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

// Define the shape of your bin data
interface Bin {
  id: string;
  count: number;
  randomText: string;
}

// Define the shape for bin positions
interface BinPosition {
  id: string;
  x: number;
  y: number;
}

// Connect to the server
const socket = io('http://localhost:4000');

export const Dashboard = () => {
  const [bins, setBins] = useState<Bin[]>([]);
  const [binPositions, setBinPositions] = useState<BinPosition[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridSize = 10; // 10x10 grid
  const cellSize = 50; // Each cell is 50x50 pixels

  useEffect(() => {
    socket.on('updateBinsList', (updatedBins: Bin[]) => {
      setBins(updatedBins);
    });

    return () => {
      socket.off('updateBinsList');
    };
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

        // Draw grid
        for (let x = 0; x <= gridSize; x++) {
          for (let y = 0; y <= gridSize; y++) {
            ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
          }
        }

        // Draw bins and compute new positions
        const newBinPositions: BinPosition[] = bins.map((bin) => {
          const x = Math.floor(Math.random() * gridSize) * cellSize;
          const y = Math.floor(Math.random() * gridSize) * cellSize;
          ctx.fillText(`Count: ${bin.count}`, x + 5, y + 20);
          ctx.fillText(bin.randomText, x + 5, y + 35);
          return { id: bin.id, x: x / cellSize, y: y / cellSize };
        });
        setBinPositions(newBinPositions);

        // Draw the path if we have bins
        if (newBinPositions.length) {
          ctx.beginPath();
          ctx.moveTo(0, 0); // Start at (0,0)
          let currentPosition = { x: 0, y: 0 };

          // Sort bins by distance to create a path
          const positions = [...newBinPositions];
          while (positions.length > 0) {
            positions.sort((a, b) => {
              const distA = Math.sqrt(Math.pow(a.x - currentPosition.x, 2) + Math.pow(a.y - currentPosition.y, 2));
              const distB = Math.sqrt(Math.pow(b.x - currentPosition.x, 2) + Math.pow(b.y - currentPosition.y, 2));
              return distA - distB;
            });
            const closest = positions.shift();
            if (closest) {
              ctx.lineTo(closest.x * cellSize + cellSize / 2, closest.y * cellSize + cellSize / 2);
              currentPosition = closest;
            }
          }
          // Return to start
          ctx.lineTo(0, 0);
          ctx.stroke();
        }
      }
    }
  }, [bins]); // Redraw when bins update

  return (
    <div>
      <h2>Bins Information</h2>
      <canvas ref={canvasRef} width="500" height="500" style={{ border: '1px solid #000' }}></canvas>
    </div>
  );
};

