import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import React, { Component } from 'react';
import './App.css';

import About from './views/About'
import Home from './views/Home'

class App extends Component {
  render() {
    return (
      <Router>
        <div>
        <ul className="nav">
          <li className="nav-item">
            <Link className="nav-link active" to="/">Home</Link>            
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/about/">About</Link>
          </li>          
        </ul>
          
        <div className="container d-flex justify-content-center">
          <Route path="/" exact component={Home} />
        </div>
          <Route path="/about/" component={About} />
          {/* <Route path="/users/" component={Users} /> */}
        </div>
      </Router>
    );
  }
}

export default App;
