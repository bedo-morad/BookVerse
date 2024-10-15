import {Component, OnInit} from '@angular/core';
import {NavigationComponent} from "../../components/navigation/navigation.component";
import {NgForOf, NgIf} from "@angular/common";
import {RatingComponent} from "../../components/rating/rating.component";
import {PageResponseBorrowedBooksResponse} from "../../../../services/models/page-response-borrowed-books-response";
import {BorrowedBooksResponse} from "../../../../services/models/borrowed-books-response";
import {BookService} from "../../../../services/services/book.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-returned-books',
  standalone: true,
  imports: [
    NavigationComponent,
    NgForOf,
    NgIf,
    RatingComponent
  ],
  templateUrl: './returned-books.component.html',
  styleUrl: './returned-books.component.scss'
})
export class ReturnedBooksComponent implements OnInit {
  returnedBooks: PageResponseBorrowedBooksResponse = {}
  page = 0
  size = 10
  selectedBook: BorrowedBooksResponse | undefined = undefined;
  message: string = '';
  level: string = 'success'

  constructor(
    private bookService: BookService,
    private toastService: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.findReturnedBooks()
  }

  goToPage(page: number) {
    this.page = page
    this.findReturnedBooks()
  }

  private findReturnedBooks() {
    this.bookService.findAllReturnedBooks({
      page: this.page,
      size: this.size
    }).subscribe({
      next: (resp) => {
        this.returnedBooks = resp
      }
    })
  }

  approveBookReturn(book: BorrowedBooksResponse) {
    if (!book.returned) {
      this.toastService.error('the book is not yet returned','error')
      return;
    }
    this.bookService.approveReturnBorrowBook({
      "book-id": book.id as number
    }).subscribe({
      next: () => {
        this.toastService.success('Book return approved','success')
        this.level = 'success'
        this.message = 'Book return approved'
        this.findReturnedBooks()
      }
    })
  }
}
