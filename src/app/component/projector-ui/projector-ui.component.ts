import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {ProjectorServiceService} from '../../service/projector-service.service';


@Component({
  selector: 'app-projector-ui',
  templateUrl: './projector-ui.component.html',
  styleUrls: ['./projector-ui.component.css']
})
export class ProjectorUIComponent implements OnInit {
  output;
  words = [];
  labels = [];
  loading= false;

  formGroup = new FormGroup({
    english: new FormControl(),
    sinhala: new FormControl()
  });
  constructor(private router: Router, private projectorService: ProjectorServiceService) { }
  ngOnInit(): void {

  }
  submit() {
    this.words = [];
    this.labels = [];
    this.loading = true;
    this.projectorService.request(this.formGroup.get('english').value, this.formGroup.get('sinhala').value).subscribe(response => {
      this.output =  this.extractor(JSON.parse("[" + response["result"] + "]"));

    });
  }
  extractor(respone) {
    if(respone != null) {
      this.loading = false;
    }
    for (var val of respone[0]) {
       this.words.push(val["text"].trim());
       this.labels.push(val["frame"].trim().replace("]", "").replace("[B-", "").replace("[I-", "").replace("[O-", "").replace("[", ""));

    }
  }

}
