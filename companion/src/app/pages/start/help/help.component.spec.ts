import { HelpComponent } from './help.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IconComponent } from '../../../components/icon/icon.component';
import { HelpOverviewColumnComponent } from '../../../components/pages/start/help/help-overview-column/help-overview-column.component';

describe('HelpComponent', () => {

  let component: HelpComponent;
  let fixture: ComponentFixture<HelpComponent>;

  beforeEach(async () => {
    await TestBed
      .configureTestingModule({
        declarations: [HelpComponent, IconComponent, HelpOverviewColumnComponent],
        imports: [RouterTestingModule],
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  describe('Constructor', () => {

    it('should create', () => {
      expect(component).toBeTruthy();
    });

  });

  describe('scroll', () => {

    it('should scroll', () => {
      const scroll = jest.fn();
      window.HTMLElement.prototype.scrollIntoView = scroll;

      component.fragment = 'alexa-skill';
      component.scroll();

      expect(scroll).toHaveBeenCalled();
    });

    it('should scroll on init', () => {
      const fix = TestBed.createComponent(HelpComponent);
      const comp = fix.componentInstance;
      const scroll = spyOn(comp, 'scroll');

      comp.ngAfterViewInit();

      expect(scroll).toHaveBeenCalled();
    });

  });

});
