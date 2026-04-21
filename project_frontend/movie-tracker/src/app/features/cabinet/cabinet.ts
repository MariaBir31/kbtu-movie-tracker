import { Component,OnInit,inject,signal,computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../core/services/movie';
import {Router, RouterLink} from '@angular/router';
@Component({
  selector: 'app-cabinet',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cabinet.html',
  styleUrl: './cabinet.css',
})
export class Cabinet implements OnInit {
  private movieService = inject(MovieService);
  private router = inject(Router);

  watchEntries = signal<any[]>([]);

  filterStatus = signal<string>('all');

  filteredEntries = computed(() => {
    const entries = this.watchEntries();
    const filter = this.filterStatus();

    if (filter === 'all') return entries;
    if (filter === 'with-notes') {
      return entries.filter(e =>
        e.note !== null &&           
        e.note !== undefined &&      
        e.note.toString().trim() !== '' 
      );
    }
    return entries.filter(e => e.status === filter);
  });

  watchedCount = computed(() => this.watchEntries().filter(e => e.status === 'watched').length);
  watchlistCount = computed(() => this.watchEntries().filter(e => e.status === 'want').length);
  reviewCount = computed(() => this.watchEntries().filter(e => e.note && e.note.trim() !== '').length);

  ngOnInit() {
    this.loadWatchlist();
  }

  loadWatchlist() {
    this.movieService.getWatchlist().subscribe(data => this.watchEntries.set(data));
  }
  setFilter(status: string) {
    this.filterStatus.set(status);
  }

  updateEntryStatus(entry: any, newStatus: string) {
    this.movieService.updateWatchlistEntry(entry.id, { status: newStatus }).subscribe(() => {
      this.watchEntries.update(list =>
        list.map(e => e.id === entry.id ? { ...e, status: newStatus } : e)
      );
    });
  }
  removeEntry(id: number) {
    this.movieService.deleteFromWatchlist(id).subscribe(() => {
      this.watchEntries.update(list => list.filter(e => e.id !== id));
    });
  }

  logout() {
    localStorage.removeItem('access');
    this.router.navigate(['/login']);
  }
}
