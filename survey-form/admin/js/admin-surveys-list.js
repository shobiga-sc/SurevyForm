
function initAdminSurveysList(host) {

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/admin/css/admin-surveys-list.css";
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
                            textContent: "Admin Dashboard"
                        },
                        {
                            tag: "button",
                            class: "add-button",
                            textContent: "+ Add Survey",
                            onclick: () => navigateTo("/form-creation")
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
                    id: "survey-container",

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
        fetch(`${host}/api/surveys/surveyList`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })
            .then(response => response.json())
            .then(data => {
                const container = document.getElementById("survey-container");
                container.innerHTML = "";

                data.forEach(survey => {
                    const card = document.createElement("div");
                    card.id = `survey-${survey.id}`;
                    card.className = "card";

                    const surveyName = document.createElement('h3');
                    surveyName.className = 'survey-name';
                    surveyName.textContent = survey.name;
                    card.appendChild(surveyName);

                    const surveyDescription = document.createElement('p');
                    surveyDescription.className = 'survey-description';
                    surveyDescription.textContent = survey.description;
                    card.appendChild(surveyDescription);


                    surveyDescription.onclick = () => {
                        navigateTo(`/form-preview?id=${survey.id}`);

                    };

                    const div = document.createElement("div");
                    div.className = "footer-div";


                    const statusButton = document.createElement("button");
                    statusButton.className = `status-toggle-btn ${survey.active ? "active" : "inactive"}`;
                    statusButton.innerHTML = survey.active
                        ? `Active`
                        : `Inactive`;
                    statusButton.title = `Click tp ${survey.active ? "Deactivate" : "Activate"} survey`;

                    statusButton.addEventListener("click", () => {
                        const newStatus = !survey.active;
                        const statusText = newStatus ? "activate" : "deactivate";

                        Swal.fire({
                            title: "Are you sure?",
                            text: `Do you want to ${statusText} this survey named ${survey.name}?`,
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#28a745",
                            cancelButtonColor: "#dc3545",
                            confirmButtonText: `Yes, ${statusText} it!`,
                            cancelButtonText: "Cancel"
                        }).then((result) => {
                            if (result.isConfirmed) {
                                fetch(`${host}/api/surveys/${survey.id}/status`, {
                                    method: "PUT",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ active: newStatus })
                                })
                                    .then(response => {
                                        if (!response.ok) {
                                            throw new Error("Failed to update status");
                                        }
                                        return response.json();
                                    })
                                    .then(updatedSurvey => {
                                        survey.active = updatedSurvey.active;
                                        statusButton.className = `status-toggle-btn ${updatedSurvey.active ? "active" : "inactive"}`;
                                        statusButton.innerHTML = updatedSurvey.active ? `Active` : `Inactive`;

                                        Swal.fire({
                                            title: "Status Updated",
                                            text: `Survey is now ${updatedSurvey.active ? "Active" : "Inactive"}.`,
                                            icon: "success",
                                            confirmButtonText: "OK"
                                        });
                                    })
                                    .catch(error => {
                                        console.error("Error updating status:", error);
                                        Swal.fire({
                                            title: "Error",
                                            text: "Failed to update survey status.",
                                            icon: "error",
                                            confirmButtonText: "OK"
                                        });
                                    });
                            }
                        });
                    });


                    div.appendChild(statusButton);

                    const deleteIcon = document.createElement("img");
                    deleteIcon.setAttribute("src", "../images/dark.png");
                    deleteIcon.title = "Click to delete Survey";
                    deleteIcon.className = "delete-icon";

                    deleteIcon.addEventListener("click", () => {
                        Swal.fire({
                            title: "Are you sure?",
                            text: `Do you want to delete the survey named ${survey.name} along with its responses?`,
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#28a745",
                            cancelButtonColor: "#dc3545",
                            confirmButtonText: "Yes, delete it!",
                            cancelButtonText: "Cancel"
                        }).then((result) => {
                            if (result.isConfirmed) {
                              
                                fetch(`${host}/api/survey-responses/delete/${survey.id}`, {
                                    method: "DELETE",
                                    headers: {
                                        "Content-Type": "application/json"
                                    }
                                })
                                .then((response) => {
                                    if (!response.ok) {
                                        throw new Error("Failed to delete survey responses");
                                    }
                                    return response.json();  
                                })
                                .then(() => {
                                    
                                    return fetch(`${host}/api/surveys/delete/${survey.id}`, {
                                        method: "DELETE",
                                        headers: {
                                            "Content-Type": "application/json"
                                        }
                                    });
                                })
                                .then((response) => {
                                    if (!response.ok) {
                                        throw new Error("Failed to delete survey");
                                    }
                                    return response.json(); 
                                })
                                .then(() => {

                                    const surveyCard = document.getElementById(`survey-${survey.id}`);
                                    if (surveyCard) surveyCard.remove();

                                    Swal.fire({
                                        title: "Survey Deleted",
                                        text: `Survey named ${survey.name} has been deleted along with its responses.`,
                                        icon: "success",
                                        confirmButtonText: "OK"
                                    });
                                })
                                .catch((error) => {
                                    Swal.fire({
                                        title: "Error",
                                        text: error.message,
                                        icon: "error",
                                        confirmButtonText: "OK"
                                    });
                                });
                            }
                        });
                    });
                    
                    div.appendChild(deleteIcon);

                    card.appendChild(div);

                    container.appendChild(card);
                });
            })
            .catch(error => console.error("Error:", error));
    }

    viewSurveys();

}
