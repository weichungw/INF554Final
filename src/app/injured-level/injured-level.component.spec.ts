import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InjuredLevelComponent } from './injured-level.component';

describe('InjuredLevelComponent', () => {
  let component: InjuredLevelComponent;
  let fixture: ComponentFixture<InjuredLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InjuredLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InjuredLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
