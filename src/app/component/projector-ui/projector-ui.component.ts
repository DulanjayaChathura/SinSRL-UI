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
  word='';
  roleList = [];
  argList = [];
  keyList = [];
  verbList=[];
  loading= false;
  roles =[]

  formGroup = new FormGroup({
    english: new FormControl(),
    sinhala: new FormControl()
  });
  constructor(private router: Router, private projectorService: ProjectorServiceService) { }
  ngOnInit(): void {

  }
  submit() {
    this.roles = [];
    this.keyList=[];
    this.verbList=[];
    this.loading = true;
    this.projectorService.request(this.formGroup.get('english').value, this.formGroup.get('sinhala').value).subscribe(response => {
      this.output =  this.extractor(JSON.parse("[" + response["result"] + "]"));


    });
  }
  extractor(respone) {
     console.log(respone)
    if(respone != null) {
      this.loading = false;
    }
    for (var val of respone[0]) {
       this.roleList = [];
       this.word=val["text"]
       if(this.word=="*"){
         continue
       }

       // console.log(val["frame"].replace("[", "").replace("]", "").split(", "))

       this.keyList.push(this.word);
       this.argList = val["frame"].replace("[", "").replace("]", "").split(", ")
      // console.log(this.argList)

       for (var val of this.argList) {
          // console.log(val)
          //  console.log(val.search("."))
//          console.log(val.includes("."))
          if (val.includes(".")){
            this.roleList.push(val)
            this.verbList.push(val)
//            console.log(val)
          }else if(val.includes("ARG")){
            // console.log(val.substring(2))
            this.roleList.push(val.substring(2))
          }else{
            this.roleList.push("__")
          }


       }
      this.roles.push(this.roleList)
       // this.labels.push(val["frame"].replace("]", "").replace("[B-", "").replace("[I-", "").replace("[O-", "").replace("[", ""));

    }
    //  console.log(this.roles)
    // console.log(this.keyList)
    // console.log(this.verbList)
  }

}
