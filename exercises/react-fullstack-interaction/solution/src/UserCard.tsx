import "./UserCard.css";

export default function UserCard({
  html_url,
  name,
  avatar_url,
}: {
  html_url: string;
  name: string;
  avatar_url: string;
}) {
  return (
    <div className="card">
      <a href={html_url} target="_blank" rel="noopener noreferrer">
        <h2 style={{ fontSize: name.length > 17 ? "12px" : "18px" }}>{name}</h2>
      </a>
      <img className="profile-image" src={avatar_url} alt="avatar" />
    </div>
  );
}
