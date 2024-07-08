import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Exercise from './pages/Exercise/Exercise';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/exercise" element={<Exercise />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
