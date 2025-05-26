import React from "react";
import styles from "./Detail.module.css";

const Detail = () => {
  const squares = [];
  for (let i = 0; i < 8; i++) {
    squares.push(<div key={i} className={styles.squares}></div>);
  }

  return <div className={styles.container}>{squares}</div>;
};

export default Detail;
