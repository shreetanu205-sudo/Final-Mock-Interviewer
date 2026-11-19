package com.preporbit.repository;

import com.preporbit.model.Response;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResponseRepository extends MongoRepository<Response, String> {
    List<Response> findByInterviewIdOrderByAnsweredAtAsc(String interviewId);
    List<Response> findByInterviewIdAndBatchId(String interviewId, String batchId);
    List<Response> findByInterviewIdAndBatchNumber(String interviewId, int batchNumber);
    Optional<Response> findByInterviewIdAndQuestionId(String interviewId, String questionId);
}
