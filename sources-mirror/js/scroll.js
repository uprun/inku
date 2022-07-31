if(typeof(lookup) === 'undefined')
{
    lookup = {};
}

lookup.mouseIsDown = false;

lookup.bodyOnPointerDown = function() {
    lookup.createPoint({x: event.pageX, y: event.pageY, start: true, finish: false});
    lookup.mouseIsDown = true;
  };
lookup.bodyOnPointerUp = function() {
    lookup.mouseIsDown = false;
    lookup.createPoint({x: event.pageX, y: event.pageY, start: false, finish: true});
  };

lookup.bodyOnPointerMove = function() 
{
   if(lookup.mouseIsDown) {
    let events = typeof(event.getCoalescedEvents) === "function"? event.getCoalescedEvents() : [event];
    for(let e of events) 
    {
        lookup.createPoint({x: e.pageX, y: e.pageY, start: false, finish: false});
    }
   }
};

lookup.previosTouch = undefined;

lookup.bodyOnTouchEnd = function(e)
{
    console.log("bodyOnTouchEnd");
    lookup.mouseIsDown = false;
    lookup.previosTouch = undefined;
    if(event.changedTouches.length > 0)
    {
      var touch = event.changedTouches[0];
      lookup.createPoint({x: touch.pageX, y: touch.pageY, start: false, finish: true});
    }
};



lookup.bodyOnTouchMove = function()
{
    //console.log(event);
    var touches = event.changedTouches;
    if(touches.length > 0 )
    {
        const clientX = touches[0].clientX;
        const clientY = touches[0].clientY;
        if(typeof(lookup.previosTouch) === "undefined")
        {
            lookup.createPoint({x: clientX, y: clientY, start: true, finish: false});
            lookup.previosTouch = true;
        }
        else
        {
            lookup.createPoint({x: clientX, y: clientY, start: false, finish: false});
        }
    }
};