import {Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {KeycloakService} from "../../../../services/keycloak/keycloak.service";
import SockJs from "sockjs-client";
import Stomp from "stompjs";
import {Notification} from "./notification";
import {ToastrService} from "ngx-toastr";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    RouterLink,
    NgForOf
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {

  socketClient: any = null
  private notificationSubscription: any;
  unreadNotificationCount= 0;
  notifications:Array<Notification> = [];


  constructor(
    private keycloakService: KeycloakService,
    private toastService: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.navigationHandler()
    if (this.keycloakService.keycloak.tokenParsed?.sub) {
      let ws = new SockJs('http://localhost:8088/api/v1/ws');
      this.socketClient = Stomp.over(ws)
      this.socketClient.connect({
        'Authorization': 'Bearer ' + this.keycloakService.keycloak.token
      }, () => {
        this.notificationSubscription = this.socketClient.subscribe(
          `/user/${this.keycloakService.keycloak.tokenParsed?.sub}/notification`,
          (message: any) => {
            const notification: Notification = JSON.parse(message.body);
            if (notification) {
              this.notifications.unshift(notification)

              switch (notification.status) {
                case 'BORROWED':
                  this.toastService.info(notification.message, notification.bookTitle)
                  break;
                case 'RETURNED':
                  this.toastService.warning(notification.message, notification.bookTitle)
                  break;
                case 'RETURN_APPROVED':
                  this.toastService.success(notification.message, notification.bookTitle)
                  break;
              }
              this.unreadNotificationCount++
            }
          }
        )
      })
    }
  }

  private navigationHandler() {
    const linkColor = document.querySelectorAll('.nav-link')
    linkColor.forEach(link => {
      if (window.location.href.endsWith(link.getAttribute('href') || '')) {
        link.classList.add('active')
      }
      link.addEventListener('click', () => {
        linkColor.forEach(l => l.classList.remove('active'))
        link.classList.add('active')
      })
    })
  }

  async logout() {
    this.keycloakService.logout()
  }

  async accountManagement() {
    this.keycloakService.accountManagement()
  }

  get username(){
    // @ts-ignore
    return this.keycloakService.keycloak?.tokenParsed?.given_name;
  }
}
