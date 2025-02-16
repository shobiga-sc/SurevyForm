package com.trustace.googleFormClone.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "surveys")
public class Survey {
    @Id
    private String id;
    private String name;
    private String description;
    private boolean active = true;
    private List<Question> questions;

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    @Data
    public static class Question {
        private String questionValue;
        private String type;
        private boolean required;
        private Object additionalProperties;
        private Integer minSize;
        private Integer maxSize;




        public String getQuestionValue() {
            return questionValue;
        }

        public void setQuestionValue(String questionValue) {
            this.questionValue = questionValue;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public boolean isRequired() {
            return required;
        }

        public void setRequired(boolean required) {
            this.required = required;
        }

        public Object getAdditionalProperties() {
            return additionalProperties;
        }

        public void setAdditionalProperties(Object additionalProperties) {
            this.additionalProperties = additionalProperties;
        }

        public Integer getMinSize() {
            return minSize;
        }

        public void setMinSize(Integer minSize) {
            this.minSize = minSize;
        }

        public Integer getMaxSize() {
            return maxSize;
        }

        public void setMaxSize(Integer maxSize) {
            this.maxSize = maxSize;
        }
    }
}
