/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { findAllFeedbacks } from '../fn/feedback/find-all-feedbacks';
import { FindAllFeedbacks$Params } from '../fn/feedback/find-all-feedbacks';
import { PageResponseFeedbackResponse } from '../models/page-response-feedback-response';
import { saveFeedBack } from '../fn/feedback/save-feed-back';
import { SaveFeedBack$Params } from '../fn/feedback/save-feed-back';

@Injectable({ providedIn: 'root' })
export class FeedbackService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `saveFeedBack()` */
  static readonly SaveFeedBackPath = '/feedbacks';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `saveFeedBack()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  saveFeedBack$Response(params: SaveFeedBack$Params, context?: HttpContext): Observable<StrictHttpResponse<number>> {
    return saveFeedBack(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `saveFeedBack$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  saveFeedBack(params: SaveFeedBack$Params, context?: HttpContext): Observable<number> {
    return this.saveFeedBack$Response(params, context).pipe(
      map((r: StrictHttpResponse<number>): number => r.body)
    );
  }

  /** Path part for operation `findAllFeedbacks()` */
  static readonly FindAllFeedbacksPath = '/feedbacks/book/{book-id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findAllFeedbacks()` instead.
   *
   * This method doesn't expect any request body.
   */
  findAllFeedbacks$Response(params: FindAllFeedbacks$Params, context?: HttpContext): Observable<StrictHttpResponse<PageResponseFeedbackResponse>> {
    return findAllFeedbacks(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `findAllFeedbacks$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findAllFeedbacks(params: FindAllFeedbacks$Params, context?: HttpContext): Observable<PageResponseFeedbackResponse> {
    return this.findAllFeedbacks$Response(params, context).pipe(
      map((r: StrictHttpResponse<PageResponseFeedbackResponse>): PageResponseFeedbackResponse => r.body)
    );
  }

}
