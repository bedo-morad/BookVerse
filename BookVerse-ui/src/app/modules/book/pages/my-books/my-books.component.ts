import {Component, OnInit} from '@angular/core';
import {BookCardComponent} from "../../components/book-card/book-card.component";
import {NavigationComponent} from "../../components/navigation/navigation.component";
import {NgForOf, NgIf} from "@angular/common";
import {PageResponseBookResponse} from "../../../../services/models/page-response-book-response";
import {BookService} from "../../../../services/services/book.service";
import {Router, RouterLink} from "@angular/router";
import {BookResponse} from "../../../../services/models/book-response";

@Component({
  selector: 'app-my-books',
  standalone: true,
  imports: [
    BookCardComponent,
    NavigationComponent,
    NgForOf,
    NgIf,
    RouterLink
  ],
  templateUrl: './my-books.component.html',
  styleUrl: './my-books.component.scss'
})
export class MyBooksComponent implements OnInit {
  bookResponse: PageResponseBookResponse = {}
  page = 0
  size = 8

  constructor(
    private bookService: BookService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.findAllBooks()
  }

  private findAllBooks() {
    this.bookService.findAllBooksByOwner({
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

  archiveBook(book: BookResponse) {
    this.bookService.updateArchivedStatus({
      "book-id": book.id as number
    }).subscribe({
      next: () => {
        book.archived = !book.archived
      }
    });
  }

  shareBook(book: BookResponse) {
    this.bookService.updateShareableStatus({
      "book-id": book.id as number
    }).subscribe({
      next: () => {
        book.sharable = !book.sharable
      }
    });
  }

  editBook(book: BookResponse) {
    this.router.navigate(['books', 'manage', book.id])
  }
}
