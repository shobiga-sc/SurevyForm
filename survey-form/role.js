 function initRolePage(){
const link = document.createElement("link");
link.rel = "stylesheet";
link.href = "style.css";
document.head.appendChild(link);

function createDOM(json) {
    if (!json || typeof json !== 'object' || !json.tag)
        return null;

    const element = document.createElement(json.tag);

    for (const key in json) {
        if (key !== 'tag' && key !== 'children' && key !== 'textContent' && !key.startsWith('on')) {
            element.setAttribute(key, json[key]);
        }
    }

    if (json.textContent) {
        element.textContent = json.textContent;
    }

    for (const key in json) {
        if (key.startsWith('on') && typeof json[key] === 'string') {
            const eventName = key.slice(2);
            if (json[key].startsWith("navigateTo")) {
                element.addEventListener(eventName, function () {
                    const url = json[key].match(/\('(.*)'\)/)[1];
                    navigateTo(url);
                });
            } else if (typeof window[json[key]] === 'function') {
                element.addEventListener(eventName, window[json[key]]);
            } else {
                console.warn(`Function ${json[key]} is not defined.`);
            }
        }
    }

    if (json.children && Array.isArray(json.children)) {
        json.children.forEach(jsonChild => {
            const childElement = createDOM(jsonChild);
            if (childElement) {
                element.appendChild(childElement);
            }
        });
    }
    return element;
}

const appContainer = document.getElementById("app");
if (appContainer) {
    const jsonData = [
        {
            "tag": "div",
            "class": "container",
            "children": [
                {
                    "tag": "div",
                    "class": "card",
                    "onclick": "navigateTo('/admin-surveys-list')",
                    "children": [
                        {
                            "tag": "img",
                            "src": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVWpeLXE5ueqnMgrX3GtMLXrcXU236_1Cu1A&s",
                            "alt": "Admin Icon"
                        },
                        {
                            "tag": "h3",
                            "textContent": "Admin"
                        }
                    ]
                },
                {
                    "tag": "div",
                    "class": "card",
                    "onclick": "navigateTo('/surveys-list')",
                    "children": [
                        {
                            "tag": "img",
                            "src": "https://w7.pngwing.com/pngs/4/736/png-transparent-female-avatar-girl-face-woman-user-flat-classy-users-icon-thumbnail.png",
                            "alt": "User Icon"
                        },
                        {
                            "tag": "h3",
                            "textContent": "User"
                        }
                    ]
                }
            ]
        }
    ];

    jsonData.forEach(json => {
        appContainer.appendChild(createDOM(json));
    });
} else {
    console.error("ERROR: #app container not found.");
}
}

document.addEventListener("DOMContentLoaded", () => {
    initRolePage();
});
