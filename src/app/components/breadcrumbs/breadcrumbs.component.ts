import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MaterialModule } from '../../shared/modules/material';

@Component({
  selector: 'app-bread-crumbs',
  imports: [
    CommonModule,

    MaterialModule
  ],
  standalone: true,
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.scss'
})
export class BreadCrumbsComponent implements OnChanges {
  @Input() breadcrumbs: Array<string> = ['/'];
  @Output() emitIndexStack: EventEmitter<number> = new EventEmitter<number>();

  breadcrumbs$: BehaviorSubject<Array<string>> = new BehaviorSubject(this.breadcrumbs);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['breadcrumbs'].currentValue) {
      const breadcrumbs = changes['breadcrumbs'].currentValue;
      this.breadcrumbs$.next(breadcrumbs);
    }
  }

  onClickCrumb(index: number) {
    this.emitIndexStack.emit(index);
  }
}
