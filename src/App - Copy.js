import './App.css';
import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
var tokenizer_1 = require("./tokenizer");
var parser_1 = require("./parser");
var transformer_1 = require("./transformer");
function parser(input, options) {
  if (options === void 0) { options = {}; }
  var tokens = (0, tokenizer_1.default)(input);
  var ast = (0, parser_1.default)(tokens);
  return options.ast ? ast : (0, transformer_1.default)(ast);
}
let parsed;
let boxCommands = [0, 0];

function App() {
  const [buttonText, setButtonText] = useState('');
  function handleClick() {
    try {
      let triggers = parsed["entity"].filter(o => o.classname === "trigger_teleport")
      boxCommands = [];
      console.log(triggers);
      triggers.forEach(trigger => {
        //console.log(trigger)
        if (trigger.solid[0]) {
          trigger.solid.forEach(solid => {
            boxCommands.push(getBox(solid.side));
          });
        }
        else {
          boxCommands.push(getBox(trigger.solid.side));
        }
      });
      console.log(boxCommands)

      setButtonText(boxCommands);
    } catch (error) {
      console.log(error)
    }

  }
  return (
    <div className="App">
      <header className="App-header">
        <label>
          Type: <input name="myInput" defaultValue="trigger_teleport" />
        </label>
        <p>
          {DragDrop()}
          <button onClick={handleClick}>convert</button>
        </p>
        <text>
          {buttonText}
          box -9344 -12416 1792 -8192 -10624 1920<br></br>
          box -8192 3840 1536 -6912 4352 1537
        </text>
      </header>
    </div >
  );
}

const fileTypes = ["VMF"];

function string2array(string) {
  const regex = /[()]/g;
  let deParenthesised = string.replace(regex, "");
  return deParenthesised.split(" ");
}

let getBox = (sides) => {
  let minX = Infinity;
  let minY = Infinity;
  let minZ = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let maxZ = -Infinity;

  for (let side of sides) {
    let [a, b, c] = string2array(side.plane).map(Number);
    minX = Math.min(minX, a);
    minY = Math.min(minY, b);
    minZ = Math.min(minZ, c);
    maxX = Math.max(maxX, a);
    maxY = Math.max(maxY, b);
    maxZ = Math.max(maxZ, c);
  }
  return <p>box {minX} {minY} {minZ} {maxX} {maxY} {maxZ}</p>;
};


function DragDrop() {
  const [file, setFile] = useState(null);
  const handleChange = (file) => {
    file.text().then(parsedVMF => {
      parsed = parser(parsedVMF);
    })
    setFile(file);
  };
  return (
    <FileUploader handleChange={handleChange} name="file" types={fileTypes} />
  );
}
export default App;
