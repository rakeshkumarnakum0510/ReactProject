import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import AddCase from "./components/AddCase";
import Case from "./components/Case";
import CaseList from "./components/CaseList";
import './App.css';

function App(){
  return (
    <Router>
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <a href="/tutorials" className="navbar-brand">
          Home
          </a>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/tutorials"} className="nav-link">
              Country List
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/add"} className="nav-link">
                Add
              </Link>
            </li>
          </div>
        </nav>

        <div className="container mt-3">
          <Switch>
            <Route exact path={["/", "/tutorials"]} component={CaseList} />
            <Route exact path="/add" component={AddCase} />
            <Route path="/tutorials/:id" component={Case} />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
