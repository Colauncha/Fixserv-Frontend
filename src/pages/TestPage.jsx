import { useState, useEffect } from 'react';

function TestPage() {
  const [color, setColor] = useState('bg-emerald-500');

  useEffect(() => {
    const colors = ['bg-emerald-500', 'bg-blue-500', 'bg-red-500'];
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % colors.length;
      setColor(colors[index]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex w-full h-full items-center justify-center">
      <div
        className={`min-h-screen px-3 ${color} text-white text-4xl flex items-center justify-center`}
      >
        TAILWIND TEST
      </div>
    </div>
  );
}

export default TestPage;
