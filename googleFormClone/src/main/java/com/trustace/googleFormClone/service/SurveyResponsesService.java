package com.trustace.googleFormClone.service;

import com.trustace.googleFormClone.entity.SurveyResponses;
import com.trustace.googleFormClone.repository.SurveyRepository;
import com.trustace.googleFormClone.repository.SurveyResponsesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Set;

import java.util.*;

@Service
public class SurveyResponsesService {

    @Autowired
    private SurveyResponsesRepository surveyResponsesRepository;

    @Autowired
    private SurveyRepository surveyRepository;
    private SurveyResponses surveyResponses;

    @Transactional
    public SurveyResponses saveSurveyResponse(SurveyResponses surveyResponse) {
        return surveyResponsesRepository.save(surveyResponse);
    }

    public List<SurveyResponses> getAllSurveyResponse() {
        return surveyResponsesRepository.findAll();
    }

    public List<SurveyResponses> getSurveyResponsesBySurveyId(String surveyId) {
        if(!surveyRepository.findById(surveyId).isPresent()){
            throw new NoSuchElementException("There is no survey present with Id: "+ surveyId);
        }
        return surveyResponsesRepository.findBySurveyId(surveyId);
    }


    public Optional<SurveyResponses> updateResponseStatus(String responseId, String status) {
        Set<String> validStatuses = Set.of("ACCEPTED", "REJECTED", "NO_ACTION");

        if (!validStatuses.contains(status.toUpperCase())) {
            throw new IllegalArgumentException("Invalid status. Allowed values: ACCEPTED, REJECTED, NO_ACTION");
        }
        if (!surveyResponsesRepository.findById(responseId).isPresent()) {
            throw new NoSuchElementException("Survey response not found with ID: " + responseId);
        }

        return surveyResponsesRepository.findById(responseId).map(surveyResponse -> {
            surveyResponse.setStatus(status.toUpperCase());
            return surveyResponsesRepository.save(surveyResponse);
        });
    }

    public Map<String, Long> getStatusCounts(String surveyId) {

        if(!surveyRepository.findById(surveyId).isPresent()){
           throw new NoSuchElementException("There is no survey present with Id: "+ surveyId);
        }
        Map<String, Long> statusCounts = new HashMap<>();

        List<SurveyResponses> responses = surveyResponsesRepository.findBySurveyId(surveyId);

        long acceptedCount = responses.stream().filter(r -> "ACCEPTED".equalsIgnoreCase(r.getStatus())).count();
        long rejectedCount = responses.stream().filter(r -> "REJECTED".equalsIgnoreCase(r.getStatus())).count();
        long noActionCount = responses.stream().filter(r -> "NO_ACTION".equalsIgnoreCase(r.getStatus())).count();

        statusCounts.put("ACCEPTED", acceptedCount);
        statusCounts.put("REJECTED", rejectedCount);
        statusCounts.put("NO_ACTION", noActionCount);

        return statusCounts;
    }

    public void deleteResponseBySurveyId(String surveyId){
        if(!surveyRepository.findById(surveyId).isPresent()){
            throw new NoSuchElementException("There is no survey present with Id: "+ surveyId);
        }
        surveyResponsesRepository.deleteBySurveyId(surveyId);
    }

}
