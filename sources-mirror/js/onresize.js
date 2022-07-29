if(typeof(lookup) === 'undefined')
{
    lookup = {};
}



lookup.onresize = function()
{
    if(typeof(lookup.windowSize) !== "undefined")
    {
        lookup.windowSize(
            {
                width: document.body.clientWidth,
                height: document.body.clientHeight
            }
        );
    }
};