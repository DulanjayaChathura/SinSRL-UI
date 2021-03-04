import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ProjectorUIComponent } from './component/projector-ui/projector-ui.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule} from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NavBarComponent } from './component/nav-bar/nav-bar.component';
import { AboutComponent } from './component/about/about.component';
import { PapersComponent } from './component/papers/papers.component';
import { SourceComponent } from './component/source/source.component';
import { FooterComponent } from './component/footer/footer.component';


@NgModule({
  declarations: [
    AppComponent,
    ProjectorUIComponent,
    NavBarComponent,
    AboutComponent,
    PapersComponent,
    SourceComponent,
    FooterComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot([
      {path: '', component: ProjectorUIComponent},
      {path: 'about', component: AboutComponent},
      {path: 'papers', component: PapersComponent},
      {path: 'source', component: SourceComponent},
    ]),
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
