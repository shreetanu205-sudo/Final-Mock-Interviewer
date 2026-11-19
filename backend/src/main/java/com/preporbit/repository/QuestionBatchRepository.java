package com.preporbit.repository;

import com.preporbit.model.QuestionBatch;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionBatchRepository extends MongoRepository<QuestionBatch, String> {
    List<QuestionBatch> findByInterviewIdOrderByBatchNumberAsc(String interviewId);
    Optional<QuestionBatch> findByInterviewIdAndBatchNumber(String interviewId, int batchNumber);
}
