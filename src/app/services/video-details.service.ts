import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Favourite } from '../viewmodels/favourite';
import { VideoRate } from '../viewmodels/video-rate';

@Injectable({
  providedIn: 'root'
})
export class VideoDetailsService {
  favourites: Favourite[] = [];
  constructor(private firestore: AngularFirestore) { }

  addToFavourites(videoId: string): Promise<any> {
    return this.firestore.collection('favourites').add({videoId});
  }

  getFavourites(): Observable<any> {
    return this.firestore.collection('favourites').snapshotChanges();
  }

  removeFromFavourites(id: string): Promise<any> {
    return this.firestore.doc('favourites/' + id).delete();
  }

  addRate(videoId: string, rating: number): Promise<any> {
    return this.firestore.collection('rates').add({videoId, rating});
  }

  getRates(): Observable<any> {
    return this.firestore.collection('rates').snapshotChanges();
  }

  updateRate(id: string, rating: number): Promise<any> {
    return this.firestore.collection('rates').doc(id).set( {rating }, { merge: true } );
  }
}
