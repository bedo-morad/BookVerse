import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgForOf} from "@angular/common";
import {PageResponseBookResponse} from "../../../../services/models/page-response-book-response";

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent {

  @Input() bookResponse: PageResponseBookResponse = {}
  @Input() page = 0
  @Input() size = 4

  @Output() private goToPage: EventEmitter<number> = new EventEmitter<number>()

  onGoToFirstPage() {
    this.page = 0
    this.goToPage.emit(this.page)
  }

  onGoToPreviousPage() {
    this.page--
    this.goToPage.emit(this.page)
  }

  onGoToPage(pageIndex: number) {
    if (this.page != pageIndex) {
      this.page = pageIndex
      this.goToPage.emit(pageIndex)
    }
  }

  onGoToNextPage() {
    this.page++
    this.goToPage.emit(this.page)
  }

  onGoToLastPage() {
    this.page = this.bookResponse.totalPages as number - 1
    this.goToPage.emit(this.page)
  }

  isLastPage() {
    return this.page == this.bookResponse.totalPages as number - 1
  }
}
