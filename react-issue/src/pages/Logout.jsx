import { signOut } from 'firebase/auth'
import React from 'react'
import { auth } from '../firebase'
import { useNavigate } from 'react-router-dom'

import './Log.css'

const Logout = ({ setIsAuth }) => {
  const navigate = useNavigate()
  const logout = () => {
    // Googleでログアウト
    signOut(auth).then(() => {
      localStorage.clear()
      setIsAuth(false)
      navigate('/login')

    });
  };

  return (
    <div className='log'>
      <button onClick={logout}>ログアウト</button>
    </div>
  )
}

export default Logout