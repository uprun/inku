if(typeof(lookup) === 'undefined')
{
    lookup = {};
}

lookup.mouseIsDown = false;

window.addEventListener("pointerdown", function(e) {
    lookup.createPoint({x: e.pageX, y: e.pageY, start: true, finish: false});
    lookup.mouseIsDown = true;
  });
window.addEventListener("pointerup", function(e) {
    lookup.mouseIsDown = false;
    lookup.createPoint({x: e.pageX, y: e.pageY, start: false, finish: true});
  });
window.addEventListener("pointermove", function(event) {
   if(lookup.mouseIsDown) {
      let events = event.getCoalescedEvents();
      for(let e of events) {
        lookup.createPoint({x: e.pageX, y: e.pageY, start: false, finish: false});
      }
   }
  });