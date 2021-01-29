import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {ProjectorServiceService} from '../../service/projector-service.service';
import {PredictService} from "../../service/predict.service";


@Component({
  selector: 'app-projector-ui',
  templateUrl: './projector-ui.component.html',
  styleUrls: ['./projector-ui.component.css']
})
export class ProjectorUIComponent implements OnInit {
  output;
  word = '';
  roleList = [];
  argList = [];
  keyList = [];
  verbList = [];
  loading = false;
  roles = []
  roleListIndex = -1
  keyListIndex = -1
  dictionaryObjects = []
  dictionaryObject = {}
  tempdictionaryObject = ""
  tempkeyList = ""
  flag: any;
  visible: boolean;
  sinhalaText: string;
  showSentence: boolean;

  formGroup = new FormGroup({
    english: new FormControl(),
    sinhala: new FormControl(),
    submitType: new FormControl(),
  });


  constructor(private router: Router, private projectorService: ProjectorServiceService, private predictService: PredictService) {
    this.flag = 'project';
    this.visible = true;
    this.showSentence = false;
  }

  ngOnInit(): void {
  }

  handleChange(event): void {
    var selected = event.target.value;
    this.visible = selected !== 'predict';
    this.showSentence = false;
  }

  submit() {
    this.roles = [];
    this.keyList = [];
    this.verbList = [];
    this.dictionaryObjects = [];
    this.dictionaryObject = {};
    this.roleListIndex = -1;
    this.keyListIndex = -1;
    this.loading = true;
    this.sinhalaText = this.formGroup.get('sinhala').value;
    const submitType = this.formGroup.get('submitType').value; // whether predict or project

    if (submitType === 'project') {
      this.projectorService.request(this.formGroup.get('english').value, this.formGroup.get('sinhala').value).subscribe(response => {
        this.showSentence = true;
        this.output = this.projectExtractor(JSON.parse("[" + response["result"] + "]"));
      }, error => {
        this.loading = false;
      });
    } else {
      this.predictService.request(this.formGroup.get('sinhala').value).subscribe(response => {
        this.showSentence = true;
        this.output = this.predictExtractor(JSON.parse(response['result']));
      }, error => {
        this.loading = false;
      });
    }
  }

  /**
   * Extract data from the response in projection task
   * @param respone
   */
  projectExtractor(respone) {
    // if (respone != null) {
    //   this.loading = false;
    // }
    this.loading = false;

    for (var val of respone[0]) {
      this.roleList = [];
      this.word = val["text"]
      if (this.word == "*") {
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
        if (val.includes(".")) {
          this.roleList.push(val)
          this.verbList.push(val)
//            console.log(val)
        } else if (val.includes("ARG")) {
          // console.log(val.substring(2))
          this.roleList.push(val.substring(2))
        } else {
          this.roleList.push("____")
        }
      }
      this.roles.push(this.roleList)
      // this.labels.push(val["frame"].replace("]", "").replace("[B-", "").replace("[I-", "").replace("[O-", "").replace("[", ""));
    }
    this.makeDictionaryProjectObjects()
  }

  /**
   * Extract data from the response in prediction task
   * @param responce
   */
  predictExtractor(responce) {
    // if (responce != null) {
    //   this.loading = false;
    // }
    this.loading = false;

    for (let tokenJsonObj of responce) {
      tokenJsonObj = JSON.parse(tokenJsonObj);
      this.roleList = [];
      this.word = tokenJsonObj['text'];
      if (this.word === '*') {
        continue;
      }

      this.keyList.push(this.word);
      console.log(this.word);
      console.log(tokenJsonObj['frame']);
      this.argList = tokenJsonObj['frame'].replace('[', '').replace(']', '').split(', ');

      for (let tag of this.argList) {
        if (tag.includes('.')) {
          this.roleList.push(tag.substring(3, tag.length - 1));
          if (!this.verbList.includes(tag.substring(3, tag.length - 1))) {
            this.verbList.push(tag.substring(3, tag.length - 1));
          }
        } else if (tag.includes('ARG')) {
          this.roleList.push(tag.substring(3, tag.length - 1));
        } else {
          this.roleList.push(tag.substring(1, tag.length - 1
          ));
        }
      }
      this.roles.push(this.roleList);
    }
    this.makeDictionaryPredictObjects();
  }

  /**
   * Make dictionary objects while projection tasks
   */
  makeDictionaryProjectObjects() {
    for (var item of this.verbList) {
      this.roleListIndex = this.roleListIndex + 1
      this.keyListIndex = -1
      this.dictionaryObject = {}
      for (var val of this.roles) {
        this.keyListIndex = this.keyListIndex + 1
        this.tempkeyList = this.keyList[this.keyListIndex]
        this.tempdictionaryObject = this.dictionaryObject[val[this.roleListIndex]]
        // console.log(this.tempdictionaryObject)
        if (this.tempdictionaryObject != null) {
          this.dictionaryObject[val[this.roleListIndex]] = this.tempdictionaryObject + " " + this.tempkeyList
        } else {
          this.dictionaryObject[val[this.roleListIndex]] = this.tempkeyList
        }

      }
      this.dictionaryObjects.push(this.dictionaryObject)

    }
  }

  /**
   * To find consecutive indexes that have similar roles
   * return dictionary contains list of ranges for each predicate
   */
  findConsecutiveSimilarRoles() {

    const roleLstSize = this.roles.length;
    let predicateRoleRanges = {};
    for (let i = 0; i < this.roles[0].length; i++) {
      let previousIndex = 0;
      let latestIndex = 0;
      let consecutiveRanges = [];

      while (1) {
        if (latestIndex !== roleLstSize - 1) { // check whether the last index
          // tslint:disable-next-line:max-line-length
          if ((this.roles[latestIndex][i] === this.roles[latestIndex + 1][i])) { // if role equals for the next role increase the latest index
            latestIndex += 1;
          } else {  // Otherwise, add the range from previous index(start of a range) to current latestindex(end of a range)
            consecutiveRanges.push([previousIndex, latestIndex]);
            latestIndex += 1; // increase latest index by 1
            previousIndex = latestIndex; // assisgn current latest index into previous index

          }
        } else {
          consecutiveRanges.push([previousIndex, latestIndex]);
          latestIndex += 1;
          previousIndex = latestIndex;
          break;
        }
      }

      predicateRoleRanges[this.verbList[i]] = consecutiveRanges; // add identified ranges into dic using predicates as key
    }
    return predicateRoleRanges;
  }

  /**
   * Create dictionary objects for each predicate
   * keys : sinhala text span
   * values : tag
   */
  makeDictionaryPredictObjects() {
    const similarRangesList = this.findConsecutiveSimilarRoles();

    for (const predicate in similarRangesList) {
      let dictionary = {};
      for (const range of similarRangesList[predicate]) {  // loop through similar ranges
        const text = this.keyList.slice(range[0], range[1] + 1); // slice the token list according to the ranges
        const textSpan = text.join(' ');
        const tag = this.roles[range[0]][this.verbList.indexOf(predicate)]; // get the relevant tag for the text span
        dictionary[textSpan] = tag; // add into dictionary
      }
      this.dictionaryObjects.push(dictionary);
    }
  }

  returnZero() {
    return 0;
  }
}


