import React, { Component } from 'react';
import axios from 'axios';
// import { Table, Button } from 'reactstrap';


class App extends Component {

  state = {
    // sensors: []
    message: 'A'
  }

  componentDidMount() {
    // super();

    // this executes a callout
    // this.callApi()
    //   .then(response => {
    //     console.log(response.express)
    //     this.setState({message: response.express})
    //   })
    //   .catch(err => console.log(err));

  }

  // callApi = async () => {
  //   return axios.get('http://localhost:5000/api/mensagem');
  //   // const response = await fetch('/api/mensagem');
  //   // console.log(response)
  //   // const body = await response.json();
  //   // if (response.status !== 200) throw Error(body.message);

  //   // return body;
  // };

  render() {
    return (
      <h1>{this.state.message}</h1>
    );
    // var sensors = this.state.sensors.map(sensor => {
    //   return (
    //     <tr key={sensor.Id}>
    //       <td>{sensor.Id}</td>
    //       <td>{sensor.Name}</td>
    //       <td>
    //         <Button color="success" size="sm" className="mr-2">Edit</Button>
    //         <Button color="danger" size="sm">Delete</Button>
    //       </td>
    //     </tr>
    //   );
    // });
    // return (
    //   <div className="App container">
    //     <Table>

    //       <thead>
    //         <tr>
    //           <th>Id</th>
    //           <th>Name</th>
    //         </tr>
    //       </thead>

    //       <tbody>
    //         {sensors}
    //       </tbody>
          
    //     </Table>
    //   </div>
    // );
  }
}

export default App;
