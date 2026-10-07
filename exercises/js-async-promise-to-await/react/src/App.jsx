import { useState, useEffect } from 'react';
import './App.css'

function App() {
  const [org, setOrg] = useState(0);

  useEffect(() => {
    fetch(`https://api.github.com/orgs/microsoft`)
    .then(d => d.json())
    .then(d => setOrg(d.public_repos))
    .catch(err => console.log(err));
  }, []);

  return (
    <div style={{ margin: '50px'}}>
      <input disabled type="text" value={org} />
    </div>
  )
}

export default App
