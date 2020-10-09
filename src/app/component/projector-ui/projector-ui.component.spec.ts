import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectorUIComponent } from './projector-ui.component';

describe('ProjectorUIComponent', () => {
  let component: ProjectorUIComponent;
  let fixture: ComponentFixture<ProjectorUIComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectorUIComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectorUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
