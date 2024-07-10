// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;





import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [migrateLoading, setMigrateLoading] = useState({});

  const handleMigrate = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching data...');
      const response = await axios.get('http://localhost:8080/https://pwce3zabo0.execute-api.us-east-1.amazonaws.com/dev/ec2recommendation', {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      console.log('Data fetched:', response.data);
      setResult(response.data.body);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Error fetching data. Please check the console for more details.');
    }
    setLoading(false);
  };

  const handleInstanceMigrate = async (instanceId) => {
    setMigrateLoading((prev) => ({ ...prev, [instanceId]: true }));
    try {
      const url = `https://pwce3zabo0.execute-api.us-east-1.amazonaws.com/dev/migrate-ec2?InstanceId=${instanceId}`;
      window.open(url);
    } catch (err) {
      console.error('Error invoking migrate API:', err);
      setError(`Error migrating instance ${instanceId}. Please check the console for more details.`);
    }
    setMigrateLoading((prev) => ({ ...prev, [instanceId]: false }));
  };

  const renderTable = () => {
    if (!Array.isArray(result) || result.length === 0) return null;

    const keys = Object.keys(result[0]);

    return (
      <table>
        <thead>
          <tr>
            {keys.map(key => (
              <th key={key}>{key}</th>
            ))}
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {result.map((item, index) => (
            <tr key={index}>
              {keys.map(key => (
                <td key={key}>{item[key]}</td>
              ))}
              <td>
                <button onClick={() => handleInstanceMigrate(item['Instance Id'])} disabled={migrateLoading[item['Instance Id']]}>
                  {migrateLoading[item['Instance Id']] ? 'Migrating...' : 'Migrate'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Migrate Application</h1>
        <button onClick={handleMigrate} disabled={loading} className="migrate-button">
          {loading ? 'Loading...' : 'Run Recommendations'}
        </button>
        {error && <p className="error-message">{error}</p>}
        {renderTable()}
      </header>
    </div>
  );
}

export default App;

