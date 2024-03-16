import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../shared/modules/material';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,

    MaterialModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy{
  loginForm!: FormGroup;
  subscription: Subscription = new Subscription();
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ){

  }

  ngOnInit(){
    this.initForm();
  }

  private initForm(){
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  submit(){
    if(this.loginForm.valid){
      const username = this.loginForm.controls['username'].value;
      const password = this.loginForm.controls['password'].value;
      this.subscription.add(
        this.authService.login(username, password).subscribe(res=>{
          if(res.statusCode === 200){
            const token = res.metaData;
            localStorage.setItem('accessToken', token.accessToken);
            localStorage.setItem('refreshToken', token.refreshToken);
            this.router.navigate(['/']);
          }
        })
      )
    }
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
