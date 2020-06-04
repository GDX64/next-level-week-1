import React from 'react';
import logo from './logo.svg';
import './App.css';
import Home from './pages/home/Home'
import CreatePoint from './pages/createPoint/CreatePoint'
import { BrowserRouter as Router, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <div className="App">
        <Route exact path="/" component={Home}></Route>
        <Route path="/cadastro" component={CreatePoint} />
      </div>
    </Router>
  );
}

export default App;
