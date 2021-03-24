import { Component, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
})
export class HelpComponent implements AfterViewInit {

  fragment: string | null = null;

  constructor(private readonly route: ActivatedRoute) {
    this.route.fragment.subscribe(fragment => {
      this.fragment = fragment;
      this.scroll();
    });
  }

  ngAfterViewInit(): void {
    this.scroll();
  }

  scroll(): void {
    if (this.fragment) {
      document.querySelector(`#${this.fragment}`)?.scrollIntoView();
    }
  }

}
