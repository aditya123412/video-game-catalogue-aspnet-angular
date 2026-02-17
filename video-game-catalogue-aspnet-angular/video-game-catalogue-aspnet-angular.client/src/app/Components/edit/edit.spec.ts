import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { Edit } from './edit';
import { GameService } from '../../services/game.service';

describe('Edit', () => {
  let component: Edit;
  let fixture: ComponentFixture<Edit>;
  let mockSvc: jasmine.SpyObj<GameService>;

  beforeEach(async () => {
    mockSvc = jasmine.createSpyObj('GameService', ['getById', 'create', 'update', 'delete']);
    mockSvc.getById.and.returnValue(of({ id: 1, title: 'G1', description: 'd', genre: 'Arcade', publisher: 'P1', year: 2020, price: 1 }));
    mockSvc.create.and.returnValue(of({ id: 2, title: 'new' } as any));
    mockSvc.update.and.returnValue(of(null as any));
    mockSvc.delete.and.returnValue(of(null as any));

    await TestBed.configureTestingModule({
      declarations: [Edit],
      imports: [FormsModule, RouterTestingModule],
      providers: [{ provide: GameService, useValue: mockSvc }]
    }).compileComponents();

    fixture = TestBed.createComponent(Edit);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate fields when loading an existing game', () => {
    // simulate route param handled by component (already invoked in ngOnInit via test setup)
    expect(component.title()).toBe('G1');
    expect(component.genre()).toBe('Arcade');
  });
});
