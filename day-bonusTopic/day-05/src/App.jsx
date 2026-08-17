import React, { useCallback, useMemo, useState } from 'react';
import About from './components/About';

const App = () => {
  console.log('App Rendering...');
  const [count, setCount] = useState(0);
  const [users, setUsers] = useState({
    name: 'Raja',
    id: 1,
  });

  const greet = useCallback(() => {
    console.log(`Hello`);
  }, [count]);

  const heavyCalculate = useMemo(() => {
    console.log('calculation value');

    // return 10
    for (let i = 0; i < 1000000000; i++) {}
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      <header className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-extrabold mb-2">My App</h1>
        <p className="text-gray-600 dark:text-gray-300">
          A tiny React demo with Tailwind styling.
        </p>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-6">
        {/* <h2>{users.name}</h2> */}
        <h3>Calci - {heavyCalculate}</h3>
        <div className="flex items-center justify-between bg-white dark:bg-gray-900 rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold">
            Count:{' '}
            <span className="text-indigo-600 dark:text-indigo-400">
              {count}
            </span>
          </h2>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              onClick={() => setCount(count + 1)}
            >
              Increment
            </button>
            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              onClick={() => setCount(0)}
            >
              Reset
            </button>
          </div>
        </div>

        <button
          className="px-4 py-2 bg-amber-900 text-white rounded hover:bg-amber-600"
          onClick={() => setUsers({ ...users, name: 'Subham' })}
        >
          Change Name
        </button>
        <About
        //  greet={greet}
        // heavyCalculate={heavyCalculate}
        />
      </main>

      <footer className="max-w-4xl mx-auto p-6 text-center text-sm text-gray-500">
        Â© {new Date().getFullYear()} All Rights Reserved.
      </footer>
    </div>
  );
};

export default App;
