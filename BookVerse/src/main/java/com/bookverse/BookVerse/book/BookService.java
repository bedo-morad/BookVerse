package com.bookverse.BookVerse.book;

import com.bookverse.BookVerse.common.PageResponse;
import com.bookverse.BookVerse.exception.OperationNotPermittedException;
import com.bookverse.BookVerse.file.FileStorageService;
import com.bookverse.BookVerse.history.BookTransactionHistory;
import com.bookverse.BookVerse.history.BookTransactionHistoryRepository;
import com.bookverse.BookVerse.notification.Notification;
import com.bookverse.BookVerse.notification.NotificationService;
import com.bookverse.BookVerse.notification.NotificationStatus;
import com.bookverse.BookVerse.user.User;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Objects;

import static com.bookverse.BookVerse.book.BookSpecification.withOwnerId;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final BookTransactionHistoryRepository bookTransactionHistoryRepository;
    private final BookMapper bookMapper;
    private final FileStorageService fileStorageService;
    private final NotificationService notificationService;

    public Integer save(BookRequest request, Authentication connectedUser) {
//        User user = ((User) connectedUser.getPrincipal());
        Book book = bookMapper.toBook(request);
//        book.setOwner(user);
        return bookRepository.save(book).getId();
    }

    public BookResponse findById(Integer bookId) {
        return bookRepository.findById(bookId)
                .map(bookMapper::toBookResponse)
                .orElseThrow(() -> new EntityNotFoundException("No book was found with id: " + bookId));
    }

    public PageResponse<BookResponse> findAllBooks(int page, int size, Authentication connectedUser) {
//        User user = ((User) connectedUser.getPrincipal());
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
        Page<Book> books = bookRepository.findAllDisplayableBooks(pageable, connectedUser.getName());
        List<BookResponse> booksResponse = books.stream()
                .map(bookMapper::toBookResponse)
                .toList();
        return new PageResponse<>(
                booksResponse,
                books.getNumber(),
                books.getSize(),
                books.getTotalElements(),
                books.getTotalPages(),
                books.isFirst(),
                books.isLast()
        );
    }

    public PageResponse<BookResponse> findAllBooksByOwner(int page, int size, Authentication connectedUser) {
//        User user = ((User) connectedUser.getPrincipal());
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
        Page<Book> books = bookRepository.findAll(withOwnerId(connectedUser.getName()), pageable);
        List<BookResponse> booksResponse = books.stream()
                .map(bookMapper::toBookResponse)
                .toList();
        return new PageResponse<>(
                booksResponse,
                books.getNumber(),
                books.getSize(),
                books.getTotalElements(),
                books.getTotalPages(),
                books.isFirst(),
                books.isLast()
        );
    }

    public PageResponse<BorrowedBooksResponse> findAllBorrowedBooks(int page, int size, Authentication connectedUser) {
//        User user = ((User) connectedUser.getPrincipal());
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
        Page<BookTransactionHistory> allBorrowedBooks;
        allBorrowedBooks = bookTransactionHistoryRepository.findAllBorrowedBooks(pageable, connectedUser.getName());
        List<BorrowedBooksResponse> booksResponse = allBorrowedBooks.stream()
                .map(bookMapper::toBorrowedBooksResponse)
                .toList();
        return new PageResponse<>(
                booksResponse,
                allBorrowedBooks.getNumber(),
                allBorrowedBooks.getSize(),
                allBorrowedBooks.getTotalElements(),
                allBorrowedBooks.getTotalPages(),
                allBorrowedBooks.isFirst(),
                allBorrowedBooks.isLast()
        );
    }

    public PageResponse<BorrowedBooksResponse> findAllReturnedBooks(int page, int size, Authentication connectedUser) {
//        User user = ((User) connectedUser.getPrincipal());
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
        Page<BookTransactionHistory> allBorrowedBooks;
        allBorrowedBooks = bookTransactionHistoryRepository.findAllReturnedBooks(pageable, connectedUser.getName());
        List<BorrowedBooksResponse> booksResponse = allBorrowedBooks.stream()
                .map(bookMapper::toBorrowedBooksResponse)
                .toList();
        return new PageResponse<>(
                booksResponse,
                allBorrowedBooks.getNumber(),
                allBorrowedBooks.getSize(),
                allBorrowedBooks.getTotalElements(),
                allBorrowedBooks.getTotalPages(),
                allBorrowedBooks.isFirst(),
                allBorrowedBooks.isLast()
        );
    }

    public Integer updateShareableStatus(Integer bookId, Authentication connectedUser) {
        Book book = bookRepository.findById(bookId).orElseThrow(() -> new EntityNotFoundException("no book found with id: " + bookId));
//        User user = ((User) connectedUser.getPrincipal());

        if (!Objects.equals(book.getCreatedBy(), connectedUser.getName())) {
            throw new OperationNotPermittedException("You can not update others books shareable status");
        }
        book.setSharable(!book.isSharable());
        bookRepository.save(book);
        return bookId;
    }

    public Integer updateArchivedStatus(Integer bookId, Authentication connectedUser) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException("no book found with id: " + bookId));
//        User user = ((User) connectedUser.getPrincipal());
        if (!Objects.equals(book.getCreatedBy(), connectedUser.getName())) {
            throw new OperationNotPermittedException("You can not update others books archived status");
        }
        book.setArchived(!book.isArchived());
        bookRepository.save(book);
        return bookId;
    }

    public Integer borrowBook(Integer bookId, Authentication connectedUser) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException("no book found with id: " + bookId));
        if (book.isArchived() || !book.isSharable()) {
            throw new OperationNotPermittedException("The requested book is either archived or not shareable");
        }
//        User user = ((User) connectedUser.getPrincipal());
        if (Objects.equals(book.getCreatedBy(), connectedUser.getName())) {
            throw new OperationNotPermittedException("You can not borrow your own book");
        }
        final boolean isAlreadyBorrowed = bookTransactionHistoryRepository.isAlreadyBorrowedByUser(bookId, connectedUser.getName());
        if (isAlreadyBorrowed) {
            throw new OperationNotPermittedException("The requested book is already borrowed");
        }
        BookTransactionHistory bookTransactionHistory = BookTransactionHistory.builder()
                .userId(connectedUser.getName())
                .book(book)
                .returned(false)
                .returnApproved(false)
                .build();
        notificationService.sendNotification(
                book.getCreatedBy(),
                Notification.builder()
                        .status(NotificationStatus.BORROWED)
                        .message("Your Book has been borrowed")
                        .bookTitle(book.getTitle())
                        .build()
        );
        return bookTransactionHistoryRepository.save(bookTransactionHistory).getId();
    }

    public Integer returnBook(Integer bookId, Authentication connectedUser) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException("no book found with id: " + bookId));
//        User user = ((User) connectedUser.getPrincipal());
        if (book.isArchived() || !book.isSharable()) {
            throw new OperationNotPermittedException("The requested book is either archived or not shareable");
        }
        if (Objects.equals(book.getCreatedBy(), connectedUser.getName())) {
            throw new OperationNotPermittedException("You can not return your own book");
        }
        BookTransactionHistory bookTransactionHistory = bookTransactionHistoryRepository
                .findByBookIdAndUserId(bookId, connectedUser.getName())
                .orElseThrow(() -> new OperationNotPermittedException("You did not borrow this book"));
        bookTransactionHistory.setReturned(true);
        var saved = bookTransactionHistoryRepository.save(bookTransactionHistory);
        notificationService.sendNotification(
                book.getCreatedBy(),
                Notification.builder()
                        .status(NotificationStatus.RETURNED)
                        .message("Your Book has been Returned")
                        .bookTitle(book.getTitle())
                        .build()
        );
        return saved.getId();
    }

    public Integer approveReturnBorrowBook(Integer bookId, Authentication connectedUser) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException("no book found with id: " + bookId));
//        User user = ((User) connectedUser.getPrincipal());
        if (book.isArchived() || !book.isSharable()) {
            throw new OperationNotPermittedException("The requested book is either archived or not shareable");
        }
        if (!Objects.equals(book.getCreatedBy(), connectedUser.getName())) {
            throw new OperationNotPermittedException("You can not return book you don't own");
        }
        BookTransactionHistory bookTransactionHistory = bookTransactionHistoryRepository
                .findByBookIdAndOwnerId(bookId, connectedUser.getName())
                .orElseThrow(() -> new OperationNotPermittedException("the book is not returned yet. you can't approve its return"));
        bookTransactionHistory.setReturnApproved(true);
        var saved = bookTransactionHistoryRepository.save(bookTransactionHistory);
        notificationService.sendNotification(
                bookTransactionHistory.getCreatedBy(),
                Notification.builder()
                        .status(NotificationStatus.RETURN_APPROVED)
                        .message("Your Book has been return has been approved")
                        .bookTitle(book.getTitle())
                        .build()
        );
        return saved.getId();
    }

    public void uploadBookCoverPicture(MultipartFile file, Integer bookId, Authentication connectedUser) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException("no book found with id: " + bookId));
//        User user = ((User) connectedUser.getPrincipal());
        var bookCover = fileStorageService.saveFile(file, connectedUser.getName());
        book.setBookCover(bookCover);
        bookRepository.save(book);
    }
}
