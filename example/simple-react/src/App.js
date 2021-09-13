import logo from './logo.svg';
import './App.css';
import WobblyCanvas from "wobbly-canvas"

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>

        <button onClick={() => WobblyCanvas.open()}>Open</button>
        <button onClick={() => WobblyCanvas.close()}>Close</button>
        <button onClick={() => WobblyCanvas.wiggle()}>Wiggle</button>
        <button onClick={() => WobblyCanvas.color("red")}>Red</button>
        <button onClick={() => WobblyCanvas.color("#ddd")}>White</button>
        <button onClick={() => WobblyCanvas.color("green")}>Green</button>
      </header>
    </div>
  );
}

export default App;
