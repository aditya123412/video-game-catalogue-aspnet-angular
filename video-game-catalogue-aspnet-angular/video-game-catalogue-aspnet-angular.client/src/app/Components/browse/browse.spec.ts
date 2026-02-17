import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { Browse } from './browse';
import { GameService } from '../../services/game.service';

describe('Browse', () => {
  let component: Browse;
  let fixture: ComponentFixture<Browse>;
  let mockSvc: jasmine.SpyObj<GameService>;

  beforeEach(async () => {
    mockSvc = jasmine.createSpyObj('GameService', ['getAll', 'getFilters', 'getById', 'search']);
    mockSvc.getAll.and.returnValue(of([{ id: 1, title: 'G1', genre: 'Arcade', publisher: 'P1', year: 2020, price: 1 }]));
    mockSvc.getFilters.and.returnValue(of({ genres: ['Arcade'], publishers: ['P1'] }));
    mockSvc.getById.and.returnValue(of({ id: 1, title: 'G1', genre: 'Arcade', publisher: 'P1', year: 2020, price: 1 }));
    mockSvc.search.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [Browse],
      imports: [FormsModule, RouterTestingModule],
      providers: [{ provide: GameService, useValue: mockSvc }]
    }).compileComponents();

    fixture = TestBed.createComponent(Browse);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads games on init', () => {
    const list = component.games();
    expect(list).toBeTruthy();
    expect(list && list.length).toBe(1);
    expect(mockSvc.getAll).toHaveBeenCalled();
  });
});
