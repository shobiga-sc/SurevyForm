package com.trustace.googleFormClone.entity;


import jakarta.persistence.Id;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "surveyResponses")
public class SurveyResponses {
    @Id
    private String id;
    private String surveyId;
    private List<QuestionResponse> responses;
    private String status = "NO_ACTION";
    @Data
    public static class QuestionResponse {
        private String questionId;
        private String questionType;
        private String questionValue;
        private Object answer;
        private boolean required;

        public String getQuestionId() {
            return questionId;
        }

        public void setQuestionId(String questionId) {
            this.questionId = questionId;
        }

        public String getQuestionType() {
            return questionType;
        }

        public void setQuestionType(String questionType) {
            this.questionType = questionType;
        }

        public String getQuestionValue() {
            return questionValue;
        }

        public void setQuestionValue(String questionValue) {
            this.questionValue = questionValue;
        }

        public Object getAnswer() {
            return answer;
        }

        public void setAnswer(Object answer) {
            this.answer = answer;
        }

        public boolean isRequired() {
            return required;
        }

        public void setRequired(boolean required) {
            this.required = required;
        }
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSurveyId() {
        return surveyId;
    }

    public void setSurveyId(String surveyId) {
        this.surveyId = surveyId;
    }

    public List<QuestionResponse> getResponses() {
        return responses;
    }

    public void setResponses(List<QuestionResponse> responses) {
        this.responses = responses;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}