import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accordion-group',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="supuesto-group">
      <button class="supuesto-group-header" [attr.aria-expanded]="open()" (click)="toggle()">
        <span class="supuesto-group-title">
          <ng-content select="[slot=title]" />
        </span>
        <svg class="chevron" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
             [style.transform]="open() ? 'rotate(180deg)' : ''">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      @if (open()) {
        <div class="supuesto-group-body open">
          <ng-content />
        </div>
      }
    </div>
  `
})
export class AccordionGroupComponent {
  open = signal(false);
  toggle(): void { this.open.update(v => !v); }
}
