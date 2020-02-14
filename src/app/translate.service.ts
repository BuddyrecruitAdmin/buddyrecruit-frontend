import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { getLangPath } from './shared/services/auth.service';
@Injectable()
export class TranslateService {

  data: any = {};
  path: any;
  constructor(private http: HttpClient) { 
  this.path = getLangPath(); 
  console.log(this.path)
  }

  use(lang: string): Promise<{}> {
    return new Promise<{}>((resolve, reject) => {
      const langPath = `assets/i18n/${lang || 'en'}.json`;

      this.http.get<{}>(langPath).subscribe(
        translation => {
          this.data = Object.assign({}, translation || {});
          switch (this.path) {
            case "INDEX": 
              this.data = this.data.INDEX
              resolve(this.data);
              break;
            case "APP_FORM":
              resolve(this.data.APP_FORM);
              break;

            default:
              resolve(this.data);
              break;
          }
        },
        error => {
          this.data = {};
          resolve(this.data);
        }
      );
    });
  }

}
