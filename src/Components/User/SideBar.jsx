import React from 'react'
import { NavLink } from 'react-router-dom'
import styles from "./SideBar.module.css";
import UserIcon from './UserIcon';
const SideBar = () => {
  return (
    <nav className={styles.nav}>
        <UserIcon/>
        <NavLink to="/conta" end>Conta</NavLink>
        <NavLink to="/conta/posts">Posts</NavLink>
        <NavLink to="/conta/criar">Criar Post</NavLink>
        <NavLink to="/conta/dados">Dados</NavLink>
        <button>Sair</button>
    </nav>
  )
}

export default SideBar