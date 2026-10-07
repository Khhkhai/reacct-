import React from "react";

export default ({
  avatar_url,
  name,
  url,
}: {
  avatar_url: string;
  name: string;
  url: string;
}) => (
  <div
    style={{
      display: "inline-flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
      margin: "20px",
      border: "1px solid grey",
      borderRadius: "5px",
      width: "100px",
      height: "150px",
    }}
  >
    <img
      src={avatar_url}
      alt={name}
      style={{
        width: "50px",
        height: "50px",
      }}
    />
    <a href={url}>{name}</a>
  </div>
);
