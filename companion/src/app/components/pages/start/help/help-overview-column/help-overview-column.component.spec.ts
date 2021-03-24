import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpOverviewColumnComponent } from './help-overview-column.component';
import { IconComponent } from '../../../../icon/icon.component';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';

describe('HelpOverviewColumnComponent', () => {

  let component: HelpOverviewColumnComponent;
  let fixture: ComponentFixture<HelpOverviewColumnComponent>;

  beforeEach(async () => {
    await TestBed
      .configureTestingModule({
        declarations: [HelpOverviewColumnComponent, IconComponent, TestHostComponent],
        imports: [RouterTestingModule],
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpOverviewColumnComponent);
    component = fixture.componentInstance;
    component.icon = 'question';
    component.section = 'section-question';

    fixture.detectChanges();
  });

  describe('Constructor', () => {
    it('should construct', () => {
      expect(component).toBeDefined();
      expect(component.icon).toEqual('question');
      expect(component.section).toEqual('section-question');
    });
  });

  describe('Render', () => {

    it('should have icon', () => {
      const iconDe = fixture.debugElement.query(By.css('[data-test="icon"] .uil'));
      const iconNe = iconDe.nativeElement;

      expect(iconNe).toBeDefined();
      expect(iconNe).not.toBeNull();
      expect(iconNe.classList.contains('uil-question')).toBeTruthy();
    });

    it('should have link to section', () => {
      const iconDe = fixture.debugElement.query(By.css('[data-test="link"]'));
      const href = iconDe.properties.href;

      expect(href.indexOf('#section-question')).not.toEqual(-1);
    });

    it('should render title', () => {
      const testFixture = TestBed.createComponent(TestHostComponent);
      testFixture.detectChanges();

      const iconDe = testFixture.debugElement.query(By.css('[data-test="title"]'));

      expect(iconDe.nativeElement.textContent).toEqual('Title');
    });

    it('should render content', () => {
      const testFixture = TestBed.createComponent(TestHostComponent);
      testFixture.detectChanges();

      const iconDe = testFixture.debugElement.query(By.css('[data-test="content"]'));

      expect(iconDe.nativeElement.textContent).toEqual('Content');
    });
  });

  @Component({
    template: `
      <app-help-overview-column icon="question" section="section-question">
        <ng-container title>Title</ng-container>
        <ng-container content>Content</ng-container>
      </app-help-overview-column>
    `,
  })
  class TestHostComponent {
  }

});

