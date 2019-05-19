import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-resgister',
  templateUrl: './resgister.component.html',
  styleUrls: ['./resgister.component.css']
})
export class ResgisterComponent implements OnInit {

   constructor(private auth: AuthenticationService, private router: Router ) { }

  ngOnInit() {
  }

  registerForm = new FormGroup({
    userName: new FormControl(),
    email: new FormControl(''),
    firstName: new FormControl(),
    lastName: new FormControl(),
    password: new FormControl('', [Validators.required]),
    repeatPassword: new FormControl('', [Validators.required]),
    gender: new FormControl(),
  })

  register(){
    this.auth.register(this.registerForm).subscribe(
      () =>{
        this.router.navigate(['/']);
      },
      err =>{
        console.log('register error');
      }
    );
  }

}
