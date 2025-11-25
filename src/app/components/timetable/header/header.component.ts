import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderToolsComponent } from './header-tools/header-tools.component';
import { HeaderSelectorsComponent } from './header-selectors/header-selectors.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, HeaderToolsComponent, HeaderSelectorsComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  // inputs ce vin din app
  @Input() groups!: number[];
  @Input() selectedGroup!: number;
  @Input() specializations!: string[];
  @Input() selectedSpecialization!: string;
  @Input() selectedWeek!: 1 | 2;

  // outputs ce merg spre app
  @Output() groupChange = new EventEmitter<number>();
  @Output() specializationChange = new EventEmitter<string>();
  @Output() weekChange = new EventEmitter<1 | 2>();
  @Output() filtersChange = new EventEmitter<{curs: boolean, sem: boolean, lab: boolean}>();
}
