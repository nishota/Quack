import * as moment from 'moment';

export class DateTime {
    /**
     * 日時をブラウザが認識しているタイムゾーンの時間に変更する。
     * @param createdAt 日時(サーバからの生データ)
     */
    static setDateString(createdAt: string): string {
      const date = moment(createdAt);
      const createdTime = new Date(date.utc().format());
      const year = createdTime.getFullYear();
      const month = createdTime.getMonth() + 1;
      const day = createdTime.getDate();
      const hours = createdTime.getHours();
      const min = createdTime.getMinutes();
      const sec = createdTime.getSeconds();
      let stMonth = String(month);
      let stDay = String(day);
      let stHours = String(hours);
      let stMin = String(min);
      let stSec = String(sec);
      if (month < 10) {
        stMonth = '0' + stMonth;
      }
      if (day < 10) {
        stDay = '0' + stDay;
      }
      if (hours < 10) {
        stHours = '0' + stHours;
      }
      if (min < 10) {
        stMin = '0' + stMin;
      }
      if (sec < 10) {
        stSec = '0' + stSec;
      }
      return year + '/' + stMonth + '/' + stDay + ' ' + stHours + ':' + stMin + ':' + stSec;
    }
}
