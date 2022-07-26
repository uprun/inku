if(typeof(lookup) === 'undefined')
{
    lookup = {};
}
lookup.globalOffsetX = ko.observable(0.0);
lookup.globalOffsetY = ko.observable(0.0);
lookup.globalOffsetZ = ko.observable(1.0);
lookup.globalMaxX = ko.observable(2048);
lookup.globalMaxY = ko.observable(2048);
lookup.globalMinX = ko.observable(-2048);
lookup.globalMinY = ko.observable(-2048);

lookup.bodyOnWheel = function() {
    
    //console.log(event);
    //lookup.applyMovement(deltaY, deltaX);
  
    //scale += event.deltaY * -0.01;
};

lookup.bodyOnPointerMove = function()
{
    //console.log(event);
    if(event.shiftKey)
    {
        lookup.createPoint({x: event.pageX, y: event.pageY});
    }

    if(event.buttons > 0)
    {
        lookup.createPoint({x: event.pageX, y: event.pageY});
    }

};

lookup.previosTouch = undefined;

lookup.bodyOnTouchMove = function()
{
    //console.log(event);
    var touches = event.changedTouches;
    if(touches.length > 0 )
    {
        const clientX = touches[0].clientX;
        const clientY = touches[0].clientY;
        lookup.createPoint({x: clientX, y: clientY});
    }
};

lookup.bodyOnTouchEnd = function()
{
    lookup.previosTouch = undefined;
};