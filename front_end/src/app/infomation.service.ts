import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Infomation } from './model/infomation.model';
import { Description } from './model/description.model';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';

/**
 * アセットをフロント側を配置しているサーバから取りに行く。
 */
@Injectable()
export class InfomationService {
  constructor(private http: HttpClient) {}
  getInfomation(): Observable<Infomation[]> {
    return this.http.get<Infomation[]>(environment.infoUrl);
  }
  getDescription(): Observable<Description> {
    return this.http.get<Description>(environment.metadataUrl);
  }
}
