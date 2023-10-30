
(async function() {


  ['contextmenu',
   'click', 'cut', 'copy', 'paste',
   'dragenter', 'dragover', 'dragend',
   'dragstart', 'dragleave', 'drop'
  ].forEach( eventName => {

    [PWS.editor.container, window, document.getElementById('console')].forEach( element => {
      element.addEventListener(eventName, e => {
        console.log('Event '+eventName, e); 
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      });
    });
    PWS.editor.setOption("dragEnabled", false);                                            
  });
  
})();
