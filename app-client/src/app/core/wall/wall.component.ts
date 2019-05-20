import { Component, OnInit } from '@angular/core';
import {CoreService} from "../core.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Tweet} from "../../models/post";

@Component({
  selector: 'app-wall',
  templateUrl: './wall.component.html',
  styleUrls: ['./wall.component.css']
})
export class WallComponent implements OnInit {

  posts: any[];
  postCreateForm: FormGroup;

  constructor(private coreService: CoreService) { }

  ngOnInit() {

    this.postCreateForm = new FormGroup({
      content: new FormControl('', Validators.required)
    });
    this.getWallPosts();

  }

  onSubmit() {
    if (this.postCreateForm.valid) {

      const tweet = new Tweet();

      tweet.id = null;
      tweet.content = this.postCreateForm.controls['content'].value;
      tweet.createdUser = {_id: '5ce1b529d20f444cb8eb1061', userName: '12'};

      // console.log(individual);
      this.coreService.savePostService(tweet).subscribe(
        data => console.log(data),
        error => {
          console.log('error');
          // this.msgs.push({severity: 'error', summary: error});
        },
        () => {
          console.log('success');
          this.getWallPosts();
          // this.msgs = [];
          // this.msgs.push({severity: 'success', summary: 'Success Message', detail: 'Order submitted'});
        }
      );
    }
  }

  getWallPosts () {
    this.coreService.getPostsService()
      .subscribe(posts => {

        this.posts = posts;
        console.log(this.posts);

      });
  }

  ngOnDestroy() {

  }

}
