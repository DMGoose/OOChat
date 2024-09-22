import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Chat from './pages/Chat';
import NotFound from './pages/NotFound';
import SetAvatar from './pages/setAvatar';

function App(){
  return (
  <Router>

    <Routes>
      <Route path="/register" element={<Register/>}></Route>
      <Route path="/login" element={<Login/>}></Route>
      <Route path="/" element={<Chat/>}></Route>
      <Route path="/setAvatar" element={<SetAvatar />}></Route>
      <Route path="*" element={<NotFound />} /> {/* 处理未匹配路由 */}
    </Routes>

  </Router>)
}

export default App;