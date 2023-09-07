import React from 'react';
import './App.css';

function App() {
  const [response, setResponse] = React.useState(null);

  const getRequest = async (e) => {
    e.preventDefault();
    try {
      setResponse(null);
      const response = await fetch(process.env.REACT_APP_API_URL)
      if (response.status === 200) {
        const body = await response.json();
        setResponse(body);
      }

    } catch (e) {
      console.log(e);
    }
  };

  const getRequestHeader = async (e) => {
    e.preventDefault();
    try {
      setResponse(null);
      const headers = {
        Auth: 'Este es el header auth',
      };
      const response = await fetch(`${process.env.REACT_APP_API_URL}/header`, {headers})
      if (response.status === 200) {
        const body = await response.json();
        setResponse(body);
      }

    } catch (e) {
      console.log(e);
    }
  };

  const postRequest = async (e) => {
    e.preventDefault();
    try {
      setResponse(null);
      const headers = {
        'content-type': 'application/json'
      }
      const body = {
        "message": "hello body!",
        "type": "json body",
      }
      const response = await fetch(
        process.env.REACT_APP_API_URL,
        { method: 'POST', headers, body: JSON.stringify(body)}
      )
      if (response.status === 200) {
        const body = await response.json();
        setResponse(body);
      }

    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="App">
      <button onClick={getRequest}>Get /</button>
      <button onClick={getRequestHeader}>Get /header</button>
      <button onClick={postRequest}>Post /</button>

      <h1>{JSON.stringify(response)}</h1>
    </div>
  );
}

export default App;
