function createTerminal(div_id) {
  
  function runCode(code) {
    if (window.runPython === runSkulpt) {
	    myPromise = Sk.misceval.asyncToPromise(function() {
		    Sk.output = outputConsole;
		    return Sk.importMainWithBody("<stdin>", false, `${code}`, true);
	    });
	    myPromise.then(function(mod) {
		    console.log('success');
		    Sk.output = output;		
		    command = '';
		    term.prompt();
	    }, function(err) {
		    Sk.output = output;
		    term.write('\r\n');
		    term.write(err.toString());
		    command = '';
		    term.prompt();
	    });
    } else if (window.runPython === runPyodide && window.pyodide) {
      console.log('running pyodide');
      pyodide.setStdout( {
        batched: (str) => {
          command = '';
          term.write('\r\n');
          term.write(str);
          term.prompt();
        }
      } );
      pyodide.runPython(code);
      
    }
  };
  
  let term = new Terminal();    

	term.options.fontSize = editorFontSize;
  term.open(document.getElementById(div_id));
	term.prompt = () => {
	  term.write('\r\n>>> ');
	};
	term.write('>>> ');
	command = '';
	term.onData(e => {
	  switch (e) {
    case '\u0003': // Ctrl+C
      term.write('^C');
	    term.prompt();
      break;
    case '\r': // Enter
	    //runCommand(term, command);
	    if (command === 'clear') {
	      command = '';
	      term.prompt();
	      term.clear();	      
	      break;
	    }
	    if (command.length > 0) {
        runCode(command);
	    } else {
	      term.prompt();
	    }
      
      break;
    case '\u007F': // Backspace (DEL)
      // Do not delete the prompt
      if (term._core.buffer.x > 4) {
        term.write('\b \b');
        if (command.length > 0) {
		      command = command.substr(0, command.length - 1);
        }
      }
      break;
    default: // Print all other characters for demo
      if (e >= String.fromCharCode(0x20) && e <= String.fromCharCode(0x7E) || e >= '\u00a0') {
        command += e;
        term.write(e);
      }
    }
  });
  return term;  
}
