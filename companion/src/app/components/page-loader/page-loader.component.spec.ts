import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageLoaderComponent } from './page-loader.component';
import { LoaderComponent } from '../loader/loader.component';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('PageLoaderComponent', () => {
  let component: PageLoaderComponent;
  let fixture: ComponentFixture<PageLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageLoaderComponent, LoaderComponent, TestHostComponent],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('should contain big loader', () => {
    it('should contain loader', () => {
      // arrange
      const element = fixture.nativeElement.querySelector('.loader');
      // act
      // assert
      expect(element).toBeDefined();
    });

    it('should contain big loader', () => {
      // arrange
      const element = fixture.nativeElement.querySelector('.loader');
      // act
      const isBig = element.classList.contains('is-big');
      // assert
      expect(isBig).toBeTruthy();
    });
  });

  describe('should contain loader text', () => {
    it('should contain default loader text', () => {
      // arrange
      const want = 'Lädt';
      const wantCustom = '';
      const element = fixture.nativeElement.querySelector('[data-test="text-default"]');
      const elementCustom = fixture.nativeElement.querySelector('[data-test="text"]');
      // act
      const innerText = element.textContent.trim();
      const innerTextCustom = elementCustom.textContent.trim();
      // assert
      expect(innerText).toEqual(want);
      expect(innerTextCustom).toEqual(wantCustom);
    });

    it('should contain custom loader text', () => {
      const testFixture = TestBed.createComponent(TestHostComponent);
      testFixture.detectChanges();

      // arrange
      const wantCustom = 'Test';
      const element = testFixture.debugElement.query(By.css('span[data-test="text-default"]'));
      const elementCustom = testFixture.debugElement.query(By.css('span[data-test="text"]')).nativeElement;
      // act
      const innerTextCustom = elementCustom.textContent.trim();
      // assert
      expect(element).toBeFalsy();
      expect(innerTextCustom).toEqual(wantCustom);
    });
  });

  @Component({
    template: '<app-page-loader>Test</app-page-loader>',
  })
  class TestHostComponent {
  }
});
