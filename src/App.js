import './App.css';
import Grid from "./Grid";
import React from "react";

const initializeGameState = (width, height) => {
    const newGameState = [];
    for(let i = 0; i < height; i++) {
        newGameState.push(Array.from({length: width}, () => Math.floor(Math.random() * 9)+1));
    }
    return newGameState;
}

class App extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            gameState: initializeGameState(5,5),
            startField: undefined,
            endField: undefined,
        };
    }

    combine = () => {
        setTimeout(() => {
            this.setState({
                startField: undefined,
                endField: undefined,
            })
        } ,1000)
    }

    handleClick = (row, col, value) => {
        const activeField = { row, col }
        if(this.state.startField) {
            this.setState({ endField: activeField})
            this.combine()
        } else {
            this.setState({ startField: activeField})
        }

        console.log({row, col, value})
    }

    render () {
        const { startField, endField, gameState } = this.state;
        return (
            <div className="App">
                <h1>GridGame</h1>
                <Grid
                    handleClick={this.handleClick}
                    rows={gameState}
                    startField={startField}
                    endField={endField}
                />
            </div>
        );
    }

}

export default App;
