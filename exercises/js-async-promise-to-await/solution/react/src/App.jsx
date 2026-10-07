import { useState, useEffect } from 'react';
import './App.css'

function App() {
  const [org, setOrg] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://api.github.com/orgs/microsoft`);
        const data = await response.json();
        setOrg(data.public_repos);
      } catch (err) {
        console.log(err);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div style={{ margin: '50px'}}>
      <input disabled type="text" value={org} />
    </div>
  )
}

export default App
