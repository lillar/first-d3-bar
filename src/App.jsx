import { useState } from 'react'
import './App.css'
import * as d3 from "d3"
import { Barplot } from './Barplot'
import { Treemap } from './Treemap'

function App() {
  const [view, setView] = useState("barplot");

  return (
    <div id="center">
      <h1>
        D3 x React course students
      </h1>
      <div className="toggle">
        <button className={view === "barplot" ? "active" : ""} onClick={() => setView("barplot")}>
          Bar
        </button>
        <button className={view === "treemap" ? "active" : ""} onClick={() => setView("treemap")}>
          Treemap
        </button>
      </div>
      <div className="chart-card">
        {view === "barplot" ? < Barplot /> : <Treemap />}
      </div>
      
    </div>
  )
}

export default App
