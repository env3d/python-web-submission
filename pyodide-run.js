
async function runPyodide() {
  
  codeString = PWS.editor.session.getValue();
  output = document.getElementById('text');
  output.innerHTML = '';

  window.pyodide = await getPyodide();
  
  await pyodide.runPythonAsync(codeString);
  PWS.terminal.clear();
}

// we use pyodide to run our tests
async function runTest() {
  
	document.getElementById('loading').style.visibility = 'visible';

  window.pyodide = await loadPyodide();
  
  // Create a fake imports

  pyodide.FS.writeFile('turtle.py', ["from unittest.mock import MagicMock",
                                     "def Turtle():",
                                     "    return MagicMock()"].join('\n'));

  pyodide.FS.writeFile('image.py', ["from unittest.mock import MagicMock",
                                    "import sys",
                                    "import types",                                    
                                    "module_name = 'image'",
                                    "bogus_module = types.ModuleType(module_name)",
                                    "sys.modules[module_name] = bogus_module",
                                    "bogus_module.ImageWin = MagicMock()",
                                    "bogus_module.EmptyImage = MagicMock()",
                                    "bogus_module.FileImage = MagicMock()",
                                    "bogus_module.Image = MagicMock()",
                                    "bogus_module.Pixel = MagicMock()"
                                   ].join('\n'));
  
  // Put the user code into main.py
  pyodide.FS.writeFile('main.py', PWS.editor.session.getValue());
  let mainpkg = pyodide.pyimport('main');

  // Create test.py in filesystem  
  let resp = await fetch(`${PWS.assignmentRoot}/test.py`);
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

	document.getElementById('text').innerHTML = '';
	['errors','failures',''].forEach( (key) => {
	  element = key === '' ? test_result : test_result[key];
	  document.getElementById('text').innerHTML += element.toJs().toString()
	    .replace(/&/g, '&amp;')
	    .replace(/</g, '&lt;')
	    .replace(/>/g, '&gt;')
	    .replace(/"/g, '&quot;');
	});
	
	document.getElementById('loading').style.visibility = 'hidden';
}
