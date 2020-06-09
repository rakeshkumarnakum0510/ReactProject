import React, { Component } from "react";
import CaseService from "../services/CaseService";

export default class Case extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onChangeNewcase = this.onChangeNewcase.bind(this);
    this.onChangeNewdeath = this.onChangeNewdeath.bind(this);
    this.getCase = this.getCase.bind(this);
    this.updatePublished = this.updatePublished.bind(this);
    this.updateCase = this.updateCase.bind(this);
    this.deleteCase = this.deleteCase.bind(this);

    this.state = {
      currentCase: {
        id: null,
        title: "",
        date: "",
        newcase:null,
        newdeath:null,
        totalcases:0,
        totaldeaths:0,
        published: false
      },
      message: ""
    };
  }

  componentDidMount() {
    this.getCase(this.props.match.params.id);
  }

  onChangeTitle(e) {
    const title = e.target.value;

    this.setState(function(prevState) {
      return {
        currentCase: {
          ...prevState.currentCase,
          title: title
        }
      };
    });
  }

  onChangeDate(e) {
    const date = e.target.value;
    
    this.setState(prevState => ({
      currentCase: {
        ...prevState.currentCase,
        date: date
      }
    }));
  }

  onChangeNewcase(e) {
    const newcase = e.target.value;
    this.setState(prevState => ({
      currentCase: {
        ...prevState.currentCase,
        newcase: newcase
      }
    }));
  }

  onChangeNewdeath(e) {
    const newdeath = e.target.value;
    this.setState(prevState => ({
      currentCase: {
        ...prevState.currentCase,
        newdeath: newdeath
      }
    }));
  }

  getCase(id) {
    CaseService.get(id)
      .then(response => {
        this.setState({
          currentCase: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  updatePublished(status) {
    var data = {
      id: this.state.currentCase.id,
      title: this.state.currentCase.title,
      date: this.state.currentCase.date,
      newcase: this.state.currentCase.newcase,
      newdeath: this.state.currentCase.newdeath,
      published: status
    };

    CaseService.update(this.state.currentCase.id, data)
      .then(response => {
        this.setState(prevState => ({
          currentCase: {
            ...prevState.currentCase,
            published: status
          }
        }));
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  updateCase() {
    CaseService.update(
      this.state.currentCase.id,
      this.state.currentCase
    )
      .then(response => {
        console.log(response.data);
        this.props.history.push('/cases')
        this.setState({
          message: "The case was updated successfully!"
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  deleteCase() {    
    CaseService.delete(this.state.currentCase.id)
      .then(response => {
        console.log(response.data);
        this.props.history.push('/cases')
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { currentCase } = this.state;

    return (
      <div>
        {currentCase ? (
          <div className="edit-form">
            <h4>Country</h4>
            <form>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  value={currentCase.title}
                  onChange={this.onChangeTitle}
                />
              </div>
              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  type="text"
                  className="form-control"
                  id="date"
                  value={currentCase.date}
                  onChange={this.onChangeDate}
                />
              </div>

              <div className="form-group">
                <label htmlFor="newcase">Newcase</label>
                <input
                  type="number"
                  className="form-control"
                  id="newcase"
                  value={currentCase.newcase}
                  onChange={this.onChangeNewcase}
                />
              </div>

              <div className="form-group">
              <label htmlFor="newdeath">Newdeath</label>
              <input
                type="number"
                className="form-control"
                id="newdeath"
                value={currentCase.newdeath}
                onChange={this.onChangeNewdeath}
              />
            </div>


              <div className="form-group">
                <label>
                  <strong>Status:</strong>
                </label>
                {currentCase.published ? "Published" : "Pending"}
              </div>
            </form>

            {currentCase.published ? (
              <button
                className="badge badge-primary mr-2"
                onClick={() => this.updatePublished(false)}
              >
                UnPublish
              </button>
            ) : (
              <button
                className="badge badge-primary mr-2"
                onClick={() => this.updatePublished(true)}
              >
                Publish
              </button>
            )}

            <button
              className="badge badge-danger mr-2"
              onClick={this.deleteCase}
            >
              Delete
            </button>

            <button
              type="submit"
              className="badge badge-success"
              onClick={this.updateCase}
            >
              Update
            </button>
            <p>{this.state.message }</p>
          </div>
        ) : (
          <div>
            <br />
            <p>Please click on a Case...</p>
          </div>
        )}
      </div>
    );
  }
}