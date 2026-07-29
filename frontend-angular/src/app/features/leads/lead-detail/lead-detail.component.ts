import { Component, OnInit, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { LeadFormComponent } from "../../../shared/lead-form/lead-form.component";
import { LeadService } from "../../../core/services/leads.service";
import { InteractionService } from "../../../core/services/interactions.service";
import { Lead, Interaction } from "../../../core/models/lead.model";
import { FormsModule } from "@angular/forms";


@Component({
  selector: 'app-lead-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, LeadFormComponent],
  templateUrl: './lead-detail.component.html',
  styleUrl: './lead-detail.component.css'
})
export class LeadDetailComponent implements OnInit{
private route = inject(ActivatedRoute);
private router = inject(Router);
private leadsService = inject(LeadService);
private interactionsService = inject(InteractionService);

leadId = this.route.snapshot.paramMap.get("id")!;

lead = signal<Lead | null>(null);
isLoading = signal(true)
isError = signal(false);

isEditing = signal(false);
isDeleting = signal(false);
error = signal<string | null>(null)

interactions = signal<Interaction[]>([]);
interactionsLoading = signal(true);
newNote = signal("");
isAddingInteraction = signal(false);

ngOnInit(){
  this.loadLead();
  this.loadInteractions();
}

loadLead(){
  this.isLoading.set(true);
  this.isError.set(false);

  this.leadsService.getLeadById(this.leadId).subscribe({
    next: (data) => {
      this.lead.set(data);
      this.isLoading.set(false);
    },
    error: () => {
      this.isError.set(true);
      this.isLoading.set(false);
    }
  })
}

loadInteractions(){
  this.interactionsLoading.set(true);
  this.interactionsService.getInteractions(this.leadId).subscribe({
    next:(data) => {
      this.interactions.set(data);
      this.interactionsLoading.set(false);
    },
    error: ()=>{
      this.interactionsLoading.set(false);
    }
  })
}

handleUpdate(data: Partial<Lead>){
  this.error.set(null);

  this.leadsService.updateLead(this.leadId, data).subscribe({
    next:() => {
      this.loadLead();
      this.isEditing.set(false);
    },
    error: (err) => {
      this.error.set(err.error?.error || "Erro ao atualizar lead")
    }
  })
}
handleDelete(){
  const confirmed = window.confirm(
    "Tem certeza que deseja excluir este lead? Essa ação não pode ser desfeita."
  );
  if(!confirmed) return;

  this.isDeleting.set(true);
  this.leadsService.deleteLead(this.leadId).subscribe({
    next:() => {
      this.router.navigate(["/leads"])
    },
    error: (err) => {
      this.error.set(err.error?.error || "Error ao excluir lead.");
      this.isDeleting.set(false);
    }
  })
}
handleAddInteraction(){
  const note = this.newNote().trim();
  if(!note){
    this.error.set("A nota não pode ser vazia")
    return;
  }

  this.error.set(null);
  this.isAddingInteraction.set(true);

  this.interactionsService.createIntection(this.leadId, note).subscribe({
    next: () => {
      this.newNote.set("");
        this.isAddingInteraction.set(false)
        this.loadInteractions()
    },
    error:(err) => {
      this.error.set(err.error?.error || "Erro ao adicionar interação.");
      this.isAddingInteraction.set(false);
    }
  })
}

handleDeleteInteraction(interactionId: string){
  const confirmed = window.confirm("Excluir esta interação")
  if(!confirmed) return;

  this.interactionsService.deleteInteraction(this.leadId, interactionId).subscribe({
    next:() => this.loadInteractions(),
    error: (err) => {
      this.error.set(err.error?.error || "Erro ao excluir interação")
    }
  })
}

formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
}

formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day:"2-digit",
    month:"2-digit",

    year:"numeric",
    hour:"2-digit",
    minute:"2-digit",
  }).format( new Date(dateString))
}
}
