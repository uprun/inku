var lookup = {};

lookup.points = [];

// as of date 2022-07-27
lookup.patreonSupporters = ko.observableArray(
    [
        "Alexander Obenauer",
        "Justin Shaffner"
    ]
);

lookup.operations = [];

lookup.operationsPush = function(some)
{
    lookup.operations.push(some);
    var data = JSON.stringify(lookup.points);
    localStorage.setItem('points', data);
};

lookup.loadFromStorage = function()
{
    lookup.localStorage = localStorage;
    var stored = localStorage.getItem('points');
    if(typeof(stored) !== 'undefined' && stored != null)
    {
        var parsed = JSON.parse(stored);
        lookup.points = parsed;
    }
};

lookup.showLoadedObjects = function()
{
    var k = 0; 
    for(; k < lookup.points.length; k++ )
    {
        lookup.draw_a_point(lookup.points[k]);

    }
};

lookup.freeIndex = 0;

lookup.createUIObject = function(offset)
{
    offset.id = lookup.freeIndex;

    lookup.freeIndex += 1;

    lookup.customObjects[offset.id] = offset;
    return offset;
};




lookup.uuidv4 = function() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  };

lookup.mapOfOpenElements = {};
lookup.closeElement = function(obj)
{
    delete lookup.mapOfOpenElements[obj.id];
};


lookup.initCanvas = function()
{
    lookup.canvas = document.getElementById("myCanvas");
    
    if(lookup.canvas.width !== document.body.clientWidth ||
        lookup.canvas.height !== document.body.clientHeight)
    {
        lookup.canvas.width = document.body.clientWidth;
        lookup.canvas.height = document.body.clientHeight;
        lookup.showLoadedObjects();
    }
};

lookup.canvas = document.getElementById("myCanvas");

lookup.draw_a_point = function(obj)
{
    lookup.mapOfOpenElements[obj.id] = obj;
    var ctx = lookup.canvas.getContext("2d");

    var lineSize = 2;

    // drawing example took from https://stackoverflow.com/questions/5258424/how-to-set-mousemove-update-speed
    // plus https://www.w3schools.com/tags/canvas_linejoin.asp

    if(obj.finish)
    {
        ctx.stroke();
    }
    else
    {
        if(obj.start)
        {
            ctx.beginPath();
            ctx.lineJoin = "round";
            ctx.lineCap = "round";
            ctx.strokeStyle = "#FFFF00";
            ctx.lineWidth = lineSize;
            ctx.moveTo(obj.x, obj.y);
        }
        else
        {
            ctx.lineTo(obj.x, obj.y);
            ctx.stroke();
            ctx.beginPath();
            ctx.lineJoin = "round";
            ctx.lineCap = "round";
            ctx.strokeStyle = "#FFFF00";
            ctx.lineWidth = lineSize;
            ctx.moveTo(obj.x, obj.y);
        }

    }
    
};



lookup.stopPropagation = function()
{
    event.stopPropagation();
};

lookup.bodyKeyDown = function( data, event)
{
    // turns out Firefox has a bug 
    // see https://developer.mozilla.org/en-US/docs/Web/API/Document/keydown_event#ignoring_keydown_during_ime_composition
    if (event.isComposing || event.keyCode === 229) {
        console.log("Fixing composing bug in Firefox")
        return;
    }
    console.log(event.code);
    if(event.code === "Escape")
    {
        lookup.hideMenu();
    }
    if(event.code === "KeyI")
    {
        lookup.toggleMenu();
    }


    if(event.code === "KeyF")
    {
        lookup.toggleFullScreen();
    }

    return true;

};

function Yellow()
{
    var self = this;

    self.ApplyLookupToSelf = function()
    {
        for(var x in lookup)
        {
            self[x] = lookup[x];
        }
    };

};

lookup.bodyOnClick = function(e)
{
    
    var offset = 
    {
        x: event.pageX,
        y: event.pageY,
        start: true,
        finish: false
    };
    
    if(lookup.menuIsOpen())
    {
        lookup.hideMenu();
    }
    else
    {
        lookup.createPoint(offset);
        offset.start = false;
        offset.finish = true;
        lookup.createPoint(offset);
    }
};

lookup.optionsOnClick = function(event)
{
    event.stopPropagation();
};

lookup.infoOnClick = function(event)
{
    event.stopPropagation();
};

lookup.patreonLinkOnClick = function(event)
{
    event.stopPropagation();
};

lookup.emailMeLinkOnClick = function(event)
{
    event.stopPropagation();
};

lookup.githubLinkOnClick = function(event)
{
    event.stopPropagation();
};


lookup.createPoint = function(offset) 
{
    lookup.points.push(offset);
    lookup.draw_a_point(offset);

    var operation = {
        operation: "create-point",
        offset: offset
    };
    lookup.operationsPush(operation);
};


lookup.windowSize = ko.observable(
    {
        width: 1,
        height: 1
    }
)
.extend({ rateLimit: 500 });

lookup.windowSize.subscribe(function(newValue) {
    lookup.canvas.width = newValue.width;
    lookup.canvas.height = newValue.height;
    lookup.showLoadedObjects();
    console.log("resize");
});



$(document).ready(function()
{
    var viewModel = new Yellow();
    lookup.loadFromStorage();
    lookup.backgroundApplySaved();
    lookup.loadLanguageFromStorage();
    viewModel.ApplyLookupToSelf();
    ko.applyBindings(viewModel);
    lookup.initCanvas();
    lookup.showLoadedObjects();
});


