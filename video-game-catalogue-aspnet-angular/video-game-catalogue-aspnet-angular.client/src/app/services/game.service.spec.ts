import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { GameService } from './game.service';
import { AppConfig } from './app-config.service';

describe('GameService', () => {
  let service: GameService;
  let httpMock: HttpTestingController;
  const base = 'https://api.test/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        GameService,
        { provide: AppConfig, useValue: { apiBaseUrl: base } }
      ]
    });

    service = TestBed.inject(GameService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAll should GET the games list', () => {
    const mock = [{ id: 1, title: 'G1' }];

    service.getAll().subscribe(res => {
      expect(res).toEqual(mock as any);
    });

    const req = httpMock.expectOne(`${base}/games`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('search should call search endpoint with params', () => {
    const mock: any[] = [];
    service.search('term', 'Arcade', 'P1').subscribe(res => {
      expect(res).toEqual(mock);
    });

    const req = httpMock.expectOne(r => r.url === `${base}/games/search`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('q')).toBe('term');
    expect(req.request.params.get('genre')).toBe('Arcade');
    expect(req.request.params.get('publisher')).toBe('P1');
    req.flush(mock);
  });

  it('getFilters should GET filters', () => {
    const mock = { genres: ['Arcade'], publishers: ['P1'] };
    service.getFilters().subscribe(res => expect(res).toEqual(mock));
    const req = httpMock.expectOne(`${base}/games/filters`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('getById should GET a game by id', () => {
    const mock = { id: 1, title: 'G1' };
    service.getById(1).subscribe(res => expect(res).toEqual(mock as any));
    const req = httpMock.expectOne(`${base}/games/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('create should POST new game', () => {
    const payload: any = { title: 'New' };
    const returned = { id: 5, title: 'New' };

    service.create(payload).subscribe(res => expect(res).toEqual(returned));
    const req = httpMock.expectOne(`${base}/games`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(returned);
  });

  it('update should PUT updated game', () => {
    const payload: any = { id: 2, title: 'Updated' };
    service.update(2, payload).subscribe(res => expect(res).toBeTruthy());
    const req = httpMock.expectOne(`${base}/games/2`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush(null);
  });

  it('delete should DELETE game', () => {
    service.delete(3).subscribe(res => expect(res).toBeTruthy());
    const req = httpMock.expectOne(`${base}/games/3`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

});
