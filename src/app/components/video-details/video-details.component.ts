import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ClickEvent } from 'angular-star-rating';
import { YoutubeDataService } from 'src/app/services/youtube-data.service';
import { VideoDetailsService } from 'src/app/services/video-details.service';
import { Favourite } from 'src/app/viewmodels/favourite';
import { VideoRate } from 'src/app/viewmodels/video-rate';

@Component({
  selector: 'app-video-details',
  templateUrl: './video-details.component.html',
  styleUrls: ['./video-details.component.scss']
})
export class VideoDetailsComponent implements OnInit {

  clickEvent: ClickEvent | undefined;
  isRated = false;
  rating = 0;
  videoId: any = '';
  videoDetails: any;
  isAddedToFavourites = false;
  favourites: Favourite[] = [];
  ratings: VideoRate[] = [];
  btnDisabled = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private youtubeDataService: YoutubeDataService,
    private videoDetailsService: VideoDetailsService,
  ) { }

  ngOnInit(): void {
    // getting the video id from the path (paramMap)
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id') ? params.get('id') : '';
      if (this.videoId === id) { return; }
      this.videoId = id;
      console.log(this.videoId);
      this.getFavourites();
      this.getRatings();
      this.getVideoDetails();
    });
  }

  getVideoDetails(): void {
    this.youtubeDataService.getVideoDetails(this.videoId).subscribe((res) => {
      this.videoDetails = res.items[0];
    }, (err) => {
      console.log(err);
    });
  }

  // Rate/Update video rating
  onStarClick = ($event: ClickEvent) => {
    if (!this.isRated) {
      this.addRate($event.rating);
    } else {
      this.updateRate($event.rating);
    }
  }

  addRate(rating: number): void {
    this.videoDetailsService.addRate(this.videoId, rating).then(res => {
      this.rating = rating;
      this.isRated = true;
      this.getRatings();
    }, err => console.log(err));
  }

  updateRate(rating: number): void {
    const currentVideoRate = this.ratings.find((el: VideoRate) => el.videoId === this.videoId);
    const id = currentVideoRate?.id || '';
    this.videoDetailsService.updateRate(id, rating).then(res => {
      this.rating = rating;
      this.isRated = true;
      this.getRatings();
    });
  }

  // getting ratings and updating 'isRated' state
  getRatings(): void {
    const sub = this.videoDetailsService.getRates().subscribe(data => {
      this.ratings = data.map((el: any) => {
        sub.unsubscribe();
        return {
          id: el.payload.doc.id,
          ...el.payload.doc.data()
        };
      });
      this.checkIsRated();
    });
  }

  checkIsRated(): void {
    const currentVideoRate = this.ratings.find((el: VideoRate) => el.videoId === this.videoId);
    if (currentVideoRate) {
      this.rating = currentVideoRate.rating;
      this.isRated = true;
    } else {
      this.isRated = false;
    }
  }

  // getting favourites and updating 'isAddedToFavourites' state
  getFavourites(): void {
    const sub = this.videoDetailsService.getFavourites().subscribe(data => {
      this.favourites = data.map((el: any) => {
        sub.unsubscribe();
        return {
          id: el.payload.doc.id,
          ...el.payload.doc.data()
        };
      });
      this.checkIfAddedToFavourites();
    });
  }

  checkIfAddedToFavourites(): void {
    const currentFavVideo = this.favourites.find((el: Favourite) => el.videoId === this.videoId);
    if (currentFavVideo) {
      this.isAddedToFavourites = true;
    } else {
      this.isAddedToFavourites = false;
    }
  }

  // Add/Remove video to/from favourites
  switchFavouriteState(): void {
    if (!this.isAddedToFavourites) {
      this.btnDisabled = true;
      this.addToFavourites();
    } else {
      this.btnDisabled = true;
      this.removeFromFavourites();
    }
  }

  addToFavourites(): void {
    this.videoDetailsService.addToFavourites(this.videoId)
    .then(res => {
      this.btnDisabled = false;
      this.isAddedToFavourites = true;
      this.getFavourites();
    }, (err) => console.log(err));
  }

  removeFromFavourites(): void {
    const id = this.favourites.find((el: Favourite) => el.videoId === this.videoId)?.id || '';
    this.videoDetailsService.removeFromFavourites(id).then(res => {
      this.btnDisabled = false;
      this.isAddedToFavourites = false;
      this.getFavourites();
    }, err => console.log(err));
  }

}
