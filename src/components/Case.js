import React, { Component } from "react";
import CaseService from "../services/CaseService";

export default class Case extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onChangeNewcase = this.onChangeNewcase.bind(this);
    this.onChangeNewdeath = this.onChangeNewdeath.bind(this);
    this.getTutorial = this.getTutorial.bind(this);
    this.updatePublished = this.updatePublished.bind(this);
    this.updateTutorial = this.updateTutorial.bind(this);
    this.deleteTutorial = this.deleteTutorial.bind(this);

    this.state = {
      currentTutorial: {
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
    this.getTutorial(this.props.match.params.id);
  }

  onChangeTitle(e) {
    const title = e.target.value;

    this.setState(function(prevState) {
      return {
        currentTutorial: {
          ...prevState.currentTutorial,
          title: title
        }
      };
    });
  }

  onChangeDate(e) {
    const date = e.target.value;
    
    this.setState(prevState => ({
      currentTutorial: {
        ...prevState.currentTutorial,
        date: date
      }
    }));
  }

  onChangeNewcase(e) {
    const newcase = e.target.value;
    this.setState(prevState => ({
      currentTutorial: {
        ...prevState.currentTutorial,
        newcase: newcase
      }
    }));
  }

  onChangeNewdeath(e) {
    const newdeath = e.target.value;
    this.setState(prevState => ({
      currentTutorial: {
        ...prevState.currentTutorial,
        newdeath: newdeath
      }
    }));
  }

  getTutorial(id) {
    CaseService.get(id)
      .then(response => {
        this.setState({
          currentTutorial: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  updatePublished(status) {
    var data = {
      id: this.state.currentTutorial.id,
      title: this.state.currentTutorial.title,
      date: this.state.currentTutorial.date,
      newcase: this.state.currentTutorial.newcase,
      newdeath: this.state.currentTutorial.newdeath,
      published: status
    };

    CaseService.update(this.state.currentTutorial.id, data)
      .then(response => {
        this.setState(prevState => ({
          currentTutorial: {
            ...prevState.currentTutorial,
            published: status
          }
        }));
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  updateTutorial() {
    CaseService.update(
      this.state.currentTutorial.id,
      this.state.currentTutorial
    )
      .then(response => {
        console.log(response.data);
        this.setState({
          message: "The tutorial was updated successfully!"
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  deleteTutorial() {    
    CaseService.delete(this.state.currentTutorial.id)
      .then(response => {
        console.log(response.data);
        this.props.history.push('/tutorials')
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { currentTutorial } = this.state;

    return (
      <div>
        {currentTutorial ? (
          <div className="edit-form">
            <h4>Country</h4>
            <form>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  value={currentTutorial.title}
                  onChange={this.onChangeTitle}
                />
              </div>
              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  type="text"
                  className="form-control"
                  id="date"
                  value={currentTutorial.date}
                  onChange={this.onChangeDate}
                />
              </div>

              <div className="form-group">
                <label htmlFor="newcase">Newcase</label>
                <input
                  type="number"
                  className="form-control"
                  id="newcase"
                  value={currentTutorial.newcase}
                  onChange={this.onChangeNewcase}
                />
              </div>

              <div className="form-group">
              <label htmlFor="newdeath">Newdeath</label>
              <input
                type="number"
                className="form-control"
                id="newdeath"
                value={currentTutorial.newdeath}
                onChange={this.onChangeNewdeath}
              />
            </div>


              <div className="form-group">
                <label>
                  <strong>Status:</strong>
                </label>
                {currentTutorial.published ? "Published" : "Pending"}
              </div>
            </form>

            {currentTutorial.published ? (
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
              onClick={this.deleteTutorial}
            >
              Delete
            </button>

            <button
              type="submit"
              className="badge badge-success"
              onClick={this.updateTutorial}
            >
              Update
            </button>
            <p>{this.state.message}</p>
          </div>
        ) : (
          <div>
            <br />
            <p>Please click on a Tutorial...</p>
          </div>
        )}
      </div>
    );
  }
}