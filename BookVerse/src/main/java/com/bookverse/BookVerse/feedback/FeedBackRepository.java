package com.bookverse.BookVerse.feedback;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FeedBackRepository extends JpaRepository<Feedback, Integer> {

    @Query("""
            select feedback
            from Feedback feedback
            where feedback.book.id = :bookId
            """)
    Page<Feedback> findAllByBookId(@Param("bookId") Integer bookId, Pageable pageable);
}