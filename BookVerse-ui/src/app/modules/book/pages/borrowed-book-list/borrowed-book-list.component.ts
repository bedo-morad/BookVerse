import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {PageResponseBorrowedBooksResponse} from "../../../../services/models/page-response-borrowed-books-response";
import {RatingComponent} from "../../components/rating/rating.component";
import {BorrowedBooksResponse} from "../../../../services/models/borrowed-books-response";
import {BookService} from "../../../../services/services/book.service";
import {NavigationComponent} from "../../components/navigation/navigation.component";
import {FeedbackRequest} from "../../../../services/models/feedback-request";
import {FormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {FeedbackService} from "../../../../services/services/feedback.service";

@Component({
  selector: 'app-borrowed-book-list',
  standalone: true,
  imports: [
    NgForOf,
    RatingComponent,
    NgIf,
    NavigationComponent,
    FormsModule,
    RouterLink
  ],
  templateUrl: './borrowed-book-list.component.html',
  styleUrl: './borrowed-book-list.component.scss'
})
export class BorrowedBookListComponent implements OnInit {
  borrowedBooks: PageResponseBorrowedBooksResponse = {}
  feedbackRequest: FeedbackRequest = {bookId: 0, comment: "", note: 0}
  page = 0
  size = 10
  selectedBook: BorrowedBooksResponse | undefined = undefined;

  constructor(
    private bookService: BookService,
    private feedbackService: FeedbackService
  ) {
  }

  ngOnInit(): void {
    this.findAllBorrowedBooks()
  }

  goToPage(page: number) {
    this.page = page
    this.findAllBorrowedBooks()
  }

  returnBorrowedBook(book: BorrowedBooksResponse) {
    this.selectedBook = book
    this.feedbackRequest.bookId = this.selectedBook?.id as number
  }

  private findAllBorrowedBooks() {
    this.bookService.findAllBorrowedBooks({
      page: this.page,
      size: this.size
    }).subscribe({
      next: (resp) => {
        this.borrowedBooks = resp
      }
    })
  }

  returnBook(withFeedback: boolean) {
    this.bookService.returnBook({
      "book-id": this.selectedBook?.id as number
    }).subscribe({
      next: () => {
        if (withFeedback) {
          this.giveFeedback()
        }
        this.selectedBook = undefined
        this.findAllBorrowedBooks()
      }
    })
  }

  private giveFeedback() {
    this.feedbackService.saveFeedBack({
      body: this.feedbackRequest
    }).subscribe({
      next:()=>{

      }
    })
  }
}
