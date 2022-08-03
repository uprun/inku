var lookup = {};

lookup.points = [];

// as of date 2022-07-27
lookup.patreonSupporters = ko.observableArray(
    [
        "Alexander Obenauer",
        "Justin Shaffner"
    ]
);

lookup.operationsPush = function(offset, indexToSave)
{
    var data = JSON.stringify(offset);
    const pointKey = 'page-' + lookup.currentPage() + '-point-' + indexToSave;
    const maxPointKey = 'page-' + lookup.currentPage() + '-last-point';
    localStorage.setItem(pointKey, data);
    localStorage.setItem(maxPointKey, indexToSave);
};
lookup.saveCurrentPage = function() 
{
    localStorage.setItem('current-page', lookup.currentPage());
    localStorage.setItem('max-page', lookup.maxPage());

};

lookup.loadCurrentPage = function()
{
    lookup.localStorage = localStorage;
    const storedPage = parseInt(localStorage.getItem('current-page') || "1", 10);
    lookup.currentPage = ko.observable(storedPage);

    const storedMaxPage = parseInt(localStorage.getItem('max-page') || "1", 10);
    lookup.maxPage = ko.observable(storedMaxPage);
};

lookup.currentPageLastPointIndex = -1;


lookup.loadFromStorage = function()
{
    lookup.localStorage = localStorage;

    const currentPageNumber = lookup.currentPage();
    const maxPointKey = 'page-' + lookup.currentPage() + '-last-point';
    lookup.currentPageLastPointIndex = parseInt(localStorage.getItem(maxPointKey) || "-1", 10);
    if(typeof(lookup.currentPageLastPointIndex) !== "number" ||
        Number.isNaN(lookup.currentPageLastPointIndex) )
    {
        lookup.currentPageLastPointIndex = -1;
    }
    lookup.points = [];
    for (let k = 0; k <= lookup.currentPageLastPointIndex; k++)
    {
        const pointKey = 'page-' + lookup.currentPage() + '-point-' + k;
        var parsed = JSON.parse(localStorage.getItem(pointKey));

        lookup.draw_a_point(parsed);

    }
};

lookup.previousPage = function()
{
    event.stopPropagation();
    var page = lookup.currentPage();
    if(page > 1)
    {
        lookup.currentPage(page - 1);
        lookup.clearScreen();
        lookup.saveCurrentPage();
        lookup.loadFromStorage();
    }
};

lookup.nextPage = function()
{
    event.stopPropagation();
    var page = lookup.currentPage();
    lookup.currentPage(page + 1);
    if(lookup.currentPage() > lookup.maxPage())
    {
        lookup.maxPage(lookup.currentPage());
    }
    lookup.clearScreen();
    lookup.saveCurrentPage();
    lookup.loadFromStorage();
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
    }
};



lookup.canvas = document.getElementById("myCanvas");

lookup.clearScreen = function()
{
    var ctx = lookup.canvas.getContext('2d'); 
    ctx.clearRect(0, 0, lookup.canvas.width, lookup.canvas.height);
};

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
    lookup.draw_a_point(offset);
    lookup.currentPageLastPointIndex += 1;
    lookup.operationsPush(offset, lookup.currentPageLastPointIndex);
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
    lookup.loadFromStorage(0);
    console.log("resize");
});



$(document).ready(function()
{
    var viewModel = new Yellow();
    lookup.loadCurrentPage();
    lookup.backgroundApplySaved();
    lookup.loadLanguageFromStorage();
    viewModel.ApplyLookupToSelf();
    ko.applyBindings(viewModel);
    lookup.initCanvas();
    lookup.loadFromStorage();
});


