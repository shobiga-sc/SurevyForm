package com.trustace.googleFormClone.repository;


import com.trustace.googleFormClone.entity.Survey;
import com.trustace.googleFormClone.dto.SurveysDto;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SurveyRepository extends MongoRepository<Survey, String> {
    boolean existsByNameIgnoreCase(String name);
    List<SurveysDto> findAllBy();
}
