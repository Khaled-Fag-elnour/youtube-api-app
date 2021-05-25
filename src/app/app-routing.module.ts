import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { VideoDetailsComponent } from './components/video-details/video-details.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'videoDetails/:id', component: VideoDetailsComponent},
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  // not found component
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
