import React from "react";
import styles from "./Detail.module.css";

const Detail = () => {
  const [squareCount, setSquareCount] = React.useState(getSquareCount());

  function getSquareCount() {
    return window.innerWidth < 600 ? 4 : 8;
  }

  React.useEffect(() => {
    const handleResize = () => {
      setSquareCount(getSquareCount());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const squares = [];
  for (let i = 0; i < squareCount; i++) {
    squares.push(<div key={i} className={styles.squares}></div>);
  }

  return <div className={styles.container}>{squares}</div>;
};

export default Detail;
