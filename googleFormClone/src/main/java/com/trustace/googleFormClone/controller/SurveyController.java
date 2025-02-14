package com.trustace.googleFormClone.controller;

import com.trustace.googleFormClone.entity.Survey;
import com.trustace.googleFormClone.service.SurveyService;
import com.trustace.googleFormClone.dto.SurveysDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/surveys")
@CrossOrigin(origins = "*")
public class SurveyController {

    @Autowired
    private SurveyService surveyService;

    @PostMapping
    public ResponseEntity<Survey> saveSurvey(@RequestBody Survey survey) {
        try {
            return ResponseEntity.ok(surveyService.saveSurvey(survey));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Survey>> getAllSurveys() {
        try {
            return ResponseEntity.ok(surveyService.getAllSurveys());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
//ResponseEntity<Survey>
    @GetMapping("/{id}")
    public ResponseEntity<?> getSurvey(@PathVariable String id) {
        try {
            return ResponseEntity.ok(surveyService.getSurvey(id));
        }
        catch (NoSuchElementException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/surveyList")
    public ResponseEntity<List<SurveysDto>> getAllSurveyList() {
        try {
            return ResponseEntity.ok(surveyService.getAllSurveyList());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/check-name/{surveyName}")
    public ResponseEntity<Map<String, Boolean>> checkSurveyName(@PathVariable String surveyName) {
        boolean exists = surveyService.isSurveyNameTaken(surveyName);
        return ResponseEntity.ok(Collections.singletonMap("exists", exists));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateSurveyStatus(@PathVariable String id, @RequestBody Map<String, Boolean> status) {
        try {
            boolean newStatus = status.get("active");
            Survey updatedSurvey = surveyService.updateSurveyStatus(id, newStatus);
            return ResponseEntity.ok(updatedSurvey);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Survey not found");
        }
    }




}