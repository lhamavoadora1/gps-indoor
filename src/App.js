import React, { Component } from 'react';
import axios from 'axios';
import { Table, Button } from 'reactstrap';

class App extends Component {

  constructor() {
    super();
    this.state = {
      sensors: []
    }

    // this executes a callout
    axios.get('http://localhost:3000/sensor').then(response => {
      this.setState({
        sensors: response.data
      })
    });


  }

  render() {
    var sensors = this.state.sensors.map(sensor => {
      return (
        <tr key={sensor.Id}>
          <td>{sensor.Id}</td>
          <td>{sensor.Name}</td>
          <td>
            <Button color="success" size="sm" className="mr-2">Edit</Button>
            <Button color="danger" size="sm">Delete</Button>
          </td>
        </tr>
      );
    });
    return (
      <div className="App container">
        <Table>

          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
            </tr>
          </thead>

          <tbody>
            {sensors}
          </tbody>
          
        </Table>
      </div>
    );
  }
}

export default App;
