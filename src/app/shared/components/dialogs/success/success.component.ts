import { DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './success.component.html',
  styleUrl: './success.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuccessComponent {
  private dialogRef = inject(DialogRef);
  private router = inject(Router);

  public handleClose() {
    this.router.navigate(['/']);
    this.dialogRef.close();
  }
}
