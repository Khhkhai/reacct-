import React from "react";
import "./App.css";

// more reading here: https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/class_components/

class App extends React.Component<
  unknown,
  { board: string[][]; firstUser: boolean }
> {
  constructor() {
    super({});
    this.state = {
      board: [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
      ],
      firstUser: false,
    };
  }

  setCell(x: number, y: number) {
    if (this.state.board[x][y] === "") {
      const newBoard = [...this.state.board];
      newBoard[x][y] = this.state.firstUser ? "X" : "O";
      this.setState({
        board: newBoard,
        firstUser: !this.state.firstUser,
      });
    }
  }

  render() {
    return (
      <div className="App">
        <table border={1}>
          {this.state.board.map((row, idx1) => (
            <tr key={idx1}>
              {row.map((_, idx2) => (
                <td onClick={() => this.setCell(idx1, idx2)}>
                  {this.state.board[idx1][idx2]}
                </td>
              ))}
            </tr>
          ))}
        </table>
      </div>
    );
  }
}

export default App;
