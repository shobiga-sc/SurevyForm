package com.trustace.googleFormClone.controller;

import com.trustace.googleFormClone.entity.SurveyResponses;
import com.trustace.googleFormClone.service.SurveyResponsesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("api/survey-responses")
@CrossOrigin(origins = "*")
public class SurveyResponsesController {

    @Autowired
    private SurveyResponsesService surveyResponsesService;

    @PostMapping
    public ResponseEntity<SurveyResponses> submitSurveyResponse(@RequestBody SurveyResponses surveyResponse) {
        try {
            SurveyResponses savedResponse = surveyResponsesService.saveSurveyResponse(surveyResponse);
            return ResponseEntity.ok(savedResponse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

//    ResponseEntity<List<SurveyResponses>>
    @GetMapping("/survey/{surveyId}")
    public ResponseEntity<?> getSurveyResponses(@PathVariable String surveyId) {
        try {
            List<SurveyResponses> responses = surveyResponsesService.getSurveyResponsesBySurveyId(surveyId);
            if (responses.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(responses);
        }
        catch (NoSuchElementException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PatchMapping("/{responseId}/status")
    public ResponseEntity<?> updateResponseStatus(@PathVariable String responseId, @RequestParam String status) {
        try {
            Optional<SurveyResponses> updatedResponse = surveyResponsesService.updateResponseStatus(responseId, status);
            return updatedResponse.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (NoSuchElementException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

//ResponseEntity<Map<String, Long>>
    @GetMapping("/{surveyId}/status-counts")
    public ResponseEntity<?> getStatusCounts(@PathVariable String surveyId) {
        try {
            return ResponseEntity.ok(surveyResponsesService.getStatusCounts(surveyId));
        }
        catch (NoSuchElementException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/delete/{surveyId}")
    public ResponseEntity<?> deleteResponseBySurveyId(@PathVariable String surveyId){
        try{
        surveyResponsesService.deleteResponseBySurveyId(surveyId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Survey responses deleted successfully");
        return ResponseEntity.ok(response);
        }
        catch (NoSuchElementException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        catch (Exception e){
            return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }






}

