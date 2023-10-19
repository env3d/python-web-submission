


async function runPyodide() {
  
  codeString = editor.session.getValue();
  output = document.getElementById('output');
  output.innerHTML = '';
  
  window.pyodide = await loadPyodide();
  await pyodide.loadPackage('micropip');
  pyodide.setStdin();
  pyodide.setStdout( { batched: (str) => output.innerHTML += str + '\n' });
  
  pyodide.runPythonAsync(codeString);
}


// we use pyodide to run our tests
async function runTest() {
  
	document.getElementById('loading').style.visibility = 'visible';
	
	window.pyodide = await loadPyodide();
  await pyodide.loadPackage('micropip');
  // Create a fake turtle
  pyodide.FS.writeFile('turtle.py', ["from unittest.mock import MagicMock",
                                     "def Turtle():",
                                     "    return MagicMock()"].join('\n'));
  // Put the user code into main.py
  pyodide.FS.writeFile('main.py',editor.session.getValue());  
  let mainpkg = pyodide.pyimport('main');

  // Create test.py in filesystem  
  let resp = await fetch(`${assignmentRoot}/test.py`);
  let testFileContent = await resp.text();
  pyodide.FS.writeFile('test.py', testFileContent);
  let testpkg = pyodide.pyimport("test");

  // Now we can run all tests
	let runTest = [
	  "import test",
	  "suite = test.unittest.TestLoader().loadTestsFromModule(test)",
	  "result = test.unittest.TextTestRunner().run(suite)"
	].join('\n');	  
	await pyodide.runPythonAsync(runTest);
	
	window.test_result = pyodide.globals.get('result').toJs();

	document.getElementById('output').innerHTML = '';
	['errors','failures',''].forEach( (key) => {
	  element = key === '' ? test_result : test_result[key];
	  document.getElementById('output').innerHTML += element.toJs().toString()
	    .replace(/&/g, '&amp;')
	    .replace(/</g, '&lt;')
	    .replace(/>/g, '&gt;')
	    .replace(/"/g, '&quot;');
	});
	
	document.getElementById('loading').style.visibility = 'hidden';
	term.prompt();
}
