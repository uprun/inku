if(typeof(lookup) === 'undefined')
{
    lookup = {};
}

lookup.localization = 
{
    "Hello" : {
        "Ukrainian": "Привіт"
    },
    ': settings': {
        "Ukrainian": ": налаштування"
    },
};

lookup.language = ko.observable("Ukrainian");

lookup.setLanguageToUkrainian = function()
{
    lookup.language("Ukrainian");
    lookup.localStorage["language"] = lookup.language();
};

lookup.buttonClickLanguageToUkrainian = function()
{
    event.stopPropagation();
    lookup.setLanguageToUkrainian();
};

lookup.setLanguageToEnglish = function()
{
    lookup.language("English");
    lookup.localStorage["language"] = lookup.language();
};

lookup.buttonClickLanguageToEnglish = function()
{
    event.stopPropagation();
    lookup.setLanguageToEnglish();
};

lookup.loadLanguageFromStorage = function()
{
    var language = lookup.localStorage["language"];
    if(typeof(language) === "undefined")
    {
        if(typeof(navigator.languages.find(lang => lang === "uk")) !== "undefined")
        {
            lookup.setLanguageToUkrainian();
        }
        else
        {
            lookup.setLanguageToEnglish();
        }

    }
    lookup.language(language);
};

lookup.localize_helper = function(text)
{
    const valueByKey = lookup.localization[text];
    if(typeof(valueByKey) === "undefined")
    {
        return '[key]' + text;
    }
    else
    {
        const language = lookup.language();
        const valueByLang = valueByKey[language];
        if(typeof(valueByLang) !== "undefined")
        {
            return valueByLang;
        }
        else
        {
            if(language === "English")
            {
                return text;
            }
            else
            {
                return '[lang]' + text;
            }

            
        }
    }
};

lookup.calculatedLocalization = ko.computed(function()
{
    var lang = lookup.language();
    var result = (text) => lookup.localize_helper(text);
    return result;
});