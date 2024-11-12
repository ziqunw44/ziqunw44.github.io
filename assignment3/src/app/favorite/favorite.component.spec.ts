import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteComponent } from './favorite.component';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
describe('FavoriteComponent', () => {
  let component: FavoriteComponent;
  let fixture: ComponentFixture<FavoriteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoriteComponent,NgbAlertModule]
    }) 
    .compileComponents();

    fixture = TestBed.createComponent(FavoriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
