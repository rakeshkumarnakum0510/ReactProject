import React, { Component } from "react";
import CaseService from "../services/CaseService";
import { Link } from "react-router-dom";
import Table from 'react-bootstrap/Table';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export default class CaseList extends Component {
  cases = [];
  todayCases=[];
  constructor(props) {
    super(props);
    this.onChangeSearchTitle = this.onChangeSearchTitle.bind(this);
    this.retrieveCases = this.retrieveCases.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveCase = this.setActiveCase.bind(this);
    this.removeAllCases = this.removeAllCases.bind(this);
    this.searchTitle = this.searchTitle.bind(this);

    this.state = {
      cases: [],
      currentCase: null,
      currentIndex: -1,
      searchTitle: ""
    };
  }

  componentDidMount() {
    this.retrieveCases();
  }

  onChangeSearchTitle(e) { 
    const searchTitle = e.target.value;

    this.setState({
      searchTitle: searchTitle
    });
  }
  
  retrieveCases() {
    CaseService.getAll()
      .then(response => {
        this.cases=response.data;
          this.totalcases = this.cases.reduce((accum, item) => accum + item.newcase, 0);
           this.totaldeaths = this.cases.reduce((accum, item) => accum + item.newdeath, 0);
      let todaydate = new Date().toISOString().split('T')[0]; 
      let td = JSON.stringify(todaydate); 
      this.todayCases=this.cases.filter( a => a.date === JSON.parse(td));
      this.Todaytotalcases = this.todayCases.reduce((accum, item) => accum + item.newcase, 0);
      this.Todaytotaldeaths = this.todayCases.reduce((accum, item) => accum + item.newdeath, 0);
  
      this.todayCases.forEach((el)=>{
        const ccases = this.cases.filter(c => c.title === el.title);
            const sumOfcases =ccases.reduce((accum,item) => accum + item.newcase, 0);
            const sumOfdeaths =ccases.reduce((accum,item) => accum + item.newdeath, 0);
         el.totalcases= sumOfcases;
         el.totaldeaths = sumOfdeaths;
     }); 
     this.dailycases = [];
     this.dailydeaths = [];
      const dates = [...new Set(this.cases.map(item => item.date))];
         dates.forEach((e) => {
            const dcases = this.cases.filter(c => c.date === e);
            this.dailycases = [...this.dailycases,  dcases.reduce((accum, item) => accum + item.newcase, 0), ];
            this.dailydeaths = [ ...this.dailydeaths,  dcases.reduce((accum, item) => accum + item.newdeath, 0), ]

         }); 
        this.setState({
          cases: response.data
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  refreshList() {
    this.retrieveCases();
    this.setState({
      currentCase: null,
      currentIndex: -1
    });
  }

  setActiveCase(cas, index) {
    this.setState({
      currentCase: cas,
      currentIndex: index
    });
  }

  removeAllCases() {
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
          cases: response.data
        });
       // console.log(response.data);
      })
      .catch(e => {
       // console.log(e);
      });
  }
 

  
  

  render() {
    const { searchTitle, cases, currentCase, currentIndex } = this.state;

   const options = {
      chart: {
        type: 'spline'
      },
      title: {
        text: 'Daily Corona Cases'
      },
      credits: {
        enabled: false
    },
      series: [
        {
          name:'Cases',
          data:this.dailycases    
       }
      ]
    };
    const options1 = {
      chart: {
        type: 'spline'
      },
      title: {
        text: 'Daily Corona Deaths'
      },
      credits: {
        enabled: false
    },
      series: [
       {
          name:'Deaths',
          data:this.dailydeaths,
          color: 'black',
       }
      ]
    };
    return (
      <div className="list row">
      <div className="col-md-12" style={{display:"flex"}}>
      <div className="chart">
      <HighchartsReact  highcharts={Highcharts} options={options} />
      </div>
      <div className="chart">
      <HighchartsReact highcharts={Highcharts} options={options1} />
      </div></div>
        <div className="col-md-6 mx-auto"  style={{paddingTop:"20px"}}>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by country"
              value={searchTitle}
              onChange={this.onChangeSearchTitle}
              onKeyPress={this.searchTitle}
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
        <div className="col-md-12" style={{display:"flex",paddingTop:"50px"}}>
        <div className="col-sm-6 col-lg-3">
          <div className="card text-white" style={{backgroundColor:"#134984"}}>
          <div className="card-body pb-0 cardtxt">
          <div>Todays Cases</div>
          <div className="text-value cardtext">{this.Todaytotalcases}</div>
        </div>
        </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card text-white bg-warning">
          <div className="card-body pb-0 cardtxt">
          <div>Todays Deaths</div>
          <div className="text-value cardtext">{ this.Todaytotaldeaths}</div>
        </div>
        </div>
        </div>
        <div className="col-sm-6 col-lg-3">
        <div className="card text-white  bg-success">
        <div className="card-body pb-0 cardtxt">
        <div>Total Cases</div>
        <div className="text-value cardtext">{this.totalcases}</div>
      </div>
      </div>
      </div>
      <div className="col-sm-6 col-lg-3">
      <div className="card text-white bg-danger">
      <div className="card-body pb-0 cardtxt">
      <div>Total Deaths</div>
      <div className="text-value cardtext"> {this.totaldeaths}</div>
    </div>
    </div>
    </div>
    </div>
        <div className="col-md-12" style={{paddingTop:"50px"}}>
          <Table striped bordered hover style={{textAlign: "center"}}>
          <thead>
            <tr>
              <th>Country Code</th>
              <th>Country Name</th>
              <th>Country Cases</th>
              <th>Country Deaths</th>
              <th>Edit Case</th>
            </tr>
          </thead>
          <tbody>
          {this.todayCases  && this.todayCases.map((reptile,index) => ( 
            <tr key={index}> 
            <td>{reptile.id}</td>
            <td>{reptile.title}</td>
            <td>{reptile.totalcases} <p className="newcasetxt"> &uarr; {reptile.newcase}</p></td>
            <td>{reptile.totaldeaths} <p className="newcasetxt"> &uarr; {reptile.newdeath}</p></td>
            <td>
            <Link
            to={"/cases/" + reptile.id}
            className="badge badge-warning"
             >
            Edit
          </Link>
          </td>
          </tr>
            ))}
          </tbody>
         
        </Table>
          <button
            className="m-3 btn btn-sm btn-danger"
            onClick={this.removeAllCases}
          >
            Remove All
          </button>
        
          <div className="col-md-6">
          <ul className="list-group">
         {cases &&
          cases.map((cas, index) => (
             <li
               className= {
                 "list-group-item " +
                 (index === currentIndex ? "active" : "")
                          }
               onClick={() => this.setActiveCase(cas, index)}
               key={index}
             >{cas.title}
             </li>
           ))}
       </ul> 
                        </div> 
        </div>
          <div className="col-md-6">
          {currentCase ? (
            <div>
              <h4>Country</h4>
              <div>
                <label>
                  <strong>Title:</strong>
                </label>{" "}
                {currentCase.title}
              </div>
              <div>
                <label>
                  <strong>Date:</strong>
                </label>{" "}
                {currentCase.date}
              </div>
              <div>
              <label>
                <strong>Newcases:</strong>
              </label>{" "}
              {currentCase.newcase}
            </div>
            <div>
            <label>
              <strong>Newdeaths:</strong>
            </label>{" "}
            {currentCase.newdeath}
          </div>
              <div>
                <label>
                  <strong>Status:</strong>
                </label>{" "}
                {currentCase.published ? "Published" : "Pending"}
              </div>

              <Link
                to={"/cases/" + currentCase.id}
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