package com.trustace.googleFormClone.repository;

import com.trustace.googleFormClone.entity.SurveyResponses;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SurveyResponsesRepository extends MongoRepository<SurveyResponses, String> {
    List<SurveyResponses> findBySurveyId(String surveyId);
    void deleteBySurveyId(String surveyId);
}
