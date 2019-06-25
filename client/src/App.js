import React, { Component } from 'react'
import './App.css'

var divStyle = {
  margin: 24,
}

var imgStyle = {
  maxHeight: 200,
}

class App extends Component {
  state = {
    images: [
      { name: '', url: '' }
    ]
  }

  componentDidMount() {
    fetch('/frames')
      .then(res => res.json())
      .then(data => this.setState({ images: data }))
      .catch(error => console.log(error));
  }


  render() {
    return (
      <div className="App">
        <table border="1">
          <tbody>
            {this.state.images.map(
              (frame, i) =>
                <tr key={i} >
                  <td>{frame.name}</td>
                  <td><img src={frame.url} style={imgStyle} /></td>
                </tr>
            )}
          </tbody>

        </table>
      </div>
    )
  }
}

export default App;
