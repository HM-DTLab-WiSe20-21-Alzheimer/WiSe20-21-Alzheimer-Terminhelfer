import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconComponent } from './icon.component';

describe('IconComponent', () => {
  let component: IconComponent;
  let fixture: ComponentFixture<IconComponent>;

  beforeEach(async () => {
    await TestBed
      .configureTestingModule({
        declarations: [IconComponent],
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IconComponent);
    component = fixture.componentInstance;
    component.name = 'question';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render correct', () => {
    // arrange
    const element = fixture.nativeElement.querySelector('.uil');
    // act
    const containsIcon = element.classList.contains('uil-question');
    // assert
    expect(containsIcon).toBeTruthy();
  });

  it('should render correct with another icon', () => {
    // arrange
    component.name = 'exclamation';
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('.uil');
    // act
    const containsIcon = element.classList.contains('uil-exclamation');
    // assert
    expect(containsIcon).toBeTruthy();
  });
});
