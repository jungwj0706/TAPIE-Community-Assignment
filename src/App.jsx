import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';

import BoardDetail from './Board/BoardDetail';
import BoardEdit from './Board/BoardEdit';
import BoardWrite from './Board/BoardWrite';
import MainBoard from './Board/MainBoard';
import MyPage from './Board/MyPage';
import Header from './Header/Header';
import Login from './Login/Login';

function App() {

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/board/:id" element={<BoardDetail />} />
        <Route path="/edit/:id" element={<BoardEdit />} />
        <Route path="/write" element={<BoardWrite />} />
        <Route path="/" element={<MainBoard />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  )
}

export default App;
