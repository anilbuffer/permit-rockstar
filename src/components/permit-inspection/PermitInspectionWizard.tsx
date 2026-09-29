"use client";

import { useState, useEffect } from "react";
import { InspectionStepRail } from "./InspectionStepRail";
import { Step1PermitLookup } from "./Step1PermitLookup";
import { Step2CompleteForm } from "./Step2CompleteForm";
import { Step3PreviewReport } from "./Step3PreviewReport";
import {
  DEFAULT_INSPECTION_FORM_DATA,
  DEFAULT_INSPECTION_CITIES,
  DEFAULT_SAVED_PCA_RECORDS,
  DEFAULT_PERMITS_DATA,
  DEFAULT_CONTRACTORS_DATA,
  getStoredInspectionCities,
  saveStoredInspectionCity,
  getStoredSavedPcaRecords,
  deletePcaRecordItem,
  getStoredInspectionPermits,
  savePcaRecordItem,
} from "@/lib/mock-data";
import type {
  PermitInspectionStepKey,
  PermitInspectionFormData,
  InspectionCity,
  SavedPcaRecord,
  PermitLookupRecord,
  InspectionContractor,
} from "@/lib/types";

export function PermitInspectionWizard() {
  const [step, setStep] = useState<PermitInspectionStepKey>("lookup");
  const [formData, setFormData] = useState<PermitInspectionFormData>(DEFAULT_INSPECTION_FORM_DATA);
  const [cities, setCities] = useState<InspectionCity[]>(DEFAULT_INSPECTION_CITIES);
  const [savedPcaRecords, setSavedPcaRecords] = useState<SavedPcaRecord[]>(DEFAULT_SAVED_PCA_RECORDS);
  const [permitRecords, setPermitRecords] = useState<PermitLookupRecord[]>(DEFAULT_PERMITS_DATA);
  const [contractors, setContractors] = useState<InspectionContractor[]>(DEFAULT_CONTRACTORS_DATA);

  // Initialize data from local storage
  useEffect(() => {
    setCities(getStoredInspectionCities());
    setSavedPcaRecords(getStoredSavedPcaRecords());
    setPermitRecords(getStoredInspectionPermits());
  }, []);

  function handleUpdateFormData(updates: Partial<PermitInspectionFormData>) {
    setFormData((prev) => ({ ...prev, ...updates }));
  }

  function handleAddCity(newCity: InspectionCity) {
    const updated = saveStoredInspectionCity(newCity);
    setCities(updated);
  }

  function handleAddContractor(newContractor: InspectionContractor) {
    setContractors((prev) => [newContractor, ...prev]);
  }

  function handleDeletePcaRecord(id: string) {
    const updated = deletePcaRecordItem(id);
    setSavedPcaRecords(updated);
  }

  function handleSelectSavedPca(record: SavedPcaRecord) {
    // Look up city details
    const matchedCity = cities.find((c) => c.name.toLowerCase() === record.city.toLowerCase());

    setFormData((prev) => ({
      ...prev,
      permitNumber: record.permitNumber || prev.permitNumber,
      projectAddress: record.projectAddress || prev.projectAddress,
      city: record.city || prev.city,
      countyDepartment: matchedCity?.county || `${record.city} Building Department`,
      qualifierName: record.privateProvider || prev.qualifierName,
      contractorName: record.contractor || prev.contractorName,
    }));

    setStep("form");
  }

  function handleSelectPermit(permit: PermitLookupRecord) {
    const matchedCity = cities.find((c) => c.name.toLowerCase() === permit.city.toLowerCase());

    setFormData((prev) => ({
      ...prev,
      permitNumber: permit.permitNumber,
      projectAddress: permit.projectAddress,
      city: permit.city,
      countyDepartment: matchedCity?.county || `${permit.city} Building Department`,
      contractorName: permit.contractorName,
      qualifierName: permit.privateProvider || prev.qualifierName,
    }));

    setStep("form");
  }

  function handleSaveReportRecord() {
    const newRecord: SavedPcaRecord = {
      id: `ppi_${Date.now()}`,
      permitNumber: formData.permitNumber,
      projectAddress: formData.projectAddress,
      city: formData.city,
      privateProvider: formData.qualifierName,
      contractor: formData.contractorName,
      dateSaved: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      template: "standard",
      totalSheets: formData.inspections.length,
      fileName: `PPI_Inspection_${formData.permitNumber}.pdf`,
    };

    const updated = savePcaRecordItem(newRecord);
    setSavedPcaRecords(updated);
  }

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Step Rail Indicator (hidden during print) */}
      <div className="print:hidden">
        <InspectionStepRail current={step} onSelectStep={(s) => setStep(s)} />
      </div>

      {/* Step 1: Permit Lookup */}
      {step === "lookup" && (
        <Step1PermitLookup
          formData={formData}
          onUpdateFormData={handleUpdateFormData}
          onGenerateForm={() => setStep("form")}
          cities={cities}
          onAddCity={handleAddCity}
          savedPcaRecords={savedPcaRecords}
          permitRecords={permitRecords}
          onSelectSavedPca={handleSelectSavedPca}
          onSelectPermit={handleSelectPermit}
          onDeletePcaRecord={handleDeletePcaRecord}
        />
      )}

      {/* Step 2: Complete Form */}
      {step === "form" && (
        <Step2CompleteForm
          formData={formData}
          onUpdateFormData={handleUpdateFormData}
          onBack={() => setStep("lookup")}
          onProceedToPreview={() => setStep("preview")}
          contractors={contractors}
          onAddContractor={handleAddContractor}
        />
      )}

      {/* Step 3: Preview Report */}
      {step === "preview" && (
        <Step3PreviewReport
          formData={formData}
          onBackToForm={() => setStep("form")}
          onRestart={() => setStep("lookup")}
          onSaveReportRecord={handleSaveReportRecord}
        />
      )}
    </div>
  );
}
