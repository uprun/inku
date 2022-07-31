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
    'is a simple drawing app created by Oleksandr Kryvonos, a developer from Odesa, Ukraine.': {
        "Ukrainian": "це простий застосунок для малювання розроблений Олександром Кривоносом, програмістом із міста Одеси, Україна."
    },
    'feel free to e-mail me:': {
        "Ukrainian": "надіслати мені ємейл доволі просто:"
    },
    'Support on Patreon': {
        "Ukrainian": "Пітдримати на Патреоні"
    },
    'Privacy policy': {
        "Ukrainian": "Політика конфіденційності"
    },
    'Full-screen': {
        "Ukrainian": "Повний екран"
    },
    'Source code information:': {
        "Ukrainian": "Інформація про текст програми:"
    },
    'inku': {
        "Ukrainian": "інку"
    },
    'is distributed under MIT license.': {
        "Ukrainian": "розповсюджується за ліцензією МІТ."
    },
    'is an open-source project:': {
        "Ukrainian": "це проєкт із вільним доступом до тексту програми:"
    },
    'Development is supported by:': {
        "Ukrainian": "Розробка підтримується завдяки меценатам:"
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