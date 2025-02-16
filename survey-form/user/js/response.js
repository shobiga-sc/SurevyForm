function initUserResponse(host) {

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = './user/css/response.css';
  document.head.appendChild(link);

  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
  document.head.appendChild(script);

  const jsonData = [
    {
      tag: "div",
      class: "header",
      children: [
        {
          tag: "h1",
          id: "survey-title",
          text: "Survey Form"
        }
      ]
    },
    {
      tag: "form",
      id: "survey-form",
      class: "container",
      children: [
        {
          tag: "button",
          class: "cancel-button",
          onclick: "cancelResponse",
          text: "Cancel"
        },
        {
          tag: "button",
          type: "submit",
          class: "submit-button",
          text: "Submit"
        }
      ]
    },

  ];

  jsonData.forEach(data => {
    document.getElementById("app").appendChild(createElementFromJSON(data));
  });

  function createElementFromJSON(json) {
    if (!json || typeof json !== "object" || !json.tag) return null;

    const element = document.createElement(json.tag);

    for (const key in json) {
      if (key !== 'tag' && !key.startsWith('on') && key !== 'textContent' && key !== 'children') {
        element.setAttribute(key, json[key]);
      }
    }

    if (json.textContent) {
      element.textContent = json.textContent;
    }

    for (const key in json) {
      if (key.startsWith('on') && typeof json[key] === 'string') {
        const eventName = key.slice(2).toLowerCase();
        if (typeof window[json[key]] === 'function') {
          element.addEventListener(eventName, window[json[key]]);
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

  let surveyData = null;

  function getSurvey() {
    const params = new URLSearchParams(window.location.search);
    const surveyId = params.get("id");

    fetch(`${host}/api/surveys/${surveyId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        surveyData = data;

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
          qNumber.className = "qnumber";
          qNumber.textContent = `Question no: ${index + 1}`;
          field.appendChild(qNumber);

         
          let inputWrapper = document.createElement("div");
          inputWrapper.id = "input-wrapper";

          let label = document.createElement("label");
          label.className = "question-label";
          label.textContent = question.questionValue;
          inputWrapper.appendChild(label);

          switch (question.type) {
            case "Paragraph":
              let textarea = document.createElement("textarea");
              textarea.id = `question-${index}`;
              textarea.name = `question-${index}`;
              textarea.placeholder = 'Type contents here';
              inputWrapper.appendChild(textarea);
              break;

            case "MultipleChoice":
              question.additionalProperties.options.forEach((option) => {
                let optionWrapper = document.createElement("label");
                optionWrapper.className = "option";

                let checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.name = `multipleChoice-${index}`;
                checkbox.value = option;

                optionWrapper.appendChild(checkbox);
                optionWrapper.appendChild(document.createTextNode(` ${option}`));
                inputWrapper.appendChild(optionWrapper);
              });
              break;

            case "RadioButton":
              question.additionalProperties.options.forEach((option) => {
                let optionWrapper = document.createElement("label");
                optionWrapper.className = "option";

                let radio = document.createElement("input");
                radio.type = "radio";
                radio.name = `radio-${index}`;
                radio.value = option;
                optionWrapper.appendChild(radio);
                optionWrapper.appendChild(document.createTextNode(` ${option}`));
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

              question.additionalProperties.options.forEach((option) => {
                let optionElement = document.createElement("option");
                optionElement.value = option;
                optionElement.textContent = option;
                select.appendChild(optionElement);
              });

              inputWrapper.appendChild(select);
              break;

            case "FileUpload":
              let fileInput = document.createElement("input");
              fileInput.type = "file";
              fileInput.id = `file-${index}`;
              fileInput.name = `file-${index}`;
              fileInput.accept = "image/png, image/jpeg, image/jpg";

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
              numberInput.id = `number-${index}`;
              inputWrapper.appendChild(numberInput);
              break;

            case "Email":
              let emailInput = document.createElement("textarea");
              emailInput.name = `email-${index}`;
              emailInput.placeholder = "example@domain.com";

              inputWrapper.appendChild(emailInput);
              break;
          }

          let validationMessage = document.createElement("div");
          validationMessage.className = "validation-message";
          validationMessage.id = `validation-${index}`;
          validationMessage.style.color = "red";
          validationMessage.style.display = "none";
          validationMessage.style.marginLeft = "20px";
          validationMessage.style.marginTop = "10px";
          inputWrapper.appendChild(validationMessage);

          const inputElement = inputWrapper.querySelector("input, textarea, select");


          field.appendChild(inputWrapper);

          form.appendChild(field);

          if (question.type === "Paragraph") {
            document.getElementById(`question-${index}`).addEventListener("input", function () {

              validateParagraph(this, question.minSize, question.maxSize, index);

            });
          }

          setTimeout(() => {
            let numberInputElement = document.getElementById(`number-${index}`);
            if (numberInputElement) {

              numberInputElement.addEventListener("input", function () {

                validateNumber(this, question.minSize, question.maxSize, index);
              });
            }
          }, 0);

          if (question.type === "FileUpload") {
            document.getElementById(`file-${index}`).addEventListener("change", function () {
              validateFileSize(this, question.maxSize, index);
            });
          }
        });


        const cancelButton = document.createElement("button");
        cancelButton.className = "cancel-button";
        cancelButton.textContent = "Cancel";
        cancelButton.type = "button";
        cancelButton.addEventListener('click', () => {


          Swal.fire({
            title: "Are you sure?",
            text: "Do you want to cancel submission?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, cancel it!"
          }).then((result) => {
            if (result.isConfirmed) {
              navigateTo(`/surveys-list`)
            }
          });
        }
        );
        form.appendChild(cancelButton);

        const submitButton = document.createElement("button");
        submitButton.type = "submit";
        submitButton.className = "submit-button";
        submitButton.textContent = "Submit";
        form.appendChild(submitButton);

      })
      .catch((error) => console.error("Error:", error));
  }

  function validateParagraph(textarea, minLength, maxLength, index) {
    if (maxLength === null) {
      maxLength = 10000;
    }

    document.getElementById(`question-${index}`).addEventListener("keydown", (event) => {
      if (event.target.value.length >= maxLength && event.key !== "Backspace" && event.key !== "Delete" && !event.ctrlKey) {
        event.preventDefault();
        validationDiv.textContent = `Maximum length should be ${maxLength} characters.`;
        validationDiv.style.display = "block";
      }
    });

    const valueLength = textarea.value.length;
    const validationDiv = document.getElementById(`validation-${index}`);

    if (valueLength < minLength) {
      validationDiv.textContent = `Minimum length should be ${minLength} characters.`;
      validationDiv.style.display = "block";
      return false;
    } else if (valueLength > maxLength) {
      validationDiv.textContent = `Maximum length should be ${maxLength} characters.`;
      validationDiv.style.display = "block";
      return false;
    } else {
      validationDiv.style.display = "none";
      return true;
    }
  }



  function validateEmail(input, index) {
    let value = input.value.trim();
    const validationMessage = document.getElementById(`validation-${index}`);

    if (value === "") {
      validationMessage.textContent = "Email is required";
      validationMessage.style.display = "block";
      return false;
    }

    let atIndex = value.indexOf("@");
    let dotIndex = value.lastIndexOf(".");

    if (atIndex > 0 && dotIndex > atIndex + 1 && dotIndex < value.length - 1) {
      validationMessage.style.display = "none";
      return true;
    } else {
      validationMessage.textContent = "Invalid email format";
      validationMessage.style.display = "block";
      return false;
    }
  }

  function navigateTo(path) {
    if (!path) {
    
      return;
    }
    history.pushState({}, "", path);
    loadPage(path);
  }

  function validateNumber(textarea, minLength, maxLength, index) {
    if (maxLength === null) {
      maxLength = 1000;
    }

    document.getElementById(`number-${index}`).addEventListener("keydown", (event) => {
      if (event.target.value.length >= maxLength && event.key !== "Backspace" && event.key !== "Delete" && !event.ctrlKey) {
        event.preventDefault();
        validationDiv.textContent = `Maximum length should be ${maxLength} digits.`;
        validationDiv.style.display = "block";
      }
    });

    const valueLength = textarea.value.length;
    const validationDiv = document.getElementById(`validation-${index}`);
    if (valueLength < minLength) {
      validationDiv.textContent = `Minimum length should be ${minLength} digits.`;
      validationDiv.style.display = "block";
      return false;
    } else if (valueLength > maxLength) {
      validationDiv.textContent = `Maximum length should be ${maxLength} digits.`;
      validationDiv.style.display = "block";
      return false;
    } else {
      validationDiv.style.display = "none";
      return true;
    }


  }

  function validateFileSize(fileInput, maxSize, index) {

  
    if (maxSize === null || maxSize === undefined) {
        maxSize = 5;
    }

    const validationDiv = document.getElementById(`validation-${index}`);
    
    const file = fileInput.files[0];


    if (file) {
      const maxSizeBytes = maxSize * 1024 * 1024;

      if (file.size > maxSizeBytes) {
        validationDiv.textContent = `Maximum file size allowed is ${maxSize} MB.`;
        validationDiv.style.display = "block";
        fileInput.value = "";
        return false;
      } else {
        validationDiv.style.display = "none";
        return true;
      }
    }
  }

  function validateForm(event) {
   
    let isValid = true;

    surveyData.questions.forEach((question, index) => {
      let value = null;
      let isFilled = true;
      let errorMessage = `Value is required for question ${index + 1}`;
      let element = document.querySelector(`[name="question-${index}"], [name="number-${index}"], [name="email-${index}"], [name="datetime-${index}"], [name="dropdown-${index}"]`);
      if (question.required) {
        switch (question.type) {
          case "Paragraph":
          case "Number":
          case "Email":
          case "DateAndTime":
            value = element?.value?.trim();
            if (!value) isFilled = false;
            break;

          case "MultipleChoice":
            let checkboxes = document.getElementsByName(`multipleChoice-${index}`);
            value = [...checkboxes].filter(cb => cb.checked).map(cb => cb.value);
            if (value.length === 0) isFilled = false;
            break;

          case "RadioButton":
            let radio = document.querySelector(`input[name="radio-${index}"]:checked`);
            value = radio ? radio.value : null;
            if (!value) isFilled = false;
            break;

          case "DropDown":
            value = document.querySelector(`select[name="dropdown-${index}"]`)?.value;
            if (!value) isFilled = false;
            break;

          case "FileUpload":
            let fileInput = document.querySelector(`[name="file-${index}"]`);
            value = fileInput?.files?.length > 0 ? fileInput.files[0].name : null;
            if (!value) isFilled = false;
            break;
        }
      }
      let errorDiv = document.getElementById(`validation-${index}`);
      if (!isFilled) {
        if (errorDiv) {
          errorDiv.textContent = errorMessage;
          errorDiv.style.display = "block";
        }
        isValid = false;
      } else if (errorDiv) {
        errorDiv.style.display = "none";
      }

      if ((question.type === "Number" || question.type === "Paragraph" || question.type === "Email") && (question.isRequired || element.value.trim() !== "")) {
        switch (question.type) {
          case "Number":
            if (!validateNumber(element, question.minSize, question.maxSize, index)) {
              isValid = false;
             
            }
            break;
          case "Paragraph":
            if (!validateParagraph(element, question.minSize, question.maxSize, index)) {
              isValid = false;
             
            }
            break;
          case "FileUpload":
            if (!validateFileSize(element, question.maxSize, index)) { 
              isValid = false;
             
            }
            break;
          case "Email":
            if (!validateEmail(element, index)) {
              isValid = false;
           
            }
            break;
        }
      }
    });

    return isValid;
  }

  document.getElementById("survey-form").addEventListener("submit", function (e) {
    if (!validateForm(e)) {
      e.preventDefault();
      return;
    }

    e.preventDefault();
    if (!surveyData) {
    
      return;
    }

    const responses = [];
    const formElements = e.target.elements;

    surveyData.questions.forEach((question, index) => {

      const response = {
        questionId: `question-${index}`,
        questionType: "",
        questionValue: "",
        answer: "",
        required: false
      };


      response.questionValue = question.questionValue;
      response.required = question.required;
      response.questionType = question.questionType;

      const element = document.querySelector(`input[name="number-${index}"]`)?.value || formElements[`question-${index}`] || formElements[`multipleChoice-${index}`] || formElements[`radio-${index}`] || formElements[`dropdown-${index}`] || formElements[`file-${index}`] || formElements[`datetime-${index}`] || formElements[`email-${index}`];

      if (element) {
        switch (question.type) {
          case "Paragraph":
            response.answer = element.value;
            break;
          case "MultipleChoice":
            response.answer = [];

            const checkboxes = document.querySelectorAll(
              `input[name="multipleChoice-${index}"]:checked`
            );
            checkboxes.forEach((checkbox) => {
              response.answer.push(checkbox.value);
            });
            break;
          case "RadioButton":
            response.answer = formElements[`radio-${index}`]?.value || "";
            break;
          case "DropDown":
            response.answer = formElements[`dropdown-${index}`]?.value || "";
            break;
          case "FileUpload":
            response.answer = formElements[`file-${index}`]?.files[0]?.name || "";
            break;
          case "DateAndTime":
            response.answer = formElements[`datetime-${index}`]?.value || "";
            break;
          case "Number":
            response.answer = formElements[`number-${index}`]?.value || "";
            break;
          case "Email":
            response.answer = formElements[`email-${index}`]?.value || "";
            break;
        }

        responses.push(response);
      }
    });

    const surveyResponse = {
      surveyId: surveyData.id,
      responses: responses,
    };

    fetch(`${host}/api/survey-responses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(surveyResponse),
    })
      .then((response) => response.json())
      .then(data => {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Survey response saved successfully!",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK"
        }).then(() => {
          navigateTo(`/surveys-list`);
        });
      })
      .catch((error) => {
      
        alert("Error submitting survey response. Please try again.");
      });
  });

  getSurvey();


}


