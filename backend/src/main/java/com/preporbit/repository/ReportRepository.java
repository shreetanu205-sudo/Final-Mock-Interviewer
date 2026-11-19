package com.preporbit.repository;

import com.preporbit.model.Report;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReportRepository extends MongoRepository<Report, String> {
    Optional<Report> findByInterviewId(String interviewId);
    List<Report> findByUserIdOrderByGeneratedAtDesc(String userId);
}
