// Taken and modified from https://skulpt.org/using.html#html

// output functions are configurable.  This one just appends some text
// to a pre element.
function outputConsole(text) {
  text = text.trim();
  if (text.length > 0) {
    term.write('\r\n');
    term.write(text);
  }

  //var mypre = document.getElementById("console"); 
  //mypre.innerHTML = mypre.innerHTML + text; 
}

function output(text) {
  document.getElementById("output").innerHTML = text;  
}

function builtinRead(x) {
  if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
    throw "File not found: '" + x + "'";
  return Sk.builtinFiles["files"][x];
}

function initSkulpt(){
  //Sk.pre = "console";
  

  console.log('init skulpt');
  Sk.configure( {
    output: output,
    read: builtinRead,
    retainGlobals: true,
    __future__: Sk.python3
  });

  Sk.globals = { __name__: new Sk.builtin.str("__main__")};

  // Setup Turtle 
  (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = 'output';
  (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).width = 0;
  (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).height = 0;
  // Setup image  
  // need to specify the id to a canvas for the
  // builtin 'image' module to work
  Sk.canvas = document.getElementById('output').id;
  Sk.imageProxy = (str) => {
    return str.startsWith('http') ? str :
      window.location.protocol + '//'
      + window.location.host
      + window.location.pathname + '/'
      + window.assignmentRoot + '/' + str;
  };
  
}

// Here's everything you need to run a python program in skulpt
// grab the code from your textarea
// get a reference to your pre element for output
// configure the output function
// call Sk.importMainWithBody()
function runSkulpt(prog) {
  var prog = editor.session.getValue();
  document.getElementById('output').innerHTML = '';

  myPromise = Sk.misceval.asyncToPromise(function() {    
    return Sk.importMainWithBody("<stdin>", false, prog, true);
  });
  myPromise.then(function(mod) {
    console.log('success');
  }, function(err) {
    document.getElementById('output').innerHTML = err.toString();
    console.log(err.toString());
    throw(err);
  });
  /*
  var myPromise = Sk.misceval.asyncToPromise(function() {
    return Sk.importMainWithBody("<stdin>", false, prog, true);
  });
  myPromise.then(function(mod) {
    console.log('success');
  }, function(err) {
    console.log(err.toString());
  });
  */
} 
