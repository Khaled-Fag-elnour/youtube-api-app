import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { YoutubeData } from '../viewmodels/youtube-data';

@Injectable({
  providedIn: 'root'
})
export class YoutubeDataService {

  constructor(private http: HttpClient) { }

  getChannelVideos(orderBy?: string, pageToken?: string, title?: string, channelId?: string): Observable<YoutubeData> {
    channelId = channelId ? channelId : 'UCJZv4d5rbIKd4QHMPkcABCw';
    // tslint:disable-next-line: max-line-length
    let params = new HttpParams().set('part', 'snippet').append('channelId', channelId).append('type', 'video').append('key', environment.youtube_api_key);
    // filters
    if (orderBy) { params = params.append('order', orderBy); }
    if (pageToken) { params = params.append('pageToken', pageToken); }
    if (title) { params = params.append('q', title); }
    const opts = {params};
    return this.http.get<YoutubeData>(`${environment.youtube_api_prefix}/search?`, opts);
  }

  getVideoDetails(id: string): Observable<any> {
    // tslint:disable-next-line: max-line-length
    const params = new HttpParams().set('part', 'snippet').append('part', 'contentDetails').append('part', 'statistics').append('id', id).append('key', environment.youtube_api_key);
    return this.http.get<any>(`${environment.youtube_api_prefix}/videos?`, {params});
  }
}
