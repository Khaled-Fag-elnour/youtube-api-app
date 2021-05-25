import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import { YoutubeDataService } from 'src/app/services/youtube-data.service';
import { YoutubeData } from 'src/app/viewmodels/youtube-data';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  latestResponse: any = localStorage.getItem('latestResponse');
  channelVideos: any = [];
  loading = false;
  nextPageToken = '';
  prevPageToken = '';
  orderBy = '';
  titleKeyword = '';
  channelUrl = '';
  channelId: any = '';
  searchTimeout: ReturnType<typeof setTimeout> = setTimeout(() => '', 1000);
  constructor(private youtubeDataService: YoutubeDataService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    // getting the channel id from the query parameter if exists (queryParams)
    this.activatedRoute.queryParams.subscribe(params => {
      this.channelId = params.channelId ? params.channelId : '';
      console.log(this.channelId);
    });

    // getting data from local storage if exists
    if (this.latestResponse) {
      const res = JSON.parse(this.latestResponse);
      this.channelVideos = res.items;
      this.nextPageToken = res.nextPageToken ? res.nextPageToken : '';
      this.prevPageToken = res.prevPageToken ? res.prevPageToken : '';
    } else {
      this.getChannelVideos();
    }
  }

  getChannelVideos(pageToken?: string, title?: string): void {
    this.loading = true;
    this.youtubeDataService.getChannelVideos(this.orderBy, pageToken, title, this.channelId).subscribe(
      (res) => {
        console.log(res);
        // setting properties values from the response
        this.channelVideos = res.items;
        this.nextPageToken = res.nextPageToken ? res.nextPageToken : '';
        this.prevPageToken = res.prevPageToken ? res.prevPageToken : '';

        this.saveChannelIdParam();
        // stop loading state and clear input
        this.loading = false;
        this.channelUrl = '';

        // saving the latest response in the local storage
        localStorage.setItem('latestResponse', JSON.stringify(res));
      }, (err) => {
        localStorage.removeItem('latestResponse');
        this.channelVideos = [];
        this.loading = false;
        this.channelUrl = '';
        this.channelId = '';
        console.log(err);
      }
    );
  }

  order(keyWord: string): void {
    this.orderBy = keyWord;
    this.getChannelVideos();
  }

  search(): void {
    clearTimeout(this.searchTimeout);
    this.orderBy = '';
    this.searchTimeout = setTimeout(() => {
      this.getChannelVideos(undefined, this.titleKeyword);
    }, 1000);
  }

  prev(): void {
    if (this.prevPageToken) {
      this.getChannelVideos(this.prevPageToken, this.titleKeyword);
    }
  }

  next(): void {
    if (this.nextPageToken) {
      this.getChannelVideos(this.nextPageToken, this.titleKeyword);
    }
  }

  getVideosByChannelId(): void {
    this.channelId = this.channelUrl.substring(this.channelUrl.lastIndexOf('/') + 1);
    this.getChannelVideos();
  }

  // saving the last channel id as a query parameter
  saveChannelIdParam(): void {
    const queryParams: Params = { channelId: this.channelId };
    this.router.navigate(
    [],
    {
      relativeTo: this.activatedRoute,
      queryParams,
      queryParamsHandling: 'merge', // remove to replace all query params by provided
    });
  }
}
