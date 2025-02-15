function initResponse(surveyNumber, host) {

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "/admin/css/response-new.css";
  document.head.appendChild(link);

  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
  document.head.appendChild(script);
const jsonData = [
  {
    tag: 'div',
    class: 'container',
    children: [

      {
        tag: 'div',
        class: 'sticky',
        children: [
          {
            tag: 'h1',
            text: 'Survey Responses'
          },
          {
            tag: 'h2',
            id: 'survey-title'
          },
          {
            tag: 'div',
            class: 'summary',
            children: [
              {
                tag: 'p',
                children: [
                  {
                    tag: 'strong',
                    text: 'Total Responses: '
                  },
                  {
                    tag: 'span',
                    id: 'total-responses',
                    text: '0'
                  }
                ]
              },
              {
                tag: 'p',
                children: [
                  {
                    tag: 'strong',
                    text: 'No Action: '
                  },
                  {
                    tag: 'span',
                    id: 'no-action-responses',
                    text: '0'
                  }
                ]
              },
              {
                tag: 'p',
                children: [
                  {
                    tag: 'strong',
                    text: 'Accepted: '
                  },
                  {
                    tag: 'span',
                    id: 'accepted-responses',
                    text: '0'
                  }
                ]
              },
              {
                tag: 'p',
                children: [
                  {
                    tag: 'strong',
                    text: 'Rejected: '
                  },
                  {
                    tag: 'span',
                    id: 'rejected-responses',
                    text: '0'
                  }
                ]
              }
            ]

          }
        ]
      },
      {
        tag: 'div',
        id: 'response-container',
        class: 'response-container'
      }

    ]
  },
  {
    tag: 'button',
    onclick: backBtn,
    class: "back-btn",
    id: "back-btn",
    text: 'Back'
  }
]

jsonData.forEach(data => {
  document.getElementById('app').appendChild(createElementFromJSON(data));

});



function createElementFromJSON(json) {
  if (!json || typeof json !== "object" || !json.tag) return null;

  const element = document.createElement(json.tag);

  for (const key in json) {
    if (key !== 'tag' && !key.startsWith('on') && key !== 'textContent' && key !== 'children') {
      element.setAttribute(key, json[key]);
    }
  }

  if (json.text) {
    element.textContent = json.text;
  }

  for (const key in json) {
    if (key.startsWith('on') && typeof json[key] === 'string') {
      const eventName = key.slice(2);
      if (typeof window[json[key]] === 'function') {
        element.addEventListener(eventName, window[json[key]]);
      }
      else {
        console.warn(`Function ${json[key]} is not defined.`);
      }
    }
  }


  if (json.children && Array.isArray(json.children)) {
    json.children.forEach(childJson => {
      const childElement = createElementFromJSON(childJson);
      if (childElement)
        element.appendChild(childElement);

    });
  }

  return element;

}

function backBtn() {

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  navigateTo(`/form-preview?id=${id}`);

}
setTimeout(() => {
  document.querySelector(".back-btn")?.addEventListener("click", backBtn);
}, 100);


function navigateTo(path) {
 
  if (!path) {
      return;
  }
  history.pushState({}, "", path);
  loadPage(path);
}


const urlParams = new URLSearchParams(window.location.search);
const surveyId = urlParams.get("id");
let surveyData = {}; 
let acceptedCount = 0;
let rejectedCount = 0;

if (surveyId) {
  fetch(`${host}/api/surveys/${surveyId}`)
    .then((response) => response.json())
    .then((data) => {
      surveyData = data; 
      return fetchSurveyResponses(surveyId);
    })
    .catch((error) => console.error("Error fetching survey data:", error));
} else {
  console.error("Survey ID not found in URL");
}

function fetchSurveyResponses(surveyId) {
  return fetch(`${host}/api/survey-responses/survey/${surveyId}`)
    .then(response => response.json())
    .then(data => displaySurveyResponses(data))
    .catch(error => console.error("Error fetching survey responses:", error));
}

let currentPage = 1;
const responsesPerPage = 5;
let responsesData = [];

function displaySurveyResponses(responses) {
  responsesData = responses; 
  updatePagination();
}

function updatePagination() {
  const responseContainer = document.getElementById("response-container");
  responseContainer.innerHTML = "";

  const startIndex = (currentPage - 1) * responsesPerPage;
  const endIndex = startIndex + responsesPerPage;
  const paginatedResponses = responsesData.slice(startIndex, endIndex);

  paginatedResponses.forEach((response, index) => {
    const responseId = response.id || response._id;
    if (!responseId) return;

    const currentStatus = response.status || "NO_ACTION";
    const card = document.createElement("div");
    card.className = "response-card";

    const title = document.createElement("h3");
    title.textContent = `Response ${startIndex + index + 1}`;

    const list = document.createElement("ul");
    list.style.marginLeft = '10px';
    list.style.listStyleType = "square";

    response.responses.forEach((q, ind) => {
      let questionValue = "Question";
      if (surveyData.questions && surveyData.questions[ind]) {
        questionValue = surveyData.questions[ind].questionValue || surveyData.questions[ind].question;
      }

      const listItem = document.createElement("li");
      listItem.innerHTML = `<strong>${questionValue}:</strong><br><span class="answer-text">${Array.isArray(q.answer) ? q.answer.join(", ") : q.answer}</span>`;
      list.appendChild(listItem);
    });

    const toggleContainer = document.createElement("div");
    toggleContainer.className = "toggle-container";

    const toggleLabel = document.createElement("label");
    toggleLabel.className = "toggle-switch";

    const toggleInput = document.createElement("input");
    toggleInput.type = "checkbox";
    toggleInput.className = "toggle-input";
    toggleInput.dataset.id = responseId;
    toggleInput.onchange = function () {
    
      const input = this;
      let status;
      if(this.checked){
        status = 'Accept';
      }
      else
        status = 'Reject';
      
      Swal.fire({
        title: "Are you sure?",
        text: `Do you want to change the status to ${status}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, change status!"
    }).then((result) => {
      if (result.isConfirmed) {
          toggleStatus(input);
          Swal.fire({
              icon: "success",
              title: "Status Updated",
              text: "The status has been changed successfully.",
              confirmButtonColor: "#3085d6"
          });
      } else {
          input.checked = !input.checked; 
      }
  });
    };

    const toggleSlider = document.createElement("span");
    toggleSlider.className = "toggle-slider";

    toggleLabel.appendChild(toggleInput);
    toggleLabel.appendChild(toggleSlider);

    const statusLabel = document.createElement("span");
    statusLabel.className = "status-label";
    statusLabel.textContent =
      currentStatus === "ACCEPTED" ? "Accepted" : currentStatus === "REJECTED" ? "Rejected" : "No Action";

    toggleContainer.appendChild(toggleLabel);
    toggleContainer.appendChild(statusLabel);

    card.appendChild(title);
    card.appendChild(list);
    card.appendChild(toggleContainer);

    if (currentStatus === "ACCEPTED") {
      card.style.borderColor = "green";
      card.querySelector(".toggle-input").checked = true;
    } else if (currentStatus === "REJECTED") {
      card.style.borderColor = "red";
    } else {
      card.style.borderColor = "gray";
    }

    responseContainer.appendChild(card);
  });

  updateCounters();

  renderPaginationControls();
}

function renderPaginationControls() {
  let paginationContainer = document.getElementById("pagination-controls");
  if (!paginationContainer) {
    paginationContainer = document.createElement("div");
    paginationContainer.id = "pagination-controls";
    paginationContainer.style.textAlign = "center";
    paginationContainer.style.marginTop = "20px";
    document.getElementById("app").appendChild(paginationContainer);
  }

  paginationContainer.innerHTML = ""; 

  const totalPages = Math.ceil(responsesData.length / responsesPerPage);

  const prevButton = document.createElement("button");
  prevButton.textContent = "Previous";
  prevButton.className = "prev-button";
  prevButton.style.pointerEvents = currentPage === 1 ? "none" : "auto";
  prevButton.style.opacity = currentPage === 1 ? "0.5" : "1";
  prevButton.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      updatePagination();
    }
  };

  const pageIndicator = document.createElement("span");
  pageIndicator.textContent = ` Page ${currentPage} of ${totalPages} `;

  const nextButton = document.createElement("button");
  nextButton.textContent = "Next";
  nextButton.className = 'next-button';
  nextButton.style.pointerEvents = currentPage === totalPages ? "none" : "auto";
  nextButton.style.opacity = currentPage === totalPages ? "0.5" : "1";

  nextButton.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      updatePagination();
    }
  };

  paginationContainer.appendChild(prevButton);
  paginationContainer.appendChild(pageIndicator);
  paginationContainer.appendChild(nextButton);
}




function toggleStatus(input) {
  const responseId = input.dataset.id;
  const statusLabel = input.parentElement.nextElementSibling;
  const card = input.closest(".response-card");

  let newStatus = "NO_ACTION";


  if (input.checked) {
    newStatus = "ACCEPTED";
    statusLabel.textContent = "Accepted";
    card.style.borderColor = "green";
  } else if (!input.checked) {
    newStatus = "REJECTED";
    statusLabel.textContent = "Rejected";
    card.style.borderColor = "red";
  } else {
    statusLabel.textContent = "No Action";
    card.style.borderColor = "gray";
  }


  fetch(`${host}/api/survey-responses/${responseId}/status?status=${newStatus}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
  })
    .then(response => {
      if (!response.ok) throw new Error("Failed to update status");
      return response.json();
    })
    .then(() => updateCounters())
    .catch(error => console.error("Error updating response status:", error));
}


function updateCounters() {
  fetch(`${host}/api/survey-responses/${surveyId}/status-counts`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  })
    .then(response => response.json())
    .then(data => {
      document.getElementById("no-action-responses").textContent = data.NO_ACTION || 0;
      document.getElementById("accepted-responses").textContent = data.ACCEPTED || 0;
      document.getElementById("rejected-responses").textContent = data.REJECTED || 0;
      document.getElementById("total-responses").textContent = (data.ACCEPTED || 0) + (data.REJECTED || 0) + (data.NO_ACTION || 0);
    })
    .catch(error => console.error("Error fetching response counts:", error));
}
}

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const surveyId = params.get("id");
  if (surveyId) {
      initResponse(surveyId, host);
  } 
});








