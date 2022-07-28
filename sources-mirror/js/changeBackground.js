lookup.backgroundColor = ko.observable("#0c4bac");
lookup.foregroundColour = ko.observable("#ffff00");
lookup.changeBackground = function() 
{
    var background = "#333333";
    lookup.backgroundColor(background);
    lookup.localStorage["backgroundColor"] = background;
    event.stopPropagation();
};

lookup.changeBackgroundToDefault = function() 
{
    var background = "#0c4bac";
    lookup.backgroundColor(background);
    lookup.localStorage["backgroundColor"] = background;

    var foreground = "#ffff00";
    lookup.foregroundColour(foreground);
    lookup.localStorage["foregroundColour"] = foreground;
    event.stopPropagation();
};

lookup.backgroundApplySaved = function() 
{
    var background = lookup.localStorage["backgroundColor"] || "#0c4bac";
    lookup.backgroundColor(background);

    var foreground = lookup.localStorage["foregroundColour"] || "#ffff00"; 
    lookup.foregroundColour(foreground);

};