import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from "@angular/common";
import { DashboardService } from "../../core/services/dashboard.service";
import { DashboardMetrics } from "../../core/models/lead.model";


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);

  metrics = signal<DashboardMetrics | null>(null);
  isLoading = signal(true);
  isError = signal(false);

  ngOnInit(){
      this.loadMetrics();
  }

  loadMetrics(){
    this.isLoading.set(true);
    this.isError.set(false);

    this.dashboardService.getMetrics().subscribe({
      next: (data) => {
        this.metrics.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isError.set(true);
        this.isLoading.set(false);
      }
    })
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat("pt-BR", {
      style:"currency",
      currency:"BRL",
    }).format(value)
  }
}
