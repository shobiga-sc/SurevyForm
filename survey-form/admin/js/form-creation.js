function initCreateForm(host) {

    
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/admin/css/form-creation.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
    document.head.appendChild(script);




    const jsonData = [
        {
            tag: "div",
            id: "app",
            children: [
                {
                    tag: "h1",
                    textContent: "Create a New Survey"
                },
                {
                    tag: "div",
                    class: "survey-input",
                    children: [
                        {
                            tag: "input",
                            id: "survey-name",
                            class: "survey-name",
                            placeholder: "Survey Name",
                            oninput: "validateSurveyName"
                        },
                        {
                            tag: "div",
                            class: "survey-name-validate",
                            id: "survey-name-validate",
                            style: "color: red; display: none;"
                        },
                        {
                            tag: "textarea",
                            id: "survey-description",
                            class: "survey-description",
                            placeholder: "Enter the survey description",
                            oninput: "validateDescription"
                        },
                        {
                            tag: "div",
                            class: "survey-description-validate",
                            id: "survey-description-validate",
                            style: "color: red; display: none;"
                        }
                    ]
                },
                {
                    tag: "form",
                    id: "questionForm"
                },
                {
                    tag: "div",
                    class: "button-div",
                    children: [
                        {
                            tag: "button",
                            class: "add-question-btn",
                            textContent: "Add Question",
                            onclick: addQuestion
                        },
                        {
                            tag: "button",
                            class: "save-survey-btn",
                            textContent: "Save Survey",
                            onclick: saveSurvey
                        },
                        {
                            tag: "button",
                            class: "cancel-survey-btn",
                            textContent: "Cancel Survey",
                            onclick: cancelSurvey
                        }
                    ]
                }
            ]
        }
    ];


    jsonData.forEach(json => {
        document.getElementById("app").appendChild(createDOM(json));
    });


    document.getElementById("survey-name").addEventListener("input", validateSurveyName);
    document.getElementById("survey-description").addEventListener("input", validateDescription);

    document.getElementById("survey-name").addEventListener("keydown", (event) => {
        if (event.target.value.length >= 50 && event.key !== "Backspace" && event.key !== "Delete" && !event.ctrlKey) {
            event.preventDefault();
        }
    });

    document.getElementById("survey-description").addEventListener("keydown", (event) => {
        if (event.target.value.length >= 200 && event.key !== "Backspace" && event.key !== "Delete" && !event.ctrlKey) {
            event.preventDefault();
        }
    });

    function createDOM(json) {
        if (!json || typeof json !== 'object' || !json.tag) return null;

        const element = document.createElement(json.tag);

        for (const key in json) {
            if (key !== 'tag' && key !== 'children' && key !== 'textContent') {
                if (key === 'style' && typeof json[key] === 'string') {
                    element.style.cssText = json[key];
                } else if (key.startsWith("on")) {
                    const eventName = key.slice(2);
                    if (typeof window[json[key]] === 'function') {
                        element.addEventListener(eventName, window[json[key]]);
                    } 
                } else {
                    element.setAttribute(key, json[key]);
                }
            }
        }

        if (json.textContent) {
            element.textContent = json.textContent;
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


    function validateSurveyName() {
        const surveyNameInput = document.getElementById("survey-name");
        const surveyNameValidate = document.getElementById("survey-name-validate");

        const data = surveyNameInput.value;

        if (data.length > 0) {
            surveyNameInput.value = data.charAt(0).toUpperCase() + data.slice(1);
        }

        if (data.length === 0) {
            surveyNameValidate.style.display = "block";
            surveyNameValidate.textContent = "Survey name is required";
            return false;
        } else if (data.length < 8) {
            surveyNameValidate.style.display = 'block';
            surveyNameValidate.textContent = "Survey name should have at least 8 characters";
            return false;
        } else if (data.length >= 50) {
            surveyNameValidate.style.display = 'block';
            surveyNameValidate.textContent = "Survey name should not exceed 50 characters";
            return false;
        } else {
            surveyNameValidate.style.display = 'none';
        }

        fetch(`${host}/api/surveys/check-name/${data}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Server error");
                }
                return response.json();
            })
            .then(result => {
                if (result.exists) {
                    surveyNameValidate.textContent = "This survey name is already taken. Please choose another.";
                    surveyNameValidate.style.display = "block";
                } else {
                    surveyNameValidate.style.display = "none";
                }
            })
            .catch(error => {
                surveyNameValidate.textContent = "Error checking survey name. Please try again.";
                surveyNameValidate.style.display = "block";
            });

        return true;
    }

    function validateDescription() {
        const surveyDescription = document.getElementById("survey-description");
        const surveyDescriptionValidate = document.getElementById("survey-description-validate");

        const data = surveyDescription.value;

        if (data.length > 0) {
            surveyDescription.value = data.charAt(0).toUpperCase() + data.slice(1);
        }

        if (data.length === 0) {
            surveyDescriptionValidate.style.display = "block";
            surveyDescriptionValidate.textContent = "Survey description is required";
            return false;
        } else if (data.length < 20) {
            surveyDescriptionValidate.style.display = 'block';
            surveyDescriptionValidate.textContent = "Survey description should have at least 20 characters";
            return false;
        } else if (data.length >= 200) {
            surveyDescriptionValidate.style.display = 'block';
            surveyDescriptionValidate.textContent = "Survey description should not exceed 200 characters";
            return false;
        } else {
            surveyDescriptionValidate.style.display = 'none';
            return true;
        }
    }

    setTimeout(() => {
        document.querySelector(".add-question-btn")?.addEventListener("click", addQuestion);
        document.querySelector(".save-survey-btn")?.addEventListener("click", saveSurvey);
        document.querySelector(".cancel-survey-btn")?.addEventListener("click", cancelSurvey);
    }, 100);
    

    let questions = [];
    function addQuestion() {
        const question = {
            type: "RadioButton",
            questionValue: "",
            required: false,
            additionalProperties: {
                options: []
            }
        };
        questions.push(question);
        renderQuestions();
    }

    function cancelSurvey() {
      

        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to unsave and return?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, unsave and return home!"
        }).then((result) => {
            if (result.isConfirmed) {
                navigateTo("/admin-surveys-list");

            }
        });

    }

    function renderQuestions() {
        const form = document.getElementById("questionForm");
        form.innerHTML = "";

        questions.forEach((question, index) => {
            const container = document.createElement("div");
            container.className = "question-container";

            const question_header = document.createElement("div");
            question_header.className = "question-header";

            const questionTitle = document.createElement("h3");
            questionTitle.textContent = "Question " + (index + 1);

            const questionDelete = document.createElement("div");
            questionDelete.id = "delete-link";
            questionDelete.className = "delete-link";
            questionDelete.title = "Delete Question";
            questionDelete.onclick = function () {
                deleteQuestion(index);
            };

            const deleteIcon = document.createElement("img");
            deleteIcon.setAttribute("src", "../images/dark.png");
            deleteIcon.className = "delete-icon";

            questionDelete.appendChild(deleteIcon);

            question_header.appendChild(questionTitle);
            question_header.appendChild(questionDelete);


            const placeholderField = document.createElement("div");
            placeholderField.className = "placeholder-field";

            const placeholderLabel = document.createElement("label");
            placeholderLabel.textContent = "Question:";

            const placeholderInput = document.createElement("input");
            placeholderInput.type = "text";
            placeholderInput.placeholder = "Enter the Question";
            placeholderInput.value = question.questionValue;
            placeholderInput.oninput = function () {
                updatePlaceholder(index, this.value);
                validateQuestion(this);
            };


            const question_validate = document.createElement("div");
            question_validate.className = "question-validate";
            question_validate.style.color = "red";
            question_validate.style.display = "none";

            placeholderField.appendChild(placeholderLabel);
            placeholderField.appendChild(placeholderInput);
            placeholderField.appendChild(question_validate);


            placeholderInput.addEventListener("keydown", (event) => {
                if (placeholderInput.value.length >= 200 && event.key !== "Backspace" && event.key !== "Delete" && !event.ctrlKey) {
                    event.preventDefault();
                }
            });

            const questionField = document.createElement("div");
            questionField.className = "question-field";

            const questionLabel = document.createElement("label");
            questionLabel.textContent = "Answer Type:";
            questionLabel.style.marginTop = "30px";
            questionLabel.className = "answer-type";


            const questionSelect = document.createElement("select");
            questionSelect.onchange = function () {
                updateType(index, this.value);
            };

            const options = [
                { value: "RadioButton", text: "Radio Button" },
                { value: "MultipleChoice", text: "Multiple Choice" },
                { value: "DropDown", text: "Drop Down" },
                { value: "Paragraph", text: "Paragraph" },
                { value: "FileUpload", text: "File Upload" },
                { value: "DateAndTime", text: "Date and Time" },
                { value: "Number", text: "Number" },
                { value: "Email", text: "Email" },
            ];

            options.forEach(function (opt) {
                const option = document.createElement("option");
                option.value = opt.value;
                option.textContent = opt.text;
                if (question.type === opt.value) {
                    option.selected = true;
                }
                questionSelect.appendChild(option);
            });

            questionField.appendChild(questionLabel);
            questionField.appendChild(questionSelect);

            const optionsField = renderOptionsField(index, question);
            const minMaxFields = renderMinMaxFields(index, question);

            if (optionsField) container.appendChild(optionsField);
            if (minMaxFields) container.appendChild(minMaxFields);

            const requiredField = document.createElement("div");
            requiredField.className = "question-required";

            const requiredLabel = document.createElement("label");
            requiredLabel.textContent = "Required : ";

            const requiredYes = document.createElement("input");
            requiredYes.type = "radio";
            requiredYes.name = "required-" + index;
            requiredYes.value = "true";
            requiredYes.checked = question.required;
            requiredYes.onchange = function () {
                updateRequired(index, true);
            };

            const requiredYesLabel = document.createTextNode(" Yes ");

            const requiredNo = document.createElement("input");
            requiredNo.type = "radio";
            requiredNo.name = "required-" + index;
            requiredNo.value = "false";
            requiredNo.checked = !question.required;
            requiredNo.onchange = function () {
                updateRequired(index, false);
            };

            const requiredNoLabel = document.createTextNode(" No");

            requiredField.appendChild(requiredLabel);
            requiredField.appendChild(requiredYes);
            requiredField.appendChild(requiredYesLabel);
            requiredField.appendChild(requiredNo);
            requiredField.appendChild(requiredNoLabel);

            

            container.appendChild(question_header);
            container.appendChild(placeholderField);
            container.appendChild(questionField);
            if (optionsField) container.appendChild(optionsField);
            if (minMaxFields) container.appendChild(minMaxFields);
            container.appendChild(requiredField);
           

            form.appendChild(container);
        });
    }


    function validateQuestion(inputElement) {
        const question_validate = inputElement.nextElementSibling;
        const data = inputElement.value.trim();

        if (inputElement.value.length > 0) {
            inputElement.value = inputElement.value.charAt(0).toUpperCase() + inputElement.value.slice(1);
        }


        if (data.length === 0) {
            question_validate.style.display = "block";
            question_validate.textContent = "Question is required";
            return false;
        } else if (data.length < 20) {
            question_validate.style.display = "block";
            question_validate.textContent = "Question should have at least 20 characters";
            return false;
        } else if (data.length > 200) {
            question_validate.style.display = "block";
            question_validate.textContent = "Question should not exceed 200 characters";
            inputElement.value = data.slice(0, 200);
            return false;
        } else {
            question_validate.style.display = "none";
            return true;
        }
    }


    function deleteQuestion(index) {
       
        Swal.fire({
            title: "Are you sure?",
            text: `Do you want to delete question ${index + 1} ?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                questions.splice(index, 1);
                renderQuestions();
                Swal.fire("Deleted!", "The question has been removed.", "success");
            }
        });

    }


    function renderOptionsField(index, question) {
        if (["MultipleChoice", "RadioButton", "DropDown"].includes(question.type)) {
            const optionsField = document.createElement("div");
            optionsField.className = "options-field";

            const label = document.createElement("label");
            label.textContent = "Options: ";
            label.style.marginTop = "10px";
            label.style.marginBottom = "20px";
            optionsField.appendChild(label);

            const options_validate = document.createElement('div');
            options_validate.className = `options-validate-${index}`;
            options_validate.style.color = "red";
            options_validate.display = 'none';
            options_validate.id = `options-validate-${index}`;
            optionsField.appendChild(options_validate);
            optionsField.appendChild(label);

            const optionsContainer = document.createElement("div");
            optionsContainer.id = `options-container-${index}`;

            const options = question.additionalProperties.options || [];
            options.forEach((option, optIndex) => {
                const optionItem = document.createElement("div");
                optionItem.className = "option-item";
                optionItem.textContent = `Option: ${optIndex + 1}`;

                const input = document.createElement("input");
                input.type = "text";
                input.value = option;
                input.className = "opiton-input";
                input.oninput = function () {
                    validateOption(input, index, optIndex);
                    updateOption(index, optIndex, this.value);
                };

                const removeButton = document.createElement("button");
                removeButton.type = "button";
                removeButton.textContent = "Remove";
                removeButton.onclick = function () {
                    removeOption(index, optIndex);
                };

                optionItem.appendChild(input);


                const options_length_validate = document.createElement('div');
                options_length_validate.className = `options-length-validate-${index}-${optIndex}`;
                options_length_validate.style.color = "red";
                options_length_validate.display = 'none';
                options_length_validate.id = `options-length-validate-${index}-${optIndex}`;
                optionItem.appendChild(options_length_validate);

                optionItem.appendChild(removeButton);
                optionsContainer.appendChild(optionItem);
            });

            const addButton = document.createElement("button");
            addButton.type = "button";
            addButton.className = "add-option-btn";
            addButton.textContent = "Add Option";
            addButton.style.marginTop = '20px';
            addButton.onclick = function () {
                addOption(index);
            };

            optionsField.appendChild(optionsContainer);
            optionsField.appendChild(addButton);

            return optionsField;
        }
        return null;
    }

    function validateOption(inputElement, index, optIndex) {
        let errorMessage = document.getElementById(`options-length-validate-${index}-${optIndex}`);

        if (!errorMessage) {
            errorMessage = document.createElement("div");
            errorMessage.id = `options-length-validate-${index}-${optIndex}`;
            errorMessage.className = "option-validate";
            errorMessage.style.color = "red";
            errorMessage.style.display = "none";
            inputElement.parentNode.appendChild(errorMessage);
        }

        const data = inputElement.value.trim();

        if (data.length === 0) {
            errorMessage.style.display = "block";
            errorMessage.textContent = "At least 1 value is required.";
            inputElement.style.border = "1px solid red";
            return false;
        }
        else if (data.length > 200) {
            errorMessage.style.display = "block";
            errorMessage.textContent = "Choice value should not exceed 200 characters.";
            inputElement.value = data.slice(0, 200);
            inputElement.style.border = "1px solid red";
            return false;
        } else {
            errorMessage.style.display = "none";
            inputElement.style.border = "";
            return true;
        }
    }


    function validateChoices(question, index) {
        if (["MultipleChoice", "RadioButton", "DropDown"].includes(question.type)) {
            if (!question.additionalProperties.options || question.additionalProperties.options.length < 2) {
                const validationElement = document.getElementById(`options-validate-${index}`);
                if (validationElement) {
                    validationElement.style.display = "block";
                    validationElement.innerHTML = "Minimum 2 choices are needed for this type";

                }
                return false;
            } else {
                const validationElement = document.getElementById(`options-validate-${index}`);
                if (validationElement) {
                    validationElement.style.display = "none";
                }
            }
        }
        return true;
    }



    function validateForm(event) {
        if (!validateSurveyName()) {
            if (event) event.preventDefault();
            return false;
        }
        if (!validateDescription()) {
            if (event) event.preventDefault();
            return false;
        }

        const allQuestions = document.querySelectorAll(".placeholder-field input");

        let isValid = true;
        allQuestions.forEach((input) => {
            if (!validateQuestion(input)) {
                isValid = false;
            }
        });

        questions.forEach((question, index) => {
            if (!validateChoices(question, index)) {
                isValid = false;
            }
        });


        questions.forEach((question, qIndex) => {

            if (["MultipleChoice", "RadioButton", "DropDown"].includes(question.type)) {
                const options = question.additionalProperties.options || [];
                options.forEach((option, optIndex) => {
                    const inputElement = document.querySelector(`#options-container-${qIndex} .option-item:nth-child(${optIndex + 1}) input`);
                    if (inputElement && !validateOption(inputElement, qIndex, optIndex)) {
                        isValid = false;
                    }
                });
            }
        });

        if (!isValid) {
            if (event) event.preventDefault();
            return false;
        }

        if (questions.length < 1) {
            if (event) event.preventDefault();
        

            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "At least one question needs to be added to save the survey!"
            });

            return false;
        }
        return true;
    }


    function renderMinMaxFields(index, question) {
        if (question.type === "Paragraph" || question.type === "Number") {
            const minMaxField = document.createElement("div");
            minMaxField.className = "min-max-field";

            const minLabel = document.createElement("label");
            minLabel.textContent = "Min Length : ";
            const minInput = document.createElement("input");
            minInput.type = "number";
            minInput.value = question.minSize || "";
            minInput.min = "1";
            minInput.oninput = function () {
                updateMinSize(index, this.value);
            };

            const maxLabel = document.createElement("label");
            maxLabel.textContent = "   Max Length : ";
            const maxInput = document.createElement("input");
            maxInput.type = "number";
            maxInput.value = question.maxSize || "";
            maxInput.min = "1";
            maxInput.oninput = function () {
                updateMaxSize(index, this.value);
            };

            minMaxField.appendChild(minLabel);
            minMaxField.appendChild(minInput);
            minMaxField.appendChild(maxLabel);
            minMaxField.appendChild(maxInput);

            return minMaxField;
        } else if (question.type === "FileUpload") {
            const maxFileSizeField = document.createElement("div");
            maxFileSizeField.className = "max-file-size-field";

            const maxLabel = document.createElement("label");
            maxLabel.textContent = "Max File Size (MB):";
            const maxInput = document.createElement("input");
            maxInput.type = "number";
            maxInput.value = question.maxSize || "";
            maxInput.min = "1";
            maxInput.oninput = function () {
                updateMaxSize(index, this.value);
            };

            maxFileSizeField.appendChild(maxLabel);
            maxFileSizeField.appendChild(maxInput);
            return maxFileSizeField;
        }
        return null;
    }


    function updateMinSize(index, value) {
        questions[index].minSize = value ? parseInt(value) : null;
    }

    function updateMaxSize(index, value) {
        questions[index].maxSize = value ? parseInt(value) : null;
    }


    function updateType(index, value) {
        questions[index].type = value;
        if (["MultipleChoice", "RadioButton", "DropDown"].includes(value)) {
            questions[index].additionalProperties.options = [];
        } else {
            delete questions[index].additionalProperties.options;
        }
        renderQuestions();
    }

    function updateRequired(index, value) {
        questions[index].required = value;
    }

    function updatePlaceholder(index, value) {
        questions[index].questionValue = value;
    }

    function addOption(index) {
        questions[index].additionalProperties.options.push("");
        renderQuestions();
    }

    function updateOption(questionIndex, optionIndex, value) {
        questions[questionIndex].additionalProperties.options[optionIndex] = value;
    }

    function removeOption(questionIndex, optionIndex) {

    
        Swal.fire({
            title: "Are you sure?",
            text: `Do you want to delete the Option no: ${optionIndex + 1} for Question: ${questionIndex + 1} ?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                questions[questionIndex].additionalProperties.options.splice(optionIndex, 1);
                renderQuestions();
                Swal.fire("Deleted!", "The option has been removed.", "success");
            }
        });

    }


    function saveSurvey() {
        if (validateForm()) {
            const surveyName = document.getElementById("survey-name").value;
            const surveyDescription = document.getElementById("survey-description").value;
            const survey = { name: surveyName, description: surveyDescription, questions };

            fetch(`${host}/api/surveys`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(survey)
            })
                .then(response => response.json())
                .then(data => {
                    Swal.fire({
                        icon: "success",
                        title: "Success!",
                        text: "Survey saved successfully!",
                        confirmButtonColor: "#3085d6",
                        confirmButtonText: "OK"
                    }).then(() => {
                        navigateTo("/admin-surveys-list");
                    });
                })
                .catch(error => console.error("Error:", error));

        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    initCreateForm(host);
    setTimeout(saveSurvey, 500);
});
