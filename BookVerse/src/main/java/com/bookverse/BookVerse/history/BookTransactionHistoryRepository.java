package com.bookverse.BookVerse.history;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface BookTransactionHistoryRepository extends JpaRepository<BookTransactionHistory, Integer> {
    @Query("""
            select history
            from BookTransactionHistory history
            where history.user.id = :userId
            """)
    Page<BookTransactionHistory> findAllBorrowedBooks(Pageable pageable, @Param("userId") Integer userId);

    @Query("""
            select history
            from BookTransactionHistory history
            where history.book.owner.id =:userId
            """)
    Page<BookTransactionHistory> findAllReturnedBooks(Pageable pageable, @Param("userId") Integer userId);

    @Query("""
            select
            (count(*) > 0) As isBorrowed
            from BookTransactionHistory bookTransactionHistory
            where bookTransactionHistory.user.id = :userId
            and bookTransactionHistory.book.id = :bookId
            and bookTransactionHistory.returnApproved = false
            """)
    boolean isAlreadyBorrowedByUser(@Param("bookId") Integer bookId, @Param("userId") Integer userId);

    @Query("""
            select transaction
            from BookTransactionHistory transaction
            where transaction.user.id =:userId
            and transaction.book.id =:bookId
            and transaction.returned =false
            and transaction.returnApproved =false
            """)
    Optional<BookTransactionHistory> findByBookIdAndUserId(@Param("bookId") Integer bookId, @Param("userId") Integer id);

    @Query("""
            select transaction
            from BookTransactionHistory transaction
            where transaction.book.owner.id =:userId
            and transaction.book.id =:bookId
            and transaction.returned =true
            and transaction.returnApproved =false
            """)
    Optional<BookTransactionHistory> findByBookIdAndOwnerId(@Param("bookId") Integer bookId, @Param("userId") Integer id);
}
