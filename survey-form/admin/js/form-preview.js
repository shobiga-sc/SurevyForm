function initPreview(surveyId) {
 
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "/admin/css/form-preview.css";
  document.head.appendChild(link);

  const jsonData = [
      {
          tag: "div",
          class: "header",
          children: [
              {
                  tag: 'h1',
                  id: 'survey-title',
                  text: 'Survey Form'
              },
              {
                  tag: 'button',
                  id: 'toggle-response-dashboard',
                  class: 'add-button',
                  text: 'See Responses',
                  onclick: seeResponses 
              }
          ]
      },
      {
          tag: 'form',
          id: 'survey-form',
          class: 'container'
      },
      {
          tag: 'button',
          class: "back-btn",
          text: 'Back',
          onclick: backBtn 
      }
  ];

  jsonData.forEach(json => {
      document.getElementById('app').appendChild(createDOM(json));
  });

  getSurvey(surveyId); 
}

function createDOM(json) {
  if (!json || typeof json !== 'object' || !json.tag) return null;

  const element = document.createElement(json.tag);

  for (const key in json) {
      if (key !== 'tag' && key !== 'children' && key !== 'text' && !key.startsWith('on')) {
          element.setAttribute(key, json[key]);
      }
  }

  if (json.text) {
      element.textContent = json.text;
  }

  
  for (const key in json) {
      if (key.startsWith('on') && typeof json[key] === 'function') {
          const eventName = key.slice(2).toLowerCase();
          element.addEventListener(eventName, json[key]);
      }
  }

  if (json.children && Array.isArray(json.children)) {
      json.children.forEach(jsonchild => {
          const childElement = createDOM(jsonchild);
          if (childElement) element.appendChild(childElement);
      });
  }
  return element;
}


function seeResponses() {
  const params = new URLSearchParams(window.location.search);
  const surveyId = params.get("id");
  navigateTo(`/response-new?id=${surveyId}`);

}


function navigateTo(path) {
  
  if (!path) {
    
      return;
  }
  history.pushState({}, "", path);
  loadPage(path);
}

function backBtn() {
 navigateTo(`/admin-surveys-list`);
}

function getSurvey(surveyId) {
  fetch(`http://localhost:8080/api/surveys/${surveyId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
  })
      .then((response) => response.json())
      .then((data) => {
          document.getElementById("survey-title").textContent = data.name;
          const form = document.getElementById("survey-form");
          form.innerHTML = "";

          data.questions.forEach((question, index) => {
              const field = document.createElement("div");
              field.className = "form-field";

              if(question.required){
                const required = document.createElement("p");
                required.textContent = "required *";
                required.className = "required";
                field.appendChild(required);
              }
             

              const qNumber = document.createElement("h4");
              qNumber.className = 'qnumber';
              qNumber.textContent = `Question no: ${index + 1}`;
              field.appendChild(qNumber);

              let inputWrapper = document.createElement("div");
              let label = document.createElement("label");
              label.className = "question-label";
              label.textContent = question.questionValue;
              inputWrapper.appendChild(label);

              switch (question.type) {
                  case "Paragraph":
                      let textarea = document.createElement("textarea");
                      textarea.name = `question-${index}`;
                      textarea.placeholder = 'Type content here';
                      if (question.required) textarea.required = true;
                      inputWrapper.appendChild(textarea);
                      break;
                  case "MultipleChoice":
                      question.additionalProperties.options.forEach(option => {
                          let optionWrapper = document.createElement("div");
                         

                          let checkbox = document.createElement("input");
                          checkbox.type = "checkbox";
                          checkbox.name = `multipleChoice-${index}`;
                          checkbox.value = option;
                          let optionLabel = document.createElement("label");
                          optionLabel.className = "option";
                          optionLabel.appendChild(checkbox);
                          optionLabel.appendChild(document.createTextNode(` ${option}`));
                          optionWrapper.appendChild(optionLabel);
                          inputWrapper.appendChild(optionWrapper);
                      });
                      break;
                  case "RadioButton":
                      question.additionalProperties.options.forEach(option => {
                          let optionWrapper = document.createElement("div");
                          

                          let radio = document.createElement("input");
                          radio.type = "radio";
                          radio.name = `radio-${index}`;
                          radio.value = option;
                          let optionLabel = document.createElement("label");
                          optionLabel.className = "option";
                          optionLabel.appendChild(radio);
                          optionLabel.appendChild(document.createTextNode(` ${option}`));
                          optionWrapper.appendChild(optionLabel);
                          inputWrapper.appendChild(optionWrapper);
                      });
                      break;
                  case "DropDown":
                      let select = document.createElement("select");
                      select.name = `dropdown-${index}`;
                      let defaultOption = document.createElement("option");
                      defaultOption.value = "";
                      defaultOption.textContent = "Select...";
                      select.appendChild(defaultOption);
                      question.additionalProperties.options.forEach(option => {
                          let opt = document.createElement("option");
                          opt.value = option;
                          opt.textContent = option;
                          select.appendChild(opt);
                      });
                      inputWrapper.appendChild(select);
                      break;
                  case "FileUpload":
                      let fileInput = document.createElement("input");
                      fileInput.type = "file";
                      fileInput.name = `file-${index}`;
                      inputWrapper.appendChild(fileInput);
                      break;
                  case "DateAndTime":
                      let dateTimeInput = document.createElement("input");
                      dateTimeInput.type = "datetime-local";
                      dateTimeInput.name = `datetime-${index}`;
                      inputWrapper.appendChild(dateTimeInput);
                      break;
                  case "Number":
                      let numberInput = document.createElement("input");
                      numberInput.type = "number";
                      numberInput.name = `number-${index}`;
                      numberInput.placeholder = "Enter digits here";
                      inputWrapper.appendChild(numberInput);
                      break;
                  case "Email":
                      let emailInput = document.createElement("input");
                      emailInput.type = "email";
                      emailInput.name = `email-${index}`;
                      emailInput.placeholder = "example@domain.com";
                      inputWrapper.appendChild(emailInput);
                      break;
              }

              field.appendChild(inputWrapper);
              form.appendChild(field);
          });
      })
      .catch((error) => console.error("Error:", error));
}


document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const surveyId = params.get("id");
  if (surveyId) {
      initPreview(surveyId);
  } else {
      console.error("No survey ID found in URL");
  }
});
