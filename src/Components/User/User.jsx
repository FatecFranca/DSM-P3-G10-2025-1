import React from "react";
import { Route, Routes } from "react-router-dom";
import UserAccount from "./UserAccount";
import SideBar from "./SideBar";
import styles from "./User.module.css";
import UserPosts from "./UserPosts";
import UserDados from "./UserDados";
import GamePost from "./GamePost";
const User = () => {
  return (
    <div className={styles.page}>
      <SideBar />
      <div className={styles.container}>
        <Routes>
          <Route path="/" element={<UserAccount />} />
          <Route path="/posts" element={<UserPosts />} />
          <Route path="/dados" element={<UserDados />} />
          <Route path="/criar" element={<GamePost/>} />
        </Routes>
      </div>
    </div>
  );
};
export default User;
