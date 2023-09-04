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
let boxCommands = [];

function App() {
  const [buttonText, setButtonText] = useState('');

  function handleSubmit(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();
    // Read the form data
    const form = e.target;
    const formData = new FormData(form);
    // Or you can work with it as a plain object:
    const formJson = Object.fromEntries(formData.entries());
    let type = formJson.myInput;
    try {
      console.log(parsed);
      let triggers = parsed["entity"].filter(o => o.classname === type)
      boxCommands = [];
      console.log(triggers);
      triggers.forEach(trigger => {
        if (trigger.solid[0]) {
          trigger.solid.forEach(solid => {
            boxCommands.push(getBox(solid.side));
          });
        }
        else {
          boxCommands.push(getBox(trigger.solid.side));
        }
      });
      if (boxCommands[0]) {
        setButtonText(<div><p>Copy this text, put it in a config file e.g. box.cfg, bind a key to exec the cfg like bind r "exec box.cfg"</p><p>{boxCommands}</p></div>);
      }
      else {
        setButtonText(<div>nothing found ¯\_(ツ)_/¯</div>)
      }
    } catch (error) {
      console.log(error)
    }

  }
  return (
    <div className="App">
      <header className="App-header">
        <form method="post" onSubmit={handleSubmit}>
          <label>
            Entity type: <input name="myInput" defaultValue="trigger_teleport" />
          </label>
          <p id="examples">
            examples: <br></br>
            func_regenerate <br></br>
            func_nogrenades <br></br>
            trigger_teleport <br></br>
          </p>
          {DragDrop()}
          <button type="submit">box</button>
        </form>
        <text>
          {buttonText}
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

let getBox = (sides) => { //this function was written by an ai, i've no idea how it works
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
  return <div>box {minX} {minY} {minZ} {maxX} {maxY} {maxZ}</div>;
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
