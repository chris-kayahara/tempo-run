import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import LoginPage from './pages/LoginPage/LoginPage'

import './App.scss'

function App() {

  const [isUserLoggedIn, setIsUserLoggedIn] = useState(
    !!sessionStorage.getItem("token")
  );

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginPage/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
