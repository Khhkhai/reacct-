import React, { type ChangeEvent } from "react";
import "./App.css";

let updateTimeout: number;

function App() {
  const [orgText, setOrgText] = React.useState("microsoft");
  const [org, setOrg] = React.useState("microsoft");
  const [numPublicRepos, setNumPublicRepos] = React.useState(0);

  React.useEffect(() => {
    fetch(`https://api.github.com/orgs/${org}`)
      .then((d) => d.json())
      .then((d) => setNumPublicRepos(d.public_repos));
  }, [org]);

  const updateOrg = (e: ChangeEvent<HTMLInputElement>) => {
    setOrgText(e.target.value);
    clearTimeout(updateTimeout);
    updateTimeout = setTimeout(() => {
      setOrg(e.target.value);
    }, 500);
  };

  return (
    <div style={{ margin: "50px" }}>
      <input disabled type="text" value={numPublicRepos} />
      <button
        type="button"
        onClick={() => setNumPublicRepos(numPublicRepos - 1)}
      >
        &minus;
      </button>
      <button
        type="button"
        onClick={() => setNumPublicRepos(numPublicRepos + 1)}
      >
        &#43;
      </button>
      <br />
      <br />
      <input type="text" value={orgText} onChange={updateOrg} />
    </div>
  );
}

export default App;
