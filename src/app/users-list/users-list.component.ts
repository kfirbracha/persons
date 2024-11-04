import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { IUser } from '../shared/interfaces/user.interface';
import { HttpService } from '../shared/services/http.service';
@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
})
export class UsersListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'email'];
  dataSource = signal<IUser[]>([]);
  pageIndex = signal(0);
  pageSize = signal(10);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private httpService = inject(HttpService);

  paginatedUsers = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    const end = start + this.pageSize();
    return this.dataSource().slice(start, end);
  });
  ngOnInit(): void {
    this.getUsers();
  }

  ngAfterViewInit(): void {
    this.paginator.page.subscribe((event) => {
      this.pageIndex.set(this.paginator.pageIndex);
      this.pageSize.set(this.paginator.pageSize);
    });

    // if(this.sort){
    //   this.sort.sortChange.subscribe(()=>{
    //     this.dataSource.update(users => {
    //       return [...users].sort((a, b) => {
    //         const isAsc = this.sort.direction
    //       })
    //     })
    //   })
    // }
  }
  private getUsers(): void {
    this.httpService.get<IUser[]>('persons').subscribe((users: IUser[]) => {
      this.dataSource.set(users);
    });
  }
}
