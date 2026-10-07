import React, { type ChangeEvent } from "react";
import UserCard from "./UserCard.tsx";

let updateTimeout: number;

function App() {
  const [usernames, setUsernames] = React.useState<string[]>([]);
  const [userData, setUserData] = React.useState<
    {
      html_url: string;
      name: string;
      avatar_url: string;
    }[]
  >([]);

  React.useEffect(() => {
    if (!usernames.length) {
      setUserData([]);
      return;
    }
    const requests = usernames.map((username) =>
      fetch(`https://api.github.com/users/${username}`),
    );
    Promise.all(requests)
      .then((responses) =>
        Promise.all(responses.map((response) => response.json())),
      )
      .then((data) => data.filter((user) => user.name))
      .then((data) => setUserData(data));
  }, [usernames]);

  const updateUsernames = (e: ChangeEvent<HTMLInputElement>) => {
    clearTimeout(updateTimeout);
    updateTimeout = setTimeout(() => {
      setUsernames(
        e.target.value
          .split(",")
          .map((str: string) => str.trim())
          .filter((item: string) => item),
      );
    }, 500);
  };

  return (
    <div className="main-content">
      <form>
        <label>
          Enter GitHub usernames:
          <input type="text" name="usernames" onChange={updateUsernames} />
        </label>
      </form>
      <div className="card-container">
        {userData.map((user, index) => (
          <UserCard
            key={index}
            html_url={user.html_url}
            name={user.name}
            avatar_url={user.avatar_url}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
