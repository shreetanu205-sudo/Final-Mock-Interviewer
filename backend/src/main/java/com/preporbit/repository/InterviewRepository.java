package com.preporbit.repository;

import com.preporbit.model.Interview;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InterviewRepository extends MongoRepository<Interview, String> {
    List<Interview> findByUserIdOrderByCreatedAtDesc(String userId);
    Optional<Interview> findByIdAndUserId(String id, String userId);
    long countByUserIdAndStatus(String userId, String status);
    List<Interview> findByUserIdAndStatusOrderByCompletedAtDesc(String userId, String status);
}
