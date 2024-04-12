import {resolveObject} from "./Utils";

let GlobalParameters = {
    'site-section': 'MySiteSection',
    'home-page-name': 'MyHomepageName'
};
const Tealium = {
    tags: function (env) {
        if (!env) {
            console.error('[tealium]', 'Tealium env is required');
        }

        if (false === ['dev', 'qa', 'prod'].includes(env)) {
            return null;
        }

        const scriptContent = `
            (function(a,b,c,d){
                a='https://tags.tiqcdn.com/utag/totalms/lenergietoutcompris/${env}/utag.js';
                b=document;c='script';d=b.createElement(c);d.src=a;d.type='text/java'+c;d.async=true;
                a=b.getElementsByTagName(c)[0];a.parentNode.insertBefore(d,a);
            })();`

        const script = () => {
            const script = document.createElement('script');
            script.innerHTML = scriptContent;

            return script;
        }

        return {
            script,
        };
    },
    initialize: function (Globalparams,tealiumEnv) {
        if (Globalparams) {
            const resolveReturn = resolveObject(Globalparams, Object.keys(GlobalParameters));
            if (true !== resolveReturn) {
                console.error('[tealium]', resolveReturn);
                return;
            }
            GlobalParameters = Globalparams;
        }

        const tags = this.tags(tealiumEnv);
        if (null === tags) {
            return;
        }
        document.body.insertBefore(tags.script(), document.body.childNodes[0]);
        window.utag_cfg_ovrd = window.utag_cfg_ovrd || {};
        window.utag_cfg_ovrd.noview = true;
    }
}

const TrackPageView = (moreParams, pageUrl) => {
    window.utag && window.utag.view({
        ...setUtag(calculateDataLayer(pageUrl),moreParams),
    });
}

const TagManager = {
    pushDataLayer: function (eventType, moreParams, pageUrl,siteName) {
        moreParams = {...moreParams, event_type: eventType}
        window.utag && window.utag.link({
                ...setUtag(calculateDataLayer(pageUrl,siteName),moreParams),
            }
        );
    }
}


const setUtag = (calculatedDataLayer, moreParams) => {
    return window.utag_data = {
        ...calculatedDataLayer,
        ...moreParams
    };
}

const calculateDataLayer = (pageUrl,siteName) => {
    const splittedPathNameArray = window.location.pathname.slice(1).split("/").filter(w => !/\d/.test(w));
    let pageSection = null;
    let pageCategory = null;
    let pageName = GlobalParameters['home-page-name'];

    if (splittedPathNameArray[0]) {
        pageName = splittedPathNameArray[0];
    }

    if (splittedPathNameArray[1]) {
        pageName = splittedPathNameArray[1];
        pageCategory = pageSection = splittedPathNameArray[0];
    }

    if (splittedPathNameArray[2]) {
        pageName = splittedPathNameArray[2];
        pageCategory = splittedPathNameArray[1];
    }
    return {
        page_url: pageUrl ? pageUrl : window.location.href,
        site_name: siteName,
        site_section: GlobalParameters['site-section'],
        page_section: pageSection,
        page_category: pageCategory,
        page_name: pageName,
    }
}

export {Tealium, TrackPageView, TagManager};
