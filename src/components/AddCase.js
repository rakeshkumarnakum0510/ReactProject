import React, { Component } from "react";
import CaseService from "../services/CaseService";

export default class AddCase extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onChangeNewcase = this.onChangeNewcase.bind(this);
    this.onChangeNewdeath = this.onChangeNewdeath.bind(this);
    this.saveTutorial = this.saveTutorial.bind(this);
    this.newTutorial = this.newTutorial.bind(this);

    this.state = {
      id: null,
      title: "",
      date: "", 
      newcase:0,
      newdeath:0,
      published: false,

      submitted: false
    };
  }

  onChangeTitle(e) {
    this.setState({
      title: e.target.value
    });
  }

  onChangeDate(e) {
    this.setState({
      date: e.target.value
    });
  }

  onChangeNewcase(e) {
    this.setState({
      newcase: e.target.value
    });
  }
  onChangeNewdeath(e) {
    this.setState({
      newdeath: e.target.value
    });
  }

  saveTutorial() {
    var data = {
      title: this.state.title,
      date: this.state.date,
      newcase: this.state.newcase,
      newdeath: this.state.newdeath
    };

    CaseService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          title: response.data.title,
          date: response.data.date,
          newcase: response.data.newcase,
          newdeath: response.data.newdeath,
          published: response.data.published,

          submitted: true
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  newTutorial() {
    this.setState({
      id: null,
      title: "",
      date: "",
      newcase:null,
      newdeath:null,
      published: false,

      submitted: false
    });
  }

  render() {
    return (
      <div className="submit-form">
        {this.state.submitted ? (
          <div>
            <h4>You submitted successfully!</h4>
            <button className="btn btn-success" onClick={this.newTutorial}>
              Add
            </button>
          </div>
        ) : (
          <div>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                placeholder="Country Name"
                className="form-control"
                id="title"
                required
                value={this.state.title}
                onChange={this.onChangeTitle}
                name="title"
              />
            </div>

            <div className="form-group">
              <label htmlFor="date">date</label>
              <input
                type="date"
                className="form-control"
                id="date"
                required
                value={this.state.date}
                onChange={this.onChangeDate}
                name="date"
              />
            </div>
            <div className="form-group">
            <label htmlFor="newcase">Newcase</label>
            <input
              type="number"
              className="form-control"
              id="newcase"
              required
              value={this.state.newcase}
              onChange={this.onChangeNewcase}
              name="newcase"
            />
          </div>
          <div className="form-group">
            <label htmlFor="newdeath">Newdeath</label>
            <input
              type="number"
              className="form-control"
              id="newdeath"
              required
              value={this.state.newdeath}
              onChange={this.onChangeNewdeath}
              name="newdeath"
            />
          </div>

            <button onClick={this.saveTutorial} className="btn btn-success">
              Submit
            </button>
          </div>
        )}
      </div>
    );
  }
}
