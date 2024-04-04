
// // import { useEffect, useState, useRef } from 'react';
// // import io from 'socket.io-client';

// // // Define the shape of your bin data
// // interface Bin {
// //   id: string;
// //   count: number;
// //   randomText: string;
// // }

// // // Define the shape for bin positions
// // interface BinPosition {
// //   id: string;
// //   x: number;
// //   y: number;
// // }

// // // Connect to the server
// // const socket = io('http://localhost:4000');

// // export const Dashboard = () => {
// //   const [bins, setBins] = useState<Bin[]>([]);
// //   const [binPositions, setBinPositions] = useState<BinPosition[]>([]);
// //   const canvasRef = useRef<HTMLCanvasElement>(null);
// //   const gridSize = 10; // 10x10 grid
// //   const cellSize = 50; // Each cell is 50x50 pixels

// //   useEffect(() => {
// //     socket.on('updateBinsList', (updatedBins: Bin[]) => {
// //       setBins(updatedBins);
// //     });

// //     return () => {
// //       socket.off('updateBinsList');
// //     };
// //   }, []);

// //   useEffect(() => {
// //     if (canvasRef.current) {
// //       const canvas = canvasRef.current;
// //       const ctx = canvas.getContext('2d');
// //       if (ctx) {
// //         ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

// //         // Draw grid
// //         for (let x = 0; x <= gridSize; x++) {
// //           for (let y = 0; y <= gridSize; y++) {
// //             ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
// //           }
// //         }

// //         // Draw bins and compute new positions
// //         const newBinPositions: BinPosition[] = bins.map((bin) => {
// //           const x = Math.floor(Math.random() * gridSize) * cellSize;
// //           const y = Math.floor(Math.random() * gridSize) * cellSize;
// //           ctx.fillText(`Count: ${bin.count}`, x + 5, y + 20);
// //           ctx.fillText(bin.randomText, x + 5, y + 35);
// //           return { id: bin.id, x: x / cellSize, y: y / cellSize };
// //         });
// //         setBinPositions(newBinPositions);

// //         // Draw the path if we have bins
// //         if (newBinPositions.length) {
// //           ctx.beginPath();
// //           ctx.moveTo(0, 0); // Start at (0,0)
// //           let currentPosition = { x: 0, y: 0 };

// //           // Sort bins by distance to create a path
// //           const positions = [...newBinPositions];
// //           while (positions.length > 0) {
// //             positions.sort((a, b) => {
// //               const distA = Math.sqrt(Math.pow(a.x - currentPosition.x, 2) + Math.pow(a.y - currentPosition.y, 2));
// //               const distB = Math.sqrt(Math.pow(b.x - currentPosition.x, 2) + Math.pow(b.y - currentPosition.y, 2));
// //               return distA - distB;
// //             });
// //             const closest = positions.shift();
// //             if (closest) {
// //               ctx.lineTo(closest.x * cellSize + cellSize / 2, closest.y * cellSize + cellSize / 2);
// //               currentPosition = closest;
// //             }
// //           }
// //           // Return to start
// //           ctx.lineTo(0, 0);
// //           ctx.stroke();
// //         }
// //       }
// //     }
// //   }, [bins]); // Redraw when bins update

// //   return (
// //     <div>
// //       <h2>Bins Information</h2>
// //       <canvas ref={canvasRef} width="500" height="500" style={{ border: '1px solid #000' }}></canvas>
// //     </div>
// //   );
// // };



// import { useEffect, useState, useRef } from 'react';
// import io from 'socket.io-client';

// // Define the shape of your bin data
// interface Bin {
//   id: string;
//   count: number;
//   randomText: string;
// }

// // Define the shape for bin positions
// interface BinPosition {
//   id: string;
//   x: number;
//   y: number;
// }

// // Connect to the server
// const socket = io('http://localhost:4000');

// export const Dashboard = () => {
//   const [bins, setBins] = useState<Bin[]>([]);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const gridSize = 10; // 10x10 grid
//   const cellSize = 50; // Each cell is 50x50 pixels

//   useEffect(() => {
//     socket.on('updateBinsList', (updatedBins: Bin[]) => {
//       setBins(updatedBins);
//     });

//     return () => {
//       socket.off('updateBinsList');
//     };
//   }, []);

//   useEffect(() => {
//     if (canvasRef.current) {
//       const canvas = canvasRef.current;
//       const ctx = canvas.getContext('2d');
//       if (ctx) {
//         ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

//         // Draw grid
//         for (let x = 0; x < gridSize; x++) {
//           for (let y = 0; y < gridSize; y++) {
//             ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
//           }
//         }

//         // Draw bins and compute new positions
//         const newBinPositions: BinPosition[] = bins.map((bin) => {
//           // Random position in grid, you might want to adjust this logic
//           const x = Math.floor(Math.random() * gridSize);
//           const y = Math.floor(Math.random() * gridSize);
//           // Draw text in the middle of the cell
//           ctx.fillText(`Count: ${bin.count}`, x * cellSize + cellSize / 2, y * cellSize + cellSize / 2 - 10);
//           ctx.fillText(bin.randomText, x * cellSize + cellSize / 2, y * cellSize + cellSize / 2 + 10);
//           return { id: bin.id, x, y };
//         });

//         // Draw the path if we have bins
//         if (newBinPositions.length) {
//           ctx.beginPath();
//           ctx.moveTo(cellSize / 2, cellSize / 2); // Start at the middle of (0,0) cell

//           let currentPosition = { x: 0, y: 0 };

//           // Sort bins by distance to create a path
//           const positions = [...newBinPositions];
//           while (positions.length > 0) {
//             positions.sort((a, b) => {
//               const distA = Math.sqrt(Math.pow((a.x - currentPosition.x) * cellSize, 2) + Math.pow((a.y - currentPosition.y) * cellSize, 2));
//               const distB = Math.sqrt(Math.pow((b.x - currentPosition.x) * cellSize, 2) + Math.pow((b.y - currentPosition.y) * cellSize, 2));
//               return distA - distB;
//             });
//             const closest = positions.shift();
//             if (closest) {
//               ctx.lineTo(closest.x * cellSize + cellSize / 2, closest.y * cellSize + cellSize / 2);
//               currentPosition = { x: closest.x, y: closest.y };
//             }
//           }

//           // Return to start
//           ctx.lineTo(cellSize / 2, cellSize / 2);
//           ctx.stroke();
//         }
//       }
//     }
//   }, [bins]); // Redraw when bins update

//   return (
//     <div>
//       <h2>Bins Information</h2>
//       <canvas ref={canvasRef} width={gridSize * cellSize} height={gridSize * cellSize} style={{ border: '1px solid #000' }}></canvas>
//     </div>
//   );
// };


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
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Draw grid
        for (let x = 0; x < gridSize; x++) {
          for (let y = 0; y < gridSize; y++) {
            ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
          }
        }

        // Draw bins and compute new positions
        const newBinPositions: BinPosition[] = bins.map((bin) => {
          const x = Math.floor(Math.random() * gridSize);
          const y = Math.floor(Math.random() * gridSize);
          ctx.fillText(`Count: ${bin.count}`, x * cellSize + cellSize / 2, y * cellSize + cellSize / 2);
          ctx.fillText(bin.randomText, x * cellSize + cellSize / 2, y * cellSize + 3 * cellSize / 4);
          return { id: bin.id, x, y };
        });

        // Draw the path if we have bins
        if (newBinPositions.length) {
          ctx.beginPath();
          let currentPosition = { x: 0, y: 0 };
          ctx.moveTo(currentPosition.x * cellSize + cellSize / 2, currentPosition.y * cellSize + cellSize / 2); // Start at the middle of (0,0) cell

          newBinPositions.forEach(position => {
            // Horizontal line to the column
            ctx.lineTo(position.x * cellSize + cellSize / 2, currentPosition.y * cellSize + cellSize / 2);
            // Vertical line to the row
            ctx.lineTo(position.x * cellSize + cellSize / 2, position.y * cellSize + cellSize / 2);
            currentPosition = { x: position.x, y: position.y };
          });

          // Return to start (0,0)
          ctx.lineTo(currentPosition.x * cellSize + cellSize / 2, 0 + cellSize / 2);
          ctx.lineTo(0 + cellSize / 2, 0 + cellSize / 2);
          ctx.stroke();
        }
      }
    }
  }, [bins]); // Redraw when bins update

  return (
    <div>
      <h2>Bins Information</h2>
      <canvas ref={canvasRef} width={gridSize * cellSize} height={gridSize * cellSize} style={{ border: '1px solid #000' }}></canvas>
    </div>
  );
};
