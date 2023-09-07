import './App.css';
import React, { useState, useRef } from "react";
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
let boxCommandsList = [];
let groups = [];
let disabledList = [];
function App() {
  const [boxLists, setBoxList] = useState('');
  const [checkLists, setCheckLists] = useState([]);
  const ref = useRef([]);

  function refreshChecks(triggers, newDisabled, targets) {
    let allButtons =
      <div>
        <button class="btn btn-outline-primary m-1" onClick={() => Unchecked(triggers, targets)}>Uncheck all</button>
        <button class="btn btn-outline-primary m-1" onClick={() => Checked(triggers, targets)}>Check all</button>
        {generateGroupCheckList(targets, triggers, newDisabled)}
      </div>;
    if (targets[0]) {
      if (targets[0].target) { setCheckLists(allButtons); }
    }
    else { setCheckLists([]); }
    setBoxList(generateBoxes(triggers, newDisabled));
  }
  const Unchecked = (triggers, targets) => {
    try {
      for (let i = 0; i < ref.current.length; i++) {
        ref.current[i].checked = false;
      }
      let newDisabled = [];
      targets.forEach(target => {
        newDisabled.push(target.id);
      })
      disabledList = newDisabled;
      refreshChecks(triggers, newDisabled, targets);
    } catch (error) { }
  }
  const Checked = (triggers, targets) => {
    try {
      for (let i = 0; i < ref.current.length; i++) {
        ref.current[i].checked = true;
      }
      let newDisabled = [];
      disabledList = newDisabled;
      refreshChecks(triggers, newDisabled, targets);
    } catch (error) { }
  }
  function generateGroupCheckList(targets, triggers, disabledList) {
    let groupCheckList = [];
    targets.forEach((target, index) => {
      if (target.target) {
        var checkList = <input class="form-check-input" type="checkbox" value={target.id} id={target.id} GroupId={target.id} name={target.id} ref={(element) => { ref.current[index] = element }}
          onChange={(event) => {
            if (event.target.checked) {
              let newDisabled = disabledList.filter(list => list !== target.id);
              disabledList = newDisabled;
            }
            else {
              disabledList.push(target.id);
            }
            setBoxList(generateBoxes(triggers, disabledList));
          }} defaultChecked />;
        let label = <label class="form-check-label" for={target.id}>{target.target}</label>;
        let formCheckinput = <div class="form-check">{checkList} {label}</div>
        groupCheckList.push(formCheckinput);
      }
    });
    return groupCheckList;
  }
  function DragDrop() {
    // eslint-disable-next-line
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
  function handleSubmit(e) {
    e.preventDefault(); // Prevent the browser from reloading the page
    const form = e.target; // Read the form data
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries()); // Or you can work with it as a plain object:
    let type = formJson.myInput;

    disabledList = [];
    boxCommandsList = [];
    if (boxCommandsList) {
      let triggers = [];
      groups = generateGroups(parsed, type);
      let targets = [];
      if (groups) {
        groups.forEach(group => {
          targets.push({ target: group[0], id: group[2] });
          group[1].forEach(trigger => {
            let triggerCopy = trigger;
            triggerCopy.target = group[0];
            triggerCopy.id = group[2];
            triggers.push(triggerCopy);
          });
        });
      }
      refreshChecks(triggers, disabledList, targets);
    }
  }
  return (
    <div className="App">
      <header className="App-header">
        <div class='container mt-5'>
          <div class="row">
            <div class="col-sm">
              <form method="post" onSubmit={handleSubmit}>
                <div class="form-group">
                  <label for="exampleInputEmail1">Entity type</label>
                  <input name="myInput" defaultValue="trigger_teleport" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="trigger_teleport" />
                </div>
                <p id="examples">
                  examples: <br></br>
                  func_regenerate <br></br>
                  func_nogrenades <br></br>
                  trigger_teleport <br></br>
                </p>
                {DragDrop()}
                <button class="btn btn-primary mb-3 mt-3" type="submit" onClick={Checked}>box</button>
              </form>
              {boxLists}
            </div>
            <div class="col-sm">
              {checkLists}
            </div>
          </div>
        </div>
      </header>
    </div >
  );
}

const fileTypes = ["VMF"];

function generateGroups(parsedVMF, type) {
  let triggers
  try {
    if (type) {
      triggers = parsedVMF["entity"].filter(o => o.classname === type)
    }
    else {
      triggers = parsedVMF["entity"].filter(o => o.classname === "trigger_teleport")
    }
    groups = [];
    triggers.forEach(trigger => {
      if (trigger.solid[0]) {
        groups.push([trigger.target, trigger.solid, trigger.id]);
      }
      else {
        groups.push([trigger.target, [trigger.solid], trigger.id]);
      }
    });
    return groups
  } catch (error) {
    console.log(error)
  }
}

function generateBoxes(triggers, disableList) {
  try {
    boxCommandsList = [];
    triggers.forEach(trigger => {
      if (!disableList.includes(trigger.id)) {
        boxCommandsList.push(getBox(trigger.side));
      }
    });
    if (boxCommandsList[0]) {
      let stringBoxCommands = '';
      boxCommandsList.forEach(box => {
        let bx = box.props.children;
        stringBoxCommands += `box ${bx[1]} ${bx[3]} ${bx[5]} ${bx[7]} ${bx[9]} ${bx[11]}\n`;;
      });
      let copyButton = <button class="btn btn-outline-primary mb-3 mt-3" onClick={() => { navigator.clipboard.writeText(stringBoxCommands); }}>Copy to clipboard</button>
      return <div><p>Copy this text, put it in a config file e.g. box.cfg, <br></br>bind a key to exec the cfg like bind r "exec box.cfg"<br></br>{copyButton}{boxCommandsList}</p></div>;
    }
    else {
      return <div>nothing found ¯\_(ツ)_/¯</div>;
    }
  } catch (error) {
    console.log(error)
  }
}

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


export default App;
