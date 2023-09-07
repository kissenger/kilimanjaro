import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {


  constructor(
    private router: Router,
  ) { }

  async ngOnInit() {
  }

  onClick() {
    this.router.navigate(['/create-record']);
  }
}
