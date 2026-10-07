import cardStyles from "./Card.module.css";

const Card = ({
  avatar_url,
  name,
  url,
}: {
  avatar_url: string;
  name: string;
  url: string;
}) => (
  <div className={cardStyles.card}>
    <img src={avatar_url} alt={name} className={cardStyles.cardimg} />
    <a href={url}>{name}</a>
  </div>
);

export default Card;
