import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HitNRunComponent } from './hit-n-run.component';

describe('HitNRunComponent', () => {
  let component: HitNRunComponent;
  let fixture: ComponentFixture<HitNRunComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HitNRunComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HitNRunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
