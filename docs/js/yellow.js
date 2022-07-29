var lookup = {};
lookup.customObjects = {};

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
    var toSerialize = {};
    for (const [key, value] of Object.entries(lookup.customObjects)) {
        var toAdd = {};
        for (const [keyInner, valueInner] of Object.entries(value)) {
            if(typeof(valueInner) === 'function')
            {
                toAdd[keyInner] = valueInner();
            }else
            {
                toAdd[keyInner] = valueInner;
            }
        }
        toSerialize[key] = toAdd;
    }
    var data = JSON.stringify(toSerialize);
    localStorage.setItem('customObjects', data);
};

lookup.loadFromStorage = function()
{
    lookup.localStorage = localStorage;
    var stored = localStorage.getItem('customObjects');
    if(typeof(stored) !== 'undefined' && stored != null)
    {
        var parsed = JSON.parse(stored);
        for (const [key, value] of Object.entries(parsed)) 
        {
            lookup.customObjects[value.id] = value;
        }
    }
};

lookup.showLoadedObjects = function()
{
    for (const [key, value] of Object.entries(lookup.customObjects)) 
    {
        lookup.draw_a_point(value);
    }
};

lookup.freeIndex = 0;

lookup.createUIObject = function(offset)
{

    var toAdd = {
        id: lookup.freeIndex,
        offsetX: offset.x,
        offsetY: offset.y
    };
    lookup.freeIndex += 1;

    lookup.customObjects[toAdd.id] = toAdd;
    return toAdd;
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
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    
    if(canvas.width !== document.body.clientWidth ||
        canvas.height !== document.body.clientHeight)
    {
        canvas.width = document.body.clientWidth;
        canvas.height = document.body.clientHeight;
        lookup.showLoadedObjects();
    }
};

lookup.draw_a_point = function(obj)
{
    lookup.mapOfOpenElements[obj.id] = obj;
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");

    ctx.fillStyle = "#FFFF00";
    ctx.fillRect(obj.offsetX, obj.offsetY, 2, 2);
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
    //console.log(event);
    var offset = 
    {
        x: event.pageX,
        y: event.pageY
    };
    
    if(lookup.menuIsOpen())
    {
        lookup.hideMenu();
    }
    else
    {
        lookup.createPoint(offset);

        // create point
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
    var uiObject = lookup.createUIObject(offset);
    lookup.draw_a_point(uiObject);

    var operation = {
        operation: "create-point",
        guid: uiObject.id,
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
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    canvas.width = newValue.width;
    canvas.height = newValue.height;
    lookup.showLoadedObjects();
    console.log("resize");
});



$(document).ready(function()
{
    var viewModel = new Yellow();
    lookup.loadFromStorage();
    lookup.backgroundApplySaved();
    viewModel.ApplyLookupToSelf();
    ko.applyBindings(viewModel);
    lookup.initCanvas();
    lookup.showLoadedObjects();
});


