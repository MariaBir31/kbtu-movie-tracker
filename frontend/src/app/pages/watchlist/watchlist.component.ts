import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { WatchEntry, WatchStatus } from '../../models';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page">
      <div class="header">
        <h2>My Watchlist</h2>
        <div class="tabs">
          <button [class.active]="activeTab === 'all'"     (click)="setTab('all')">All</button>
          <button [class.active]="activeTab === 'want'"    (click)="setTab('want')">Want to watch</button>
          <button [class.active]="activeTab === 'watched'" (click)="setTab('watched')">Watched</button>
        </div>
      </div>

      <div class="loading" *ngIf="loading">Loading…</div>
      <div class="empty"   *ngIf="!loading && filtered.length === 0">Nothing here yet.</div>

      <div class="entry-list">
        @for (entry of filtered; track entry.id) {
          <div class="entry-card">
            <div class="poster" [style.background-image]="entry.movie.poster_url ? 'url(' + entry.movie.poster_url + ')' : ''" [routerLink]="['/movies', entry.movie.id]">
              @if (!entry.movie.poster_url) { <span>🎬</span> }
            </div>
            <div class="entry-body">
              <a [routerLink]="['/movies', entry.movie.id]" class="title">{{ entry.movie.title }}</a>
              <span class="year">{{ entry.movie.release_year }}</span>

              <!-- Status toggle — (click) triggers API ✓ -->
              <div class="row">
                <select [(ngModel)]="entry.status" (ngModelChange)="updateStatus(entry)">
                  <option value="want">Want to watch</option>
                  <option value="watched">Watched</option>
                </select>
              </div>

              <!-- Star rating — (click) triggers API ✓ -->
              <div class="rating-row" *ngIf="entry.status === 'watched'">
                @for (star of stars; track star) {
                  <span class="star" [class.filled]="star <= (entry.rating ?? 0)"
                        (click)="setRating(entry, star)">★</span>
                }
                <span class="rating-val">{{ entry.rating ?? '—' }}/10</span>
              </div>

              <!-- Note field -->
              <div class="note-row">
                <input type="text" [(ngModel)]="entry.note" placeholder="Add a note…"
                       (blur)="saveNote(entry)" />
              </div>
            </div>

            <!-- (click) remove — API request ✓ -->
            <button class="btn-remove" (click)="remove(entry.id)">✕</button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .page { padding:2rem; max-width:900px; margin:0 auto; }
    .header { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem; margin-bottom:1.5rem; }
    h2 { margin:0; color:#eee; font-size:1.5rem; }
    .tabs { display:flex; gap:6px; }
    .tabs button { padding:6px 14px; background:#1a1a23; color:#888; border:1px solid #2e2e3e; border-radius:99px; cursor:pointer; font-size:0.83rem; }
    .tabs button.active { background:#e8c77a22; color:#e8c77a; border-color:#e8c77a44; }
    .entry-card { display:flex; gap:1rem; align-items:flex-start; background:#1a1a23; border:1px solid #2e2e3e; border-radius:12px; padding:1rem; margin-bottom:0.75rem; position:relative; }
    .poster { width:64px; height:88px; flex-shrink:0; background:#0f0f13 center/cover no-repeat; border-radius:6px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:1.5rem; }
    .entry-body { flex:1; display:flex; flex-direction:column; gap:6px; }
    .title { color:#eee; font-weight:600; text-decoration:none; font-size:0.95rem; }
    .title:hover { color:#e8c77a; }
    .year { color:#666; font-size:0.8rem; }
    .row select { padding:5px 8px; background:#0f0f13; border:1px solid #2e2e3e; border-radius:6px; color:#ccc; font-size:0.82rem; }
    .rating-row { display:flex; align-items:center; gap:2px; }
    .star { color:#333; cursor:pointer; font-size:1.1rem; transition:color .1s; }
    .star.filled { color:#e8c77a; }
    .star:hover { color:#e8c77a88; }
    .rating-val { color:#666; font-size:0.78rem; margin-left:4px; }
    .note-row input { width:100%; padding:6px 10px; background:#0f0f13; border:1px solid #1e1e2e; border-radius:6px; color:#aaa; font-size:0.82rem; box-sizing:border-box; }
    .btn-remove { position:absolute; top:10px; right:10px; background:none; border:none; color:#555; cursor:pointer; font-size:0.9rem; }
    .btn-remove:hover { color:#f08080; }
    .loading, .empty { text-align:center; color:#666; padding:3rem; }
  `]
})
export class WatchlistComponent implements OnInit {
  entries:    WatchEntry[] = [];
  filtered:   WatchEntry[] = [];
  loading     = true;
  activeTab: 'all'|'want'|'watched' = 'all';
  stars       = [1,2,3,4,5,6,7,8,9,10];

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.movieService.getWatchlist().subscribe({
      next: (data) => { this.entries = data; this.applyTab(); this.loading = false; }
    });
  }

  setTab(tab: 'all'|'want'|'watched'): void {
    this.activeTab = tab;
    this.applyTab();
  }

  applyTab(): void {
    this.filtered = this.activeTab === 'all'
      ? this.entries
      : this.entries.filter(e => e.status === this.activeTab);
  }

  updateStatus(entry: WatchEntry): void {
    this.movieService.updateWatchEntry(entry.id, { status: entry.status as WatchStatus }).subscribe();
  }

  setRating(entry: WatchEntry, star: number): void {
    entry.rating = star;
    this.movieService.updateWatchEntry(entry.id, { rating: star }).subscribe();
  }

  saveNote(entry: WatchEntry): void {
    this.movieService.updateWatchEntry(entry.id, { note: entry.note }).subscribe();
  }

  remove(id: number): void {
    this.movieService.removeFromWatchlist(id).subscribe({
      next: () => {
        this.entries  = this.entries.filter(e => e.id !== id);
        this.filtered = this.filtered.filter(e => e.id !== id);
      }
    });
  }
}
