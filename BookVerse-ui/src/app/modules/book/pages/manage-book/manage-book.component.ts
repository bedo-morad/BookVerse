import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {BookRequest} from "../../../../services/models/book-request";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {BookService} from "../../../../services/services/book.service";

@Component({
  selector: 'app-manage-book',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    NgOptimizedImage,
    FormsModule,
    RouterLink
  ],
  templateUrl: './manage-book.component.html',
  styleUrl: './manage-book.component.scss'
})
export class ManageBookComponent implements OnInit {

  ngOnInit(): void {
    const bookId = this.activatedRoute.snapshot.params['bookId']
    if (bookId) {
      this.bookService.findBookById({
        "book-id": bookId
      }).subscribe({
        next: (book) => {
          this.bookRequest = {
            id: book.id,
            title: book.title  as string,
            authorName: book.authorName as string,
            isbn: book.isbn as string,
            shareable: book.sharable,
            synopsis: book.synopsis as string,
          }
          if (book.cover){
            this.selectedPicture='data:image/jpg;base64, ' + book.cover
          }
        }
      })
    }
  }

  bookRequest: BookRequest = {
    title: "",
    authorName: '',
    isbn: '',
    synopsis: ''
  }
  errorMsg: Array<string> = [];
  selectedBookCover: any;
  selectedPicture: string | undefined;

  constructor(
    private bookService: BookService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
  }

  onFileSelected(file: any) {
    this.selectedBookCover = file.target.files[0];
    if (this.selectedBookCover) {
      const reader: FileReader = new FileReader()
      reader.onload = () => {
        this.selectedPicture = reader.result as string
      }
      reader.readAsDataURL(this.selectedBookCover)
    }
  }

  saveBook() {
    this.bookService.saveBook({
      body: this.bookRequest
    }).subscribe({
        next: (bookId) => {
          this.bookService.uploadBookCoverPicture({
            "book-id": bookId,
            body: {
              file: this.selectedBookCover
            }
          }).subscribe({
            next: () => {
              this.router.navigate(['/books/my-books'])
            }
          })
        },
        error: (err) => {
          this.errorMsg = err.error.validationErrors;
        }
      }
    )
  }
}
