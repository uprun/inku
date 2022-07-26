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
            lookup.tryRestoreOffsetCoordinates(value);
            lookup.customObjects[value.id] = value;
        }
    }
};

lookup.tryRestoreOffsetCoordinates = function(value)
{
    if(typeof(value.offsetX) === "undefined")
    {
        value.offsetX = ko.observable(0);
    }
    else
    {
        value.offsetX = ko.observable(value.offsetX);
    }
    if(typeof(value.offsetY) === "undefined")
    {
        value.offsetY = ko.observable(0);
    }
    else
    {
        value.offsetY = ko.observable(value.offsetY);
    }
    value.inWorldOffsetX = ko.computed(function()
    {
        return value.offsetX() + lookup.globalOffsetX();
    });

    value.inWorldOffsetY = ko.computed(function()
    {
        return value.offsetY() + lookup.globalOffsetY();
    });
};


lookup.createUIObject = function(offset)
{
    var guid = lookup.uuidv4();
    
    var toAdd = {
        id: guid,
        offsetX: offset.x,
        offsetY: offset.y
    };
    lookup.tryRestoreOffsetCoordinates(toAdd);

    lookup.customObjects[guid] = toAdd;
    return toAdd;
};




lookup.uuidv4 = function() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  };

lookup.listOfOpenElements = ko.observableArray([]);
lookup.mapOfOpenElements = {};
lookup.closeElement = function(obj)
{
    delete lookup.mapOfOpenElements[obj.id];
    lookup.listOfOpenElements.remove(obj);
};

lookup.openElement = function(obj)
{
    lookup.listOfOpenElements.push(obj);
    lookup.mapOfOpenElements[obj.id] = obj;
    console.log("finished openElement");
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
    lookup.openElement(uiObject);

    var operation = {
        operation: "create-point",
        guid: uiObject.id,
        offset: offset
    };
    lookup.operationsPush(operation);
};




$(document).ready(function()
{
    var viewModel = new Yellow();
    lookup.loadFromStorage();
    lookup.backgroundApplySaved();
    viewModel.ApplyLookupToSelf();
    ko.applyBindings(viewModel);
});


