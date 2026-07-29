import { Component, OnInit, inject, signal, effect } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { LeadService } from "../../core/services/leads.service";
import { Lead, LeadStatus, PaginatedLeads } from "../../core/models/lead.model";


@Component({
  selector: 'app-leads',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './leads.component.html',
  styleUrl: './leads.component.css'
})
export class LeadsComponent {
private leadsService = inject(LeadService);

statusOptions: { value: LeadStatus | ""; label: string}[] = [
  {value:"", label:"Todos"},
  {value:"NOVO", label:"Novo"},
  {value:"CONTATADO", label:"Contatado"},
  {value:"NEGOCIANDO", label:"Negociando"},
  {value:"FECHADO", label:"Fechado"},
  {value:"PERDIDO", label:"Perdido"}
];

status = signal<LeadStatus | "">("");
search = signal("")
page = signal(1)

leads = signal<Lead[]>([]);
pagination = signal<PaginatedLeads["pagination"] |null>(null);
isLoading = signal(true)
isError = signal(false);

constructor(){
  //reexecua sempre que tiver mudança
  effect(() => {
    this.fetchLeads(this.status(), this.search(), this.page());
  },
{allowSignalWrites: true});
}

ngOnInit(){
  // já é diaparado no effect()
  //não é necessario chamar
}

fetchLeads(status: LeadStatus | "", search: string, page:number){
  this.isLoading.set(true);
  this.isError.set(false);

  this.leadsService
  .getLeads({status: status || undefined, search: search || undefined, page})
  .subscribe({
    next: (data) => {
      this.leads.set(data.data);
      this.pagination.set(data.pagination);
      this.isLoading.set(false)
    },
    error: () => {
      this.isError.set(true);
      this.isLoading.set(false)
    }
  })
}

onSearchChange(value: string){
  this.search.set(value);
  this.page.set(1);
}

onStatusChange(value: string){
  this.status.set(value as LeadStatus | "");
  this.page.set(1);
}

nextPage(){
  const total = this.pagination()?.totalPages ?? 1;
  this.page.update((p) => Math.min(total, p + 1));
}

prevPage(){
  this.page.update((p) => Math.max(1, p-1))
}

formatCurrency(value:number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

statusColor(status: LeadStatus):string {
  const colors: Record<LeadStatus, string>= {
    NOVO:"bg-blue-100 text-blue-700",
    CONTATADO:"bg-yellow-100 text-yellow-700",
    NEGOCIANDO:"bg-purple-100 text-purple-700",
    FECHADO:"bg-green-100 text-green-700",
    PERDIDO:"bg-red-100 text-red-700"
  };
  return colors[status]
}
}
