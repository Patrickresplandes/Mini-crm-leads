import { Component, EventEmitter, Input, Output, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators, FormsModule } from "@angular/forms";
import { Lead, LeadStatus } from "../../core/models/lead.model";

@Component({
  selector: 'app-lead-form',
  standalone: true,
  imports: [CommonModule,FormsModule, ReactiveFormsModule],
  templateUrl: './lead-form.component.html',
  styleUrl: './lead-form.component.css'
})
export class LeadFormComponent {
private fb = inject(FormBuilder);

@Input() defaultValues: Partial<Lead> | null = null;
@Input() submitLabel = "Salvar"
@Input() isSubmitting = false;
@Output() formSubmit = new EventEmitter<Partial<Lead>>();

 statusOptions: { value: LeadStatus; label: string }[] = [
    { value: "NOVO", label: "Novo" },
    { value: "CONTATADO", label: "Contatado" },
    { value: "NEGOCIANDO", label: "Negociando" },
    { value: "FECHADO", label: "Fechado" },
    { value: "PERDIDO", label: "Perdido" },
  ];

  leadForm = this.fb.group({
    name: ["", [Validators.required, Validators.minLength(2)]],
    company: ["", [Validators.required, Validators.minLength(2)]],
    status: ["NOVO" as LeadStatus, [Validators.required]],
    estimatedValue: [0, [Validators.required, Validators.min(0)]]
  });

  ngOnInit(){
    if (this.defaultValues){
      this.leadForm.patchValue({
        name: this.defaultValues.name ?? "",
        company: this.defaultValues.company ?? "",
        status: this.defaultValues.status ?? "NOVO",
        estimatedValue: this.defaultValues.estimatedValue ?? 0,
      })
    }
  }

  onSubmit(){
    if (this.leadForm.invalid){
      this.leadForm.markAllAsTouched();
      return;
    }
    this.formSubmit.emit(this.leadForm.value as Partial<Lead>)
  }

  get name(){
    return this.leadForm.get("name")!;
  }

  get company(){
    return this.leadForm.get("company")!;
  }

  get status(){
    return this.leadForm.get("status")!;
  }
  get estimatedValeu(){
     return this.leadForm.get("estimatedValue")!;
  }
}
