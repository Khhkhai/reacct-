import { useState } from "react";
import "./style.css";

let data = [
  [2, null, null, null],
  [null, null, null, null],
  [null, null, null, null],
  [null, null, null, null],
];

function App() {
  const [num, setData] = useState([
    [2, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
  ]);

  const generate = (max: number) => {
    const y = Math.floor(Math.random() * Math.ceil(max));
    const x = Math.floor(Math.random() * Math.ceil(max));
    const newNum = Math.floor(Math.random() * Math.ceil(2));
    console.log("X" + x + " Y" + y + " Num" + (newNum + 1) * 2);
    if (data[y][x] === null) {
      data[y][x] = (newNum + 1) * 2;
    } else {
      generate(4);
    }
  };

  let i, j, count, last;

  const goRightLeft = (direction: number) => {
    // direction=1 right=1 left=-1
    const newData: (number | null)[][] = [
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];
    for (i = 0; i < 4; i++) {
      count = 0;
      for (j = 0; j < 4; j++) {
        const old = data[i][j];
        if (old !== null) {
          newData[i][count] = old;
          data[i][j] = null;
          count++;
        }
      }
    }
    if (direction === 1) {
      for (i = 0; i < 4; i++) {
        count = 3;
        for (j = 0; j < 4; j++) {
          last = newData[i].pop();
          if (last !== null && last !== undefined) {
            data[i][count] = last;
            count--;
          }
        }
      }
    } else if (direction === -1) {
      for (i = 0; i < 4; i++) {
        count = 0;
        for (j = 0; j < 4; j++) {
          last = newData[i].shift();
          if (last !== null && last !== undefined) {
            data[i][count] = last;
            count++;
          }
        }
      }
    }
  };

  const goTopBottom = (direction: number) => {
    // direction=1 bottom=1 top=-1
    const newData: (number | null)[][] = [
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];
    for (i = 0; i < 4; i++) {
      count = 0;
      for (j = 0; j < 4; j++) {
        if (data[j][i] !== null) {
          newData[i][count] = data[j][i];
          data[j][i] = null;
          count++;
        }
      }
    }
    if (direction === 1) {
      for (i = 0; i < 4; i++) {
        count = 3;
        for (j = 0; j < 4; j++) {
          last = newData[i].pop();
          if (last !== null && last !== undefined) {
            data[count][i] = last;
            count--;
          }
        }
      }
    } else if (direction === -1) {
      for (i = 0; i < 4; i++) {
        count = 0;
        for (j = 0; j < 4; j++) {
          last = newData[i].shift();
          if (last !== null && last !== undefined) {
            data[count][i] = last;
            count++;
          }
        }
      }
    }
  };

  const mergeBottom = () => {
    for (i = 0; i < 4; i++) {
      count = 3;
      for (j = 0; j < 3; j++) {
        if (data[count][i] === data[count - 1][i]) {
          const old = data[count][i];
          if (old !== null) {
            data[count][i] = old * 2;
            data[count - 1][i] = null;
          }
        }
        count--;
      }
    }
  };

  const mergeTop = () => {
    for (i = 0; i < 4; i++) {
      count = 0;
      for (j = 0; j < 3; j++) {
        if (data[count][i] === data[count + 1][i]) {
          const old = data[count][i];
          if (old !== null) {
            data[count][i] = old * 2;
            data[count + 1][i] = null;
          }
        }
        count++;
      }
    }
  };

  const mergeLeft = () => {
    for (i = 0; i < 4; i++) {
      count = 0;
      for (j = 0; j < 3; j++) {
        if (data[i][count] === data[i][count + 1]) {
          const old = data[count][i];
          if (old !== null) {
            data[count][i] = old * 2;
            data[i][count + 1] = null;
          }
        }
        count++;
      }
    }
  };

  const mergeRight = () => {
    // top right
    for (i = 0; i < 4; i++) {
      count = 3;
      for (j = 0; j < 3; j++) {
        if (data[i][count] === data[i][count - 1] && data[i][count] !== null) {
          const old = data[count][i];
          if (old !== null) {
            data[count][i] = old * 2;
            data[i][count - 1] = null;
          }
        }
        count--;
      }
    }
  };

  const turnLeft = () => {
    goRightLeft(-1);
    mergeLeft();
    goRightLeft(-1);
    generate(4);
    // changeColor()
    winOrlose();
    setData(data.slice());
    console.log(data);
  };

  const turnRight = () => {
    goRightLeft(1);
    mergeRight();
    goRightLeft(1);
    generate(4);
    // changeColor()
    winOrlose();
    setData(data.slice());
    console.log(data);
  };

  const turnTop = () => {
    goTopBottom(-1);
    mergeTop();
    goTopBottom(-1);
    generate(4);
    // changeColor()
    winOrlose();
    setData(data.slice());
    console.log(data);
  };

  const turnBottom = () => {
    goTopBottom(1);
    mergeBottom();
    goTopBottom(1);
    generate(4);
    // changeColor()
    winOrlose();
    setData(data.slice());
    console.log(data);
  };

  const winOrlose = () => {
    count = 0;

    for (i = 0; i < 4; i++) {
      for (j = 0; j < 4; j++) {
        if (data[i][j] !== null) {
          if (data[i][j] === 2048) {
            alert("You Win!");
            data = [
              [2, null, null, null],
              [null, null, null, null],
              [null, null, null, null],
              [null, null, null, null],
            ];
            setData(data.slice());
          }
          count++;
          if (j !== 3 && data[i][j] === data[i][j + 1]) {
            return;
          }
          if (j !== 3 && data[j][i] === data[j + 1][i]) {
            return;
          }
        } else {
          return;
        }
      }
    }
    if (count === 16) {
      alert("You Lose!");
      data = [
        [2, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
      ];
      setData(data.slice());
    }
  };

  const changeColor = (color: number | null) => {
    if (color === null) {
      return "#cdc1b4";
    } else if (color === 2) {
      return "#eee4da";
    } else if (color === 4) {
      return "#ede0c8";
    } else if (color === 8) {
      return "#f2b179";
    } else if (color === 16) {
      return "#f59563";
    } else if (color === 32) {
      return "#e88367";
    } else if (color === 64) {
      return "#f65e3b";
    } else if (color === 128) {
      return "#edcf72";
    } else if (color === 256) {
      return "#edd063";
    } else if (color === 512) {
      return "#dac64d";
    } else if (color === 1024) {
      return "#deb943";
    } else if (color === 2048) {
      return "#e6c543";
    }
  };

  const fontColor = (num: number | null) => {
    if (num === null || num === 2 || num === 4 || num === 8) {
      return "#645B52";
    } else {
      return "#F7F4EF";
    }
  };

  const font = (num: number) => {
    if (num === 1024 || num === 2048) {
      return "60px";
    } else {
      return "90px";
    }
  };
  const test = () => {
    generate(4);
    console.log(data);
    // goRightLeft(-1)
    goTopBottom(-1);
    mergeTop();
    setData(data);
  };

  const move = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      console.log("right");
      turnRight();
    } else if (e.key === "ArrowLeft") {
      console.log("left");
      turnLeft();
    } else if (e.key === "ArrowUp") {
      console.log("top");
      turnTop();
    } else if (e.key === "ArrowDown") {
      console.log("bottom");
      turnBottom();
    }
  };

  document.onkeydown = move;

  return (
    <div className="column">
      <div className="row">
        <div
          className="box"
          style={{
            background: changeColor(num[0][0]),
            color: fontColor(num[0][0]),
            fontSize: font(num[0][0] || 2048),
          }}
        >
          {num[0][0]}
        </div>
        <div
          className="box"
          style={{
            background: changeColor(num[0][1]),
            color: fontColor(num[0][1]),
            fontSize: font(num[0][1] || 2048),
          }}
        >
          {num[0][1]}
        </div>
        <div
          className="box"
          style={{
            background: changeColor(num[0][2]),
            color: fontColor(num[0][2]),
            fontSize: font(num[0][2] || 2048),
          }}
        >
          {num[0][2]}
        </div>
        <div
          className="box"
          style={{
            background: changeColor(num[0][3]),
            color: fontColor(num[0][3]),
            fontSize: font(num[0][3] || 2048),
          }}
        >
          {num[0][3]}
        </div>
      </div>
      <div className="row">
        <div
          className="box"
          style={{
            background: changeColor(num[1][0]),
            color: fontColor(num[1][0]),
            fontSize: font(num[1][0] || 2048),
          }}
        >
          {num[1][0]}
        </div>
        <div
          className="box"
          style={{
            background: changeColor(num[1][1]),
            color: fontColor(num[1][1]),
            fontSize: font(num[1][1] || 2048),
          }}
        >
          {num[1][1]}
        </div>
        <div
          className="box"
          style={{
            background: changeColor(num[1][2]),
            color: fontColor(num[1][2]),
            fontSize: font(num[1][2] || 2048),
          }}
        >
          {num[1][2]}
        </div>
        <div
          className="box"
          style={{
            background: changeColor(num[1][3]),
            color: fontColor(num[1][3]),
            fontSize: font(num[1][3] || 2048),
          }}
        >
          {num[1][3]}
        </div>
      </div>
      <div className="row">
        <div
          className="box"
          style={{
            background: changeColor(num[2][0]),
            color: fontColor(num[2][0]),
            fontSize: font(num[2][0] || 2048),
          }}
        >
          {num[2][0]}
        </div>
        <div
          className="box"
          style={{
            background: changeColor(num[2][1]),
            color: fontColor(num[2][1]),
            fontSize: font(num[2][1] || 2048),
          }}
        >
          {num[2][1]}
        </div>
        <div
          className="box"
          style={{
            background: changeColor(num[2][2]),
            color: fontColor(num[2][2]),
            fontSize: font(num[2][2] || 2048),
          }}
        >
          {num[2][2]}
        </div>
        <div
          className="box"
          style={{
            background: changeColor(num[2][3]),
            color: fontColor(num[2][3]),
            fontSize: font(num[2][3] || 2048),
          }}
        >
          {num[2][3]}
        </div>
      </div>
      <div className="row">
        <div
          className="box"
          style={{
            background: changeColor(num[3][0]),
            color: fontColor(num[3][0]),
            fontSize: font(num[3][0] || 2048),
          }}
        >
          {num[3][0]}
        </div>
        <div
          className="box"
          style={{
            background: changeColor(num[3][1]),
            color: fontColor(num[3][1]),
            fontSize: font(num[3][1] || 2048),
          }}
        >
          {num[3][1]}
        </div>
        <div
          className="box"
          style={{
            background: changeColor(num[3][2]),
            color: fontColor(num[3][2]),
            fontSize: font(num[3][2] || 2048),
          }}
        >
          {num[3][2]}
        </div>
        <div
          className="box"
          style={{
            background: changeColor(num[3][3]),
            color: fontColor(num[3][3]),
            fontSize: font(num[3][3] || 2048),
          }}
        >
          {num[3][3]}
        </div>
      </div>
      <button onClick={test}>test</button>
    </div>
  );
}

export default App;
