package com.bookverse.BookVerse.book;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookRepository extends JpaRepository<Book, Integer>, JpaSpecificationExecutor<Book> {
    @Query("""
            select book
            from Book book
            where book.archived = false
            and book.sharable =true
            and book.owner.id != :userId
            """)
    Page<Book> findAllDisplayableBooks(Pageable pageable,@Param("userId") Integer userId);
}
