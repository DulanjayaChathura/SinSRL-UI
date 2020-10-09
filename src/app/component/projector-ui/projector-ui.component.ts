import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {ProjectorServiceService} from '../../service/projector-service.service'


@Component({
  selector: 'app-projector-ui',
  templateUrl: './projector-ui.component.html',
  styleUrls: ['./projector-ui.component.css']
})
export class ProjectorUIComponent implements OnInit {
  output
  formGroup = new FormGroup({
    english: new FormControl(),
    sinhala: new FormControl()
  });
  constructor(private router: Router,private projectorService: ProjectorServiceService) { }
  ngOnInit(): void {
  }
  submit() {
    // console.log(this.formGroup.get('english').value);
    // console.log(this.formGroup.get('sinhala').value);
    this.projectorService.request(this.formGroup.get('english').value,this.formGroup.get('sinhala').value).subscribe(response=>{

    this.output= JSON.stringify(response)
    })
  }
}
