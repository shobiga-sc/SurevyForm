const routes = {
    "/": "role.js", 
    "/admin-surveys-list": "admin/js/admin-surveys-list.js",
    "/surveys-list": "user/js/surveys-list.js",
    "/response": "user/js/response.js",
    "/form-creation": "admin/js/form-creation.js",
    "/form-preview": "admin/js/form-preview.js",
    "/response-new": "admin/js/response-new.js"
};

function loadPage(path) {
 

    const cleanPath = path.split("?")[0]; 

    const scriptPath = routes[cleanPath] || null;
    if (!scriptPath) {
        return;
    }

    const cssPath = `css/${path.replace("/", "")}.css`; 

   
    if (!scriptPath) {
        return;
    }

    const appContainer = document.getElementById("app");
    if (!appContainer) {
        return;
    }
    appContainer.innerHTML = ""; 

    
    const existingScript = document.getElementById("dynamic-script");
    if (existingScript) {
        existingScript.remove();
    }

    document.querySelectorAll("link[rel='stylesheet']").forEach(link => link.remove());
    document.querySelectorAll("style").forEach(style => style.remove());

  
    const newCSS = document.createElement("link");
    newCSS.rel = "stylesheet";
    newCSS.href = cssPath;
    newCSS.setAttribute("data-dynamic", "true");
    newCSS.onerror = () => console.error(`Failed to load CSS: ${cssPath}`);
    document.head.appendChild(newCSS);

   
    if (path === "/" || scriptPath !== "role.js") {
        const script = document.createElement("script");
        script.id = "dynamic-script";
        script.src = scriptPath;
        script.onload = () => {
           

            if (path === "/" && window.initRolePage) {
                initRolePage();
            }

            if (window.initAdminSurveysList && path === "/admin-surveys-list") {
                initAdminSurveysList();
            }

            if (window.initCreateForm && path === "/form-creation") {
                initCreateForm();
            }

            if (window.initPreview && cleanPath === "/form-preview") {
                const params = new URLSearchParams(window.location.search);
                const surveyId = params.get("id");
                initPreview(surveyId);
            }

            if (window.initResponse && cleanPath === "/response-new") {
                const params = new URLSearchParams(window.location.search);
                const surveyId = params.get("id");
                initResponse(surveyId);
            }

            if (window.initUserSurveysList && path === "/surveys-list") {
                initUserSurveysList();
            }

            if (window.initUserResponse && cleanPath === "/response") {
                const params = new URLSearchParams(window.location.search);
                const surveyId = params.get("id");
                initUserResponse(surveyId);
            }

        };
        script.onerror = () => console.error(`Failed to load script: ${scriptPath}. Check file path!`);

        document.body.appendChild(script);
    }
}

function navigateTo(path) {
    history.pushState({}, "", path);
    loadPage(path);
}

window.onpopstate = () => loadPage(window.location.pathname);

document.addEventListener("DOMContentLoaded", () => {
    loadPage(window.location.pathname);
});