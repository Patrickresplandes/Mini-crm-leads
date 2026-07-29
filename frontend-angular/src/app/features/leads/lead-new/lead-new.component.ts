import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { LeadFormComponent } from "../../../shared/lead-form/lead-form.component";
import { LeadService } from "../../../core/services/leads.service";
import { Lead } from "../../../core/models/lead.model";
@Component({
  selector: 'app-lead-new',
  standalone: true,
  imports: [LeadFormComponent],
  templateUrl: './lead-new.component.html',
  styleUrl: './lead-new.component.css'
})
export class LeadNewComponent {
private leadsService = inject(LeadService);
private router = inject(Router);

isSubmitting = false;
error: string | null = null;

handleCreate(data: Partial<Lead>){
  this.error = null
  this.isSubmitting=true;

  this.leadsService.createLead(data).subscribe({
    next:()=>{
      this.router.navigate(["/leads"]);
    },
    error: (err) => {
      this.isSubmitting = false;
      this.error = err.error?.error || "Erro ao criar lead"
    }
  })
}
}
