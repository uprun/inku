lookup.privacy_policy_link = ko.computed(function()
{
    if(lookup.platform_is_cordova())
    {
        //&& window.cordova.platformId !== "electron"
        if(lookup.platform_is_cordova_electron_mac())
        {
            return "file:///Applications/WebPad.app/Contents/Resources/app.asar/privacy_policy_mac.html";
        }
        else
        {
            return "file:///android_asset/www/privacy_policy_android.html";
        }
        
    }
    else
    {
        if( typeof(window.location) !== "undefined" &&
            typeof(window.location.href) !== "undefined" && 
            window.location.href.indexOf("https://uprun.github.io/inku") >= 0)
        {
            return "https://uprun.github.io/inku/privacy_policy-web.html"
        }
        else
        {
            return "/privacy_policy.html";
        }

    }
});