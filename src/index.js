import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button
      className='square'
      onClick={props.onClick}
      style={props.winningSquare ? { backgroundColor: '#7FFFD4' } : null}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        key={i}
        winningSquare={
          this.props.winner && this.props.winner.winningSquares.includes(i)
        }
      />
    );
  }
  render() {
    var board = [];
    for (var i = 0; i < 3; i++) {
      var row = [];
      for (var j = 0; j < 3; j++) {
        row.push(this.renderSquare(i * 3 + j));
      }
      board.push(
        <div className='board-row' key={i}>
          {row}
        </div>
      );
    }

    return <div>{board}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          location: null,
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      ascending: false,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([
        {
          squares: squares,
          location: i,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const currentHistory = this.state.stepNumber;
    const winner = calculateWinner(current.squares);
    const moves = this.state.ascending
      ? history.map((step, move) => {
          const col = step.location % 3;
          const row = parseInt(step.location / 3);
          const desc = move
            ? 'Go to move #' + move + ` (${col}, ${row})`
            : 'Go to game start';
          return (
            <li key={move}>
              <button
                onClick={() => this.jumpTo(move)}
                style={
                  currentHistory === move
                    ? { fontWeight: 'bold' }
                    : { fontWeight: 'normal' }
                }
              >
                {desc}
              </button>
            </li>
          );
        })
      : history
          .slice()
          .reverse()
          .map((step, move) => {
            move = history.length - move - 1;
            const col = step.location % 3;
            const row = parseInt(step.location / 3);
            const desc = move
              ? 'Go to move #' + move + ` (${col}, ${row})`
              : 'Go to game start';
            return (
              <li key={move}>
                <button
                  onClick={() => this.jumpTo(move)}
                  style={
                    currentHistory === move
                      ? { fontWeight: 'bold' }
                      : { fontWeight: 'normal' }
                  }
                >
                  {desc}
                </button>
              </li>
            );
          });

    let status;
    if (winner) {
      status = 'Winner: ' + winner.winner;
    } else {
      if (this.state.stepNumber === 9) {
        status = 'Draw';
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
    }

    return (
      <div className='game'>
        <div className='game-board'>
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winner={winner}
          />
        </div>
        <div className='game-info'>
          <div>{status}</div>
          Sort:{' '}
          <button
            onClick={() =>
              this.setState({
                ascending: !this.state.ascending,
              })
            }
          >
            {this.state.ascending ? 'ascending' : 'descending'}
          </button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        winningSquares: lines[i],
      };
    }
  }
  return null;
}
