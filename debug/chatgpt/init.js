
(async function() {

  let DEBUG = false;
  
  let systemPrompt = `
You are DeveloperBot, powered by GPT-4, a large language model trained by OpenAI. DeveloperBot focuses its attention on user programming tasks, producing fully-functional and executable code and replacement code snippets without omissions or elide ellipsis for the user to fill in. Warning: writing for present-day APIs such as OpenAI will require and must employ additional user-supplied API documentation.
Today’s Date: August 2023
Knowledge Cutoff: September 2021
`;
  
  let basicPrompt = `
Write me 5 examples of simple python functions with any number of input parameters.
Functions must have only 1 line: a return.
the return statement contains a simple expression.
Do not put triple quotes around your code
Output only python code, nothing else
Do not include if in your expressions.
Do not produce examples involving lists.
If a line is not code, comment it.
`;

  let variablePrompt = `
Write me 5 examples of python functions with any number of input parameters.
Functions must have more than 2 lines and a return statement.
Only one value is allowed to be returned.
Do not put triple quotes around your code.
Output only python code, nothing else.
Do not use loops.
Do not include if in your expressions.
Do not produce examples involving lists.
If a line is not code, comment it.
`;

  let turtlePrompt = `
Write me 3 python functions with using the turtle library.
Each function must create it's own turtle.
Each function must hard coded the turtle color.
Each function must have one or more input parameters.
Only use for loops in these functions.
Do not call these functions.
`;
  
  // This is the entire message history
  let messages = [
    {
      "role":"system",
      "content": systemPrompt,
    }
  ];


  async function fetch_gpt(prompt) {
    
    PWS.message('Consulting with ChatGPT...');    

    messages.push( {
      "role": "user",
      "content": prompt
    } );

    let source = SSE('https://learn.operatoroverload.com/~ubuntu/curlgpt.sh', {    
      // let source = SSE('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        // 'Content-type': 'application/json',
        // 'Authorization': `Bearer ${apikey}`,     
      },
      payload: JSON.stringify({
        "model": "gpt-3.5-turbo",
        "temperature": 1,
        "top_p": 1,
        "stream": true,
        "frequency_penalty": 0,
        "presence_penalty": 0,
        "messages": messages
      })
    });

    source.addEventListener('message', event => {
      console.log(event);

      try {
        let data = JSON.parse(event['data']);
        let token = data['choices'][0]['delta']['content'] || '';        
        PWS.editor.session.setValue(PWS.editor.session.getValue()+token);
      } catch (e) {
        console.log('stream most likely ended', e);
        console.log(event);
        source.close();
        messages.push({
          "role": "assistant",
          "content": PWS.editor.session.getValue()
        });
        PWS.editor.session.setValue(parseCode(PWS.editor.session.getValue().split('\n')));
        PWS.message(null);
      }
      
    });
    
    return '';
  }
  
  async function fetch_gpt_nonstream(prompt) {

    // Testing code so we won't need round trip to API    
    if (prompt == null || prompt.length == 0) {
      return new Promise( (resolve, reject) => {
        setTimeout( () => {          
          resolve("Example output from ChatGPT.  asdc a sdc as ca sc esc esc ase ce sc easc eac e c ec s c ec  ac\nExample 1:\n```python\ndef add(a, b):\n    return a + b\n```\n\nExample 2:\n```python\ndef multiply(a, b, c):\n    return a * b * c\n```\n\nExample 3:\n```python\ndef divide(a, b):\n    return a / b\n```\n\nExample 4:\n```python\ndef power(a, b):\n    return a ** b\n```\n\nExample 5:\n```python\ndef concat_strings(a, b, c, d):\n    return a + b + c + d\n```  ".split('\n'));
        }, 1000 );
      });
    };
    
    let apikey='your api key here';

    /*
      curl https://api.openai.com/v1/chat/completions \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $OPENAI_API_KEY" \
      -d '{
      "model": "gpt-3.5-turbo",
      "messages": [{"role": "user", "content": "Write me 10 examples of python functions with one return statement"}],
      "temperature": 0.7
      }'    
    */


    messages.push( {
      "role": "user",
      "content": prompt
    } );

    let resp = await fetch( 'https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${apikey}`  
      },
      body: JSON.stringify({
        "model": "gpt-3.5-turbo",
        "temperature": 1,
        "top_p": 1,
        "frequency_penalty": 0,
        "presence_penalty": 0,
        "messages": messages
      })
    });
    

    let resp_json = await resp.json();
    console.log(resp_json);
    assistant_response = resp_json['choices'][0]['message']['content'];
    messages.push({
      "role": "assistant",
      "content": assistant_response
    });
    return assistant_response.split('\n');          
  }


  // Parse chatgpt output into the coding area
  function parseCode(gpt_output) {    
    let code = [];

    let inCode = false;  
    for (var i=0; i<gpt_output.length; i++) {
      if (gpt_output[i].startsWith('```')) {
        inCode = !inCode;
        code.push("");
        continue;
      }
      
      if (inCode) {
        code.push(gpt_output[i]);
      } else {
        /*
        if (gpt_output[i].length > 0) {
          code.push('# '+gpt_output[i]);
          }
          */
        
        let j = 0;
        let line = gpt_output[i].slice(j, j + 77);
        while (line) {
          j = j + 77;
          code.push( (line.length > 0) ? '# '+ line : '' );
          line = gpt_output[i].slice( j, j + 77);
        }
        
      }
      
    }
    console.log(code);
    return code.join('\n');    
  }
  
  let old_console = document.getElementById('console');
  let container = old_console.parentNode;
  container.removeChild(old_console);
  
  let gpt_console = document.createElement('div');
  gpt_console.id = 'console';
  container.append(gpt_console);

  window.dispatchEvent(new Event('resize'));
  
  let repl = $('#console').terminal(async function(command) {
    console.log(command);
    // No matter how hard I tried, output not consistent  
    let gpt_output = await fetch_gpt(DEBUG ? null : command , true);
    console.log(gpt_output);
    PWS.editor.session.setValue(parseCode(gpt_output));
  }, {
    greetings: ['ChatGPT is here to help'].join('\n'),
    name: 'chatGPT_console',
    prompt: '> ',
  });

  PWS.terminal = repl;
  PWS.terminal.css('--size', PWS.fontsize / 16);  
  repl.set_command('Write me a simple python function that uses the turtle library');

  
})();
