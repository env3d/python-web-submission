
(async function() {


  [
    'cut', 'copy', 'paste'
  ].forEach( eventName => {

    [PWS.editor].forEach( element => {
      element.addEventListener(eventName, e => {
        console.log('Event '+eventName, e);
        if (e.text) {
          e.text='';
        } else {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
        }
        return false;
      });
    });

  });
  
})();
