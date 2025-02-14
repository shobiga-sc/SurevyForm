package com.trustace.googleFormClone.service;

import com.trustace.googleFormClone.entity.Survey;
import com.trustace.googleFormClone.repository.SurveyRepository;
import com.trustace.googleFormClone.dto.SurveysDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class SurveyService {

    @Autowired
    private SurveyRepository repository;


    public Survey saveSurvey(Survey survey) {
        return repository.save(survey);
    }

    public List<Survey> getAllSurveys() {
        return repository.findAll();
    }


    public List<SurveysDto> getAllSurveyList() {
        return repository.findAllBy();
    }

    public Survey getSurvey(String id) {
        if(!repository.findById(id).isPresent()){
            throw new NoSuchElementException("There is no survey present with Id: "+ id);
        }
        return repository.findById(id).get();
    }

    public boolean isSurveyNameTaken(String name) {
        return repository.existsByNameIgnoreCase(name);
    }

    public Survey updateSurveyStatus(String id, boolean active) {
        Optional<Survey> surveyOptional = repository.findById(id);
        if (surveyOptional.isPresent()) {
            Survey survey = surveyOptional.get();
            survey.setActive(active);
            return repository.save(survey);
        }
        throw new RuntimeException("Survey not found");
    }
}