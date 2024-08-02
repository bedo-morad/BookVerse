import {Component, OnInit} from '@angular/core';
import {BookService} from "../../../../services/services/book.service";
import {PageResponseBookResponse} from "../../../../services/models/page-response-book-response";
import {NgForOf, NgIf} from "@angular/common";
import {BookCardComponent} from "../../components/book-card/book-card.component";
import {BookResponse} from "../../../../services/models/book-response";
import {NavigationComponent} from "../../components/navigation/navigation.component";

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    NgForOf,
    BookCardComponent,
    NgIf,
    NavigationComponent,
  ],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss'
})
export class BookListComponent implements OnInit {
  bookResponse: PageResponseBookResponse = {}
  page = 0
  size = 4
  message: string = '';
  level: string = 'success'

  constructor(
    private bookService: BookService,
  ) {
  }

  ngOnInit(): void {
    this.findAllBooks()
  }

  private findAllBooks() {
    this.bookService.findAllBooks({
      page: this.page,
      size: this.size
    }).subscribe({
      next: (books) => {
        this.bookResponse = books
      }
    })
  }

  goToPage(page: number) {
    this.page = page
    this.findAllBooks()
  }

  borrowBook(book: BookResponse) {
    this.message = ''
    this.bookService.borrowBook(
      {
        "book-id": book.id as number
      }).subscribe({
      next: () => {
        this.level = 'success'
        this.message = "book successfully add to your list"
      },
      error: (err) => {
        console.log(err)
        this.level = 'error'
        this.message = err.error.error
      }
    })
  }
}
