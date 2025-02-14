
function initUserSurveysList(){

 
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "/user/css/surveys-list.css";  
  document.head.appendChild(link);
  
  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
  document.head.appendChild(script);


const jsonData = [
    {
        tag: "div",
        class: "container",
        children: [
            {
                tag: "div",
                class: "header",
                children: [
                    {
                        tag: "h1",
                        textContent: "User Dashboard"
                    }
                ]
            },
            {
                tag: "h2",
                class: "sub-header",
                textContent: "List of Surveys"
            },
            {
                tag: "div",
                class: "survey-container",
                id: "survey-container"
            }
        ]
    },
    {
        tag: "button",
        class: "back-btn",
        textContent: "Back",
        onclick: () => navigateTo("/")
    }
];

jsonData.forEach(json => {
    document.getElementById("app").appendChild(createDOM(json));
});


function navigateTo(path) {
    if (!path) {
    
        return;
    }
    history.pushState({}, "", path);
    loadPage(path);
}

function createDOM(json) {
    if (!json || typeof json !== 'object' || !json.tag)
      return null;
  
    const element = document.createElement(json.tag);
  
    for (const key in json) {
      if (key !== 'tag' && key !== 'children' && key != 'textContent' && !key.startsWith('on')) {
        element.setAttribute(key, json[key]);
      }
    }
  
    if (json.textContent) {
      element.textContent = json.textContent;
    }
  
    for (const key in json) {
      if (key.startsWith('on')) {
          const eventName = key.slice(2);
          if (typeof json[key] === "function") {
              element.addEventListener(eventName, json[key]);
          } else if (typeof json[key] === "string" && typeof window[json[key]] === "function") {
              element.addEventListener(eventName, window[json[key]]);
          } 
      }
  }
  
    if (json.children && Array.isArray(json.children)) {
      json.children.forEach(jsonchild => {
        const childElement = createDOM(jsonchild);
  
        if (childElement) {
          element.appendChild(childElement);
        }
      })
    }
    return element;
  }


  function navigateTo(path) {
    if (!path) {
      
        return;
    }
    history.pushState({}, "", path);
    loadPage(path);
}



function viewSurveys() {
    fetch("http://localhost:8080/api/surveys/surveyList", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById("survey-container");
        container.innerHTML = "";

        data.filter(survey => survey.active) 
            .forEach(survey => {
                const card = document.createElement("div");
                card.className = "card";

                const surveyName = document.createElement('h3');
                surveyName.className = 'survey-name';
                surveyName.textContent = survey.name;
                card.appendChild(surveyName);

                const surveyDescription = document.createElement('p');
                surveyDescription.className = 'survey-description';
                surveyDescription.textContent = survey.description;
                card.appendChild(surveyDescription);

                card.onclick = () => {
                  navigateTo(`/response?id=${survey.id}`);
                };
                
                container.appendChild(card);
            });
    })
    .catch(error => console.error("Error:", error));
}

viewSurveys();

}


document.addEventListener("DOMContentLoaded", () => {
    initUserSurveysList();
    setTimeout(viewSurveys, 500); 
});