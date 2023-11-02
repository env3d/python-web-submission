
// Attach tracking events
(function() {
      
  async function load() {
    
	  // Set the default interactive python runtime
	  PWS.runtime = runSkulpt;
	  PWS.runtest = runTest;
	  ace.require("ace/ext/language_tools");	
    PWS.editor = ace.edit("editor");
	  PWS.editor.setOptions({
	    enableBasicAutocompletion: true
	  });
	  
	  const queryString = window.location.search;
	  const urlParams = new URLSearchParams(queryString);
	  PWS.assignmentRoot = urlParams.get('path') || "labs/lab1";
	  
	  PWS.consoleheight = parseFloat(urlParams.get('consoleheight')) || 0.2;
	  PWS.editorwidth = parseFloat(urlParams.get('editorwidth')) || 0.6;
	  
	  PWS.fontsize = parseInt(urlParams.get('fontsize')) || 12;
	  PWS.editor.setFontSize(PWS.fontsize);
	  document.getElementById('output').style.fontSize = PWS.fontsize+"px";
    
	  let hashParams = location.hash !== '' ?
	      new URLSearchParams(location.hash.slice(1)) :
	      new URLSearchParams();
	  PWS.launch_id = hashParams.get('launch_id');
	  PWS.tool_base = hashParams.get('tool_base');
	  
	  // history.pushState(null, null, `${window.location.pathname}?path=${PWS.assignmentRoot}`);	

	  PWS.editor.setAutoScrollEditorIntoView(true);
	  PWS.editor.setTheme("ace/theme/monokai");
    PWS.editor.session.setUseWrapMode(true);
	  PWS.editor.session.setMode("ace/mode/python");

	  let staticWordCompleter = {
	    getCompletions: function(editor, session, pos, prefix, callback) {
	      wordList = [];
	      if (Sk.globals) {
	        wordList = Object.keys(Sk.globals).concat(Object.keys(Sk.builtins));
	      }	    
        callback(null, wordList.map(function(word) {
          return {
		        caption: word,
		        value: word,
		        meta: "static"
          };
        }));
	      
	    }
	  };
	  PWS.editor.completers = [staticWordCompleter];
	  PWS.editor.container.addEventListener('change', e => {
	    // autosave
	    localStorage.setItem(`${PWS.assignmentRoot}/main.py`, PWS.editor.session.getValue());
	  });

	  let r = await fetch(PWS.assignmentRoot+"/main.py", {method: 'HEAD'});    
    if (r.status == 200) {
	    code = localStorage.getItem(`${PWS.assignmentRoot}/main.py`);
      PWS.editor.session.setValue(code);	
	    if ( code == null ) {
	      let resp = await fetch(PWS.assignmentRoot+"/main.py");
	      let code = await resp.text();
        PWS.editor.session.setValue(code);     	  
	    }
    }

	  r = await fetch(PWS.assignmentRoot+"/test.py", {method: 'HEAD'});
	  if (r.status != 200) {
	    document.getElementById('test').style.visibility = 'hidden';
	  }
	  
	  r = await fetch(PWS.assignmentRoot+"/init.js", {method: 'HEAD'});	
	  if (r.status == 200) {
	    let node = document.createElement('script');
	    node.src = PWS.assignmentRoot+"/init.js";
	    document.body.append(node);
	  }	

    PWS.terminal.css('--size', PWS.fontsize / 12);
	  document.getElementById('loading').style.visibility = 'hidden';
    resize();
  }

  
  function resize() {
	  // adjust the width of the editor and container
	  let editorWidth = window.getComputedStyle(document.getElementById('editor')).width.replace('px','');	
	  let containerWidth = window.getComputedStyle(document.getElementById('container')).width.replace('px','');
	  document.getElementById('editor').style.width = (containerWidth * PWS.editorwidth)+'px';
	  document.getElementById('output').style.width = (containerWidth * (1 - PWS.editorwidth))+'px';
	  //document.getElementById('output').style.width = (containerWidth-editorWidth)+'px';
	  
	  let containerHeight = window.getComputedStyle(document.getElementById('container')).height.replace('px','');
	  // adjust the height of all the major elements: run, test, editor, output, console	
	  document.getElementById('run').style.height = (containerHeight * 0.05)+'px';	
	  document.getElementById('test').style.height = (containerHeight * 0.05)+'px';		
	  document.getElementById('output').style.height = (containerHeight * (0.9 - PWS.consoleheight) )+'px';
	  document.getElementById('output').style.margin = 0;
	  document.getElementById('editor').style.height = (containerHeight * (0.9 - PWS.consoleheight) )+'px';		
	  document.getElementById('console').style.height = (containerHeight * PWS.consoleheight)+'px';	
  }

  window.addEventListener( 'resize', resize);
  window.addEventListener( 'load', load);  
  
  window.addEventListener( 'blur', (evt) => {
    // TODO: we can now log or warn users using these events
    // PWS.message('you cannot swtich to a different window during exam', true);
    console.log('you cannot swtich to a different window during exam');
  });
  
  window.addEventListener( 'focus', (evt) => {
    // TODO: we can now log or warn users using these events    
    console.log('returning from somewhere else');
  });

  
})();
