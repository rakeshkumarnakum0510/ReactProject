import React, { Component } from "react";
import CaseService from "../services/CaseService";
import { Link } from "react-router-dom";
import Table from 'react-bootstrap/Table'

export default class CaseList extends Component {
  cases = [];
  todayCases=[];
  constructor(props) {
    super(props);
    this.onChangeSearchTitle = this.onChangeSearchTitle.bind(this);
    this.retrieveTutorials = this.retrieveTutorials.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveTutorial = this.setActiveTutorial.bind(this);
    this.removeAllTutorials = this.removeAllTutorials.bind(this);
    this.searchTitle = this.searchTitle.bind(this);

    this.state = {
      tutorials: [],
      currentTutorial: null,
      currentIndex: -1,
      searchTitle: ""
    };
  }

  componentDidMount() {
    this.retrieveTutorials();
  }

  onChangeSearchTitle(e) { 
    const searchTitle = e.target.value;

    this.setState({
      searchTitle: searchTitle
    });
  }
  
  retrieveTutorials() {
    CaseService.getAll()
      .then(response => {
        this.cases=response.data;
          this.totalcases = this.cases.reduce((accum, item) => accum + item.newcase, 0);
           this.totaldeaths = this.cases.reduce((accum, item) => accum + item.newdeath, 0);
      let todaydate = new Date().toISOString().split('T')[0]; 
      let td = JSON.stringify(todaydate); 
      this.todayCases=this.cases.filter( a => a.date === JSON.parse(td));
     // console.log(this.todayCases);
      this.todayCases.forEach((el)=>{
        const ccases = this.cases.filter(c => c.title === el.title);
          //  console.warn(ccases); 
            const sumOfcases =ccases.reduce((accum,item) => accum + item.newcase, 0);
            const sumOfdeaths =ccases.reduce((accum,item) => accum + item.newdeath, 0);
            //console.log(sumOfcases);
         el.totalcases= sumOfcases;
         el.totaldeaths = sumOfdeaths;
       //console.log(sumOfcases);
      // console.log(sumOfdeaths);
     }); 

     //let res  = [...new Set(this.cases.map(item => item.age))];
    // console.warn(res);



        this.setState({
          tutorials: response.data
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  refreshList() {
    this.retrieveTutorials();
    this.setState({
      currentTutorial: null,
      currentIndex: -1
    });
  }

  setActiveTutorial(tutorial, index) {
    this.setState({
      currentTutorial: tutorial,
      currentIndex: index
    });
  }

  removeAllTutorials() {
    CaseService.deleteAll()
      .then(response => {
        console.log(response.data);
        this.refreshList();
      })
      .catch(e => {
       // console.log(e);
      });
  }
  searchTitle() {
    CaseService.findByTitle(this.state.searchTitle)
      .then(response => {
        this.setState({
          tutorials: response.data
        });
       // console.log(response.data);
      })
      .catch(e => {
       // console.log(e);
      });
  }
 

  render() {
    const { searchTitle, tutorials, currentTutorial, currentIndex } = this.state;

    return (
      <div className="list row">
        <div className="col-md-8">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by country"
              value={searchTitle}
              onChange={this.onChangeSearchTitle}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={this.searchTitle}
              >
                Search
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-12">
          <h4>Country List</h4>
          <Table striped bordered hover style={{textAlign: "center"}}>
          <thead>
            <tr>
              <th>Country Code</th>
              <th>Country Name</th>
              <th>Country Newcases</th>
              <th>Country Newdeaths</th>
              <th>Edit Case</th>
            </tr>
          </thead>
          <tbody>
          {this.todayCases  && this.todayCases.map((reptile,index) => ( 
            <tr key={index}> 
            <td>{reptile.id}</td>
            <td>{reptile.title}</td>
            <td>{reptile.totalcases} <p style={{color: "red",fontSize:"12px", display:"inline"}}> &uarr; {reptile.newcase}</p></td>
            <td>{reptile.totaldeaths} <p style={{color: "red",fontSize:"12px", display:"inline"}}> &uarr; {reptile.newdeath}</p></td>
            <td>
            <Link
            to={"/tutorials/" + reptile.id}
            className="badge badge-warning"
             >
            Edit
          </Link>
          </td>
          </tr>
            ))}
          </tbody>
          
        </Table>
        <h1>TotalCases :{this.totalcases}</h1>
        <h1>TotalCases :{this.totaldeaths}</h1>
          <button
            className="m-3 btn btn-sm btn-danger"
            onClick={this.removeAllTutorials}
          >
            Remove All
          </button>
          <div className="col-md-6">
          <ul className="list-group">
         {tutorials &&
           tutorials.map((tutorial, index) => (
             <li
               className= {
                 "list-group-item " +
                 (index === currentIndex ? "active" : "")
                          }
               onClick={() => this.setActiveTutorial(tutorial, index)}
               key={index}
             >{tutorial.title}
             </li>
           ))}
       </ul> 
       </div>
        </div>
        <div className="col-md-6">
          {currentTutorial ? (
            <div>
              <h4>Country</h4>
              <div>
                <label>
                  <strong>Title:</strong>
                </label>{" "}
                {currentTutorial.title}
              </div>
              <div>
                <label>
                  <strong>Date:</strong>
                </label>{" "}
                {currentTutorial.date}
              </div>
              <div>
              <label>
                <strong>Newcases:</strong>
              </label>{" "}
              {currentTutorial.newcase}
            </div>
            <div>
            <label>
              <strong>Newdeaths:</strong>
            </label>{" "}
            {currentTutorial.newdeath}
          </div>
              <div>
                <label>
                  <strong>Status:</strong>
                </label>{" "}
                {currentTutorial.published ? "Published" : "Pending"}
              </div>

              <Link
                to={"/tutorials/" + currentTutorial.id}
                className="badge badge-warning"
              >
                Edit
              </Link>
            </div>
          ) : (
            <div>
              <br />
              <p>Please click on a Country...</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}