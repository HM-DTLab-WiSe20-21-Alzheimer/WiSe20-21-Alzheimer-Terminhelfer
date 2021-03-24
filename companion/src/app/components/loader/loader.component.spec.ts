import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderComponent } from './loader.component';
import { By } from '@angular/platform-browser';

describe('LoaderComponent', () => {
  let component: LoaderComponent;
  let fixture: ComponentFixture<LoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoaderComponent],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create with isBig set to false', () => {
    // arrange
    const element = fixture.debugElement.query(By.css('.loader')).nativeElement;
    // act
    const containsIsBigClass = element.classList.contains('is-big');
    // assert
    expect(component.isBig).toBeFalsy();
    expect(containsIsBigClass).toBeFalsy();
  });

  it('should update with isBig', () => {
    // arrange
    component.isBig = true;
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('.loader')).nativeElement;
    // act
    const containsIsBigClass = element.classList.contains('is-big');
    // assert
    expect(component.isBig).toBeTruthy();
    expect(containsIsBigClass).toBeTruthy();
  });
});
