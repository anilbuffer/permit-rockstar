"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  ArrowLeft,
  ArrowRight,
  HardHat,
  ChevronDown,
  Building,
  UserCheck,
} from "lucide-react";
import clsx from "clsx";
import { Button } from "@/components/ui/Button";
import { AddContractorModal } from "./AddContractorModal";
import { AddInspectionCodeModal } from "./AddInspectionCodeModal";
import {
  DEFAULT_PCA_PROVIDERS,
  DEFAULT_CONTRACTORS_DATA,
} from "@/lib/mock-data";
import type {
  PermitInspectionFormData,
  InspectionItem,
  InspectionStatus,
  InspectionContractor,
} from "@/lib/types";

interface Step2CompleteFormProps {
  formData: PermitInspectionFormData;
  onUpdateFormData: (data: Partial<PermitInspectionFormData>) => void;
  onBack: () => void;
  onProceedToPreview: () => void;
  contractors: InspectionContractor[];
  onAddContractor: (contractor: InspectionContractor) => void;
}

export function Step2CompleteForm({
  formData,
  onUpdateFormData,
  onBack,
  onProceedToPreview,
  contractors,
  onAddContractor,
}: Step2CompleteFormProps) {
  const [isAddContractorOpen, setIsAddContractorOpen] = useState(false);
  const [isAddCodeModalOpen, setIsAddCodeModalOpen] = useState(false);
  const [validationError, setValidationError] = useState("");

  // Common inspection code templates for quick selection
  const INSPECTION_TEMPLATES = [
    { code: "101", name: "Building Framing" },
    { code: "105", name: "Foundation & Footing" },
    { code: "201", name: "Rough Electrical" },
    { code: "301", name: "Rough Plumbing" },
    { code: "305", name: "Plumbing Underground" },
    { code: "401", name: "Mechanical Rough-In" },
    { code: "501", name: "Roof Dry-In & Sheathing" },
    { code: "601", name: "Insulation & Energy" },
    { code: "701", name: "Final Building & Life Safety" },
  ];

  function handleProviderChange(providerId: string) {
    const selected = DEFAULT_PCA_PROVIDERS.find((p) => p.id === providerId);
    if (selected) {
      onUpdateFormData({
        providerId: selected.id,
        firmName: selected.companyName,
        qualifierName: selected.name,
        phone: selected.phone,
        email: selected.email,
      });
    }
  }

  function handleContractorSelect(contractorId: string) {
    const selected = contractors.find((c) => c.id === contractorId);
    if (selected) {
      onUpdateFormData({
        contractorId: selected.id,
        contractorName: `${selected.name} / ${selected.companyName}`,
        contractorLicense: selected.licenseNumber,
        contractorPhone: selected.phone,
        contractorEmail: selected.email,
      });
    }
  }

  function handleAddInspectionRow() {
    const nextIndex = formData.inspections.length + 1;
    const defaultTemplate = INSPECTION_TEMPLATES[(nextIndex - 1) % INSPECTION_TEMPLATES.length];

    const newRow: InspectionItem = {
      id: `insp_${Date.now()}_${Math.random()}`,
      code: defaultTemplate.code,
      inspection: defaultTemplate.name,
      status: "Passed",
      date: new Date().toISOString().split("T")[0],
      inspector: formData.qualifierName || "Ali Marar",
    };

    onUpdateFormData({
      inspections: [...formData.inspections, newRow],
    });
  }

  function handleUpdateInspectionRow(id: string, updates: Partial<InspectionItem>) {
    const updated = formData.inspections.map((row) =>
      row.id === id ? { ...row, ...updates } : row
    );
    onUpdateFormData({ inspections: updated });
  }

  function handleRemoveInspectionRow(id: string) {
    if (formData.inspections.length <= 1) {
      return; // Keep at least one inspection
    }
    const updated = formData.inspections.filter((row) => row.id !== id);
    onUpdateFormData({ inspections: updated });
  }

  function handleValidateAndProceed() {
    if (!formData.permitNumber.trim()) {
      setValidationError("Permit Number is required");
      return;
    }
    if (!formData.city.trim()) {
      setValidationError("City is required");
      return;
    }
    if (formData.inspections.length === 0) {
      setValidationError("Please add at least one conducted inspection row");
      return;
    }
    setValidationError("");
    onProceedToPreview();
  }

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Eyebrow & Brand Page Header */}
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-primary">
            Permit Inspection <span className="mx-1.5 text-slate-soft">/</span> Step 02 - Complete Form
          </p>
          <h1 className="mt-1 text-[20px] font-bold tracking-[-0.035em] text-ink sm:text-[26px]">
            Complete Inspection Form
          </h1>
          <p className="mt-0.5 text-[12.5px] font-medium text-slate">
            {formData.city?.toUpperCase() || "BOCA RATON"} &bull; Permit <span className="font-mono font-bold text-primary">{formData.permitNumber || "256966"}</span>
          </p>
        </div>

        <div className="flex items-center gap-3 self-start rounded-xl border border-paper-line bg-paper-raised px-3.5 py-2 text-[12px] shadow-xs sm:self-auto">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-soft text-[12px] font-bold text-primary">
            2
          </span>
          <div>
            <p className="font-semibold text-ink">Step 2 of 3</p>
            <p className="text-slate">Form Verification</p>
          </div>
        </div>
      </header>

      {validationError && (
        <div className="rounded-xl bg-alert-soft/70 border border-alert/30 px-4 py-3 text-[13px] font-semibold text-alert">
          {validationError}
        </div>
      )}

      {/* Top 2 Cards: Side-by-Side Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: PROJECT & DEPARTMENT DETAILS */}
        <div className="rounded-2xl border border-paper-line bg-paper-raised p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-paper-line">
            <Building size={16} className="text-primary" />
            <h2 className="text-[12px] font-bold uppercase tracking-[0.1em] text-ink">
              Project & Department Details
            </h2>
          </div>

          <div>
            <label className="block font-mono text-[10.5px] font-bold uppercase tracking-wider text-slate mb-1">
              Permit Number
            </label>
            <input
              type="text"
              value={formData.permitNumber}
              onChange={(e) => onUpdateFormData({ permitNumber: e.target.value })}
              className="w-full rounded-xl border border-paper-line bg-paper px-3.5 py-2 text-[13.5px] font-mono font-semibold text-ink focus:border-primary focus:bg-white focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block font-mono text-[10.5px] font-bold uppercase tracking-wider text-slate mb-1">
              Project Address
            </label>
            <input
              type="text"
              value={formData.projectAddress}
              onChange={(e) => onUpdateFormData({ projectAddress: e.target.value })}
              placeholder="Project Address"
              className="w-full rounded-xl border border-paper-line bg-paper px-3.5 py-2 text-[13.5px] text-ink focus:border-primary focus:bg-white focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block font-mono text-[10.5px] font-bold uppercase tracking-wider text-slate mb-1">
              County / Building Department
            </label>
            <input
              type="text"
              value={formData.countyDepartment}
              onChange={(e) => onUpdateFormData({ countyDepartment: e.target.value })}
              className="w-full rounded-xl border border-paper-line bg-paper px-3.5 py-2 text-[13.5px] text-ink focus:border-primary focus:bg-white focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Card 2: PRIVATE PROVIDER INFO */}
        <div className="rounded-2xl border border-paper-line bg-paper-raised p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-paper-line">
            <div className="flex items-center gap-2.5">
              <UserCheck size={16} className="text-primary" />
              <h2 className="text-[12px] font-bold uppercase tracking-[0.1em] text-ink">
                Private Provider Info
              </h2>
            </div>

            {/* Provider quick-selector dropdown on header right */}
            <div className="relative">
              <select
                value={formData.providerId}
                onChange={(e) => handleProviderChange(e.target.value)}
                className="appearance-none rounded-lg border border-paper-line bg-paper px-3 py-1 text-[11.5px] font-semibold text-ink focus:border-primary focus:outline-none pr-7 cursor-pointer"
              >
                {DEFAULT_PCA_PROVIDERS.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={13}
                className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-soft"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[10.5px] font-bold uppercase tracking-wider text-slate mb-1">
              Name of Firm
            </label>
            <input
              type="text"
              value={formData.firmName}
              onChange={(e) => onUpdateFormData({ firmName: e.target.value })}
              className="w-full rounded-xl border border-paper-line bg-paper px-3.5 py-2 text-[13.5px] text-ink focus:border-primary focus:bg-white focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block font-mono text-[10.5px] font-bold uppercase tracking-wider text-slate mb-1">
              Qualifier Name (Contact)
            </label>
            <input
              type="text"
              value={formData.qualifierName}
              onChange={(e) => onUpdateFormData({ qualifierName: e.target.value })}
              className="w-full rounded-xl border border-paper-line bg-paper px-3.5 py-2 text-[13.5px] text-ink focus:border-primary focus:bg-white focus:outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[10.5px] font-bold uppercase tracking-wider text-slate mb-1">
                Phone
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => onUpdateFormData({ phone: e.target.value })}
                className="w-full rounded-xl border border-paper-line bg-paper px-3.5 py-2 text-[13.5px] text-ink focus:border-primary focus:bg-white focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block font-mono text-[10.5px] font-bold uppercase tracking-wider text-slate mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => onUpdateFormData({ email: e.target.value })}
                className="w-full rounded-xl border border-paper-line bg-paper px-3.5 py-2 text-[13.5px] text-ink focus:border-primary focus:bg-white focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Middle Card: CONTRACTOR INFO */}
      <div className="rounded-2xl border border-paper-line bg-paper-raised p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-paper-line">
          <HardHat size={16} className="text-primary" />
          <h2 className="text-[12px] font-bold uppercase tracking-[0.1em] text-ink">
            Contractor Info
          </h2>
        </div>

        <div>
          <label className="block font-mono text-[10.5px] font-bold uppercase tracking-wider text-slate mb-1.5">
            Select Saved Contractor
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <select
                value={formData.contractorId}
                onChange={(e) => handleContractorSelect(e.target.value)}
                className="w-full appearance-none rounded-xl border border-paper-line bg-paper px-4 py-2.5 text-[13.5px] font-medium text-ink focus:border-primary focus:bg-white focus:outline-none transition-colors pr-10 cursor-pointer"
              >
                <option value="">Select Contractor</option>
                {contractors.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} / {c.companyName} ({c.licenseNumber})
                  </option>
                ))}
              </select>
              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-soft"
              />
            </div>

            {/* + Button */}
            <button
              type="button"
              onClick={() => setIsAddContractorOpen(true)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary hover:bg-primary-dark text-white shadow-2xs transition-colors"
              title="Add new contractor"
            >
              <Plus size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Selected Contractor summary inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <div>
            <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-slate mb-1">
              Contractor / Company
            </label>
            <input
              type="text"
              value={formData.contractorName}
              onChange={(e) => onUpdateFormData({ contractorName: e.target.value })}
              className="w-full rounded-lg border border-paper-line bg-paper px-3 py-1.5 text-[12px] text-ink focus:border-primary focus:bg-white focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-slate mb-1">
              License #
            </label>
            <input
              type="text"
              value={formData.contractorLicense}
              onChange={(e) => onUpdateFormData({ contractorLicense: e.target.value })}
              className="w-full rounded-lg border border-paper-line bg-paper px-3 py-1.5 text-[12px] text-ink focus:border-primary focus:bg-white focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-slate mb-1">
              Phone
            </label>
            <input
              type="text"
              value={formData.contractorPhone}
              onChange={(e) => onUpdateFormData({ contractorPhone: e.target.value })}
              className="w-full rounded-lg border border-paper-line bg-paper px-3 py-1.5 text-[12px] text-ink focus:border-primary focus:bg-white focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-slate mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.contractorEmail}
              onChange={(e) => onUpdateFormData({ contractorEmail: e.target.value })}
              className="w-full rounded-lg border border-paper-line bg-paper px-3 py-1.5 text-[12px] text-ink focus:border-primary focus:bg-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Bottom Card: INSPECTIONS CONDUCTED */}
      <div className="rounded-2xl border border-paper-line bg-paper-raised p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-paper-line">
          <h2 className="text-[12px] font-bold uppercase tracking-[0.1em] text-ink">
            Inspections Conducted
          </h2>

          {/* Actions on header right */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAddCodeModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-paper-line bg-paper hover:bg-paper-raised px-3.5 py-1.5 text-[12px] font-semibold text-ink shadow-2xs transition-colors"
            >
              <Plus size={14} className="text-primary" /> Add Inspection Code
            </button>

            {/* + Add Row button */}
            <button
              type="button"
              onClick={handleAddInspectionRow}
              className="inline-flex items-center gap-1.5 rounded-lg border border-forest-soft bg-forest-soft/30 hover:bg-forest-soft/60 px-3.5 py-1.5 text-[12px] font-semibold text-forest shadow-2xs transition-colors"
            >
              <Plus size={14} /> Add Row
            </button>
          </div>
        </div>

        {/* Inspections Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12.5px] text-ink">
            <thead>
              <tr className="border-b border-paper-line text-[10.5px] font-mono font-bold uppercase tracking-wider text-slate">
                <th className="py-2.5 px-3 w-10">#</th>
                <th className="py-2.5 px-3 w-28">CODE</th>
                <th className="py-2.5 px-3 min-w-[200px]">INSPECTION</th>
                <th className="py-2.5 px-3 w-32">STATUS</th>
                <th className="py-2.5 px-3 w-36">DATE</th>
                <th className="py-2.5 px-3 min-w-[160px]">INSPECTOR</th>
                <th className="py-2.5 px-2 w-10 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-paper-line">
              {formData.inspections.map((row, idx) => (
                <tr key={row.id} className="hover:bg-paper/30 transition-colors">
                  {/* # */}
                  <td className="py-3 px-3 font-mono font-bold text-slate text-[12px]">
                    {idx + 1}
                  </td>

                  {/* CODE */}
                  <td className="py-3 px-3">
                    <input
                      type="text"
                      value={row.code}
                      onChange={(e) =>
                        handleUpdateInspectionRow(row.id, { code: e.target.value })
                      }
                      className="w-full rounded-lg border border-paper-line bg-paper px-2.5 py-1.5 font-mono text-[12px] font-bold text-ink focus:border-primary focus:bg-white focus:outline-none"
                    />
                  </td>

                  {/* INSPECTION */}
                  <td className="py-3 px-3">
                    <input
                      type="text"
                      value={row.inspection}
                      onChange={(e) =>
                        handleUpdateInspectionRow(row.id, { inspection: e.target.value })
                      }
                      placeholder="e.g. Building Framing, Rough Plumbing..."
                      className="w-full rounded-lg border border-paper-line bg-paper px-3 py-1.5 text-[12.5px] font-medium text-ink focus:border-primary focus:bg-white focus:outline-none"
                    />
                  </td>

                  {/* STATUS */}
                  <td className="py-3 px-3">
                    <select
                      value={row.status}
                      onChange={(e) =>
                        handleUpdateInspectionRow(row.id, {
                          status: e.target.value as InspectionStatus,
                        })
                      }
                      className={clsx(
                        "w-full rounded-lg border px-2.5 py-1.5 text-[11.5px] font-bold focus:outline-none cursor-pointer",
                        row.status === "Passed" && "border-forest/30 bg-forest-soft text-forest",
                        row.status === "Partial" && "border-amber-300 bg-secondary-soft text-ink",
                        row.status === "Failed" && "border-alert/30 bg-alert-soft text-alert",
                        row.status === "Scheduled" && "border-primary/30 bg-primary-soft text-primary"
                      )}
                    >
                      <option value="Passed">Passed</option>
                      <option value="Partial">Partial</option>
                      <option value="Failed">Failed</option>
                      <option value="Scheduled">Scheduled</option>
                    </select>
                  </td>

                  {/* DATE */}
                  <td className="py-3 px-3">
                    <input
                      type="date"
                      value={row.date}
                      onChange={(e) =>
                        handleUpdateInspectionRow(row.id, { date: e.target.value })
                      }
                      className="w-full rounded-lg border border-paper-line bg-paper px-2.5 py-1.5 text-[12px] text-ink focus:border-primary focus:bg-white focus:outline-none"
                    />
                  </td>

                  {/* INSPECTOR */}
                  <td className="py-3 px-3">
                    <input
                      type="text"
                      value={row.inspector}
                      onChange={(e) =>
                        handleUpdateInspectionRow(row.id, { inspector: e.target.value })
                      }
                      placeholder="Inspector Name"
                      className="w-full rounded-lg border border-paper-line bg-paper px-3 py-1.5 text-[12.5px] text-ink focus:border-primary focus:bg-white focus:outline-none"
                    />
                  </td>

                  {/* Delete Action */}
                  <td className="py-3 px-2 text-right">
                    <button
                      type="button"
                      disabled={formData.inspections.length <= 1}
                      onClick={() => handleRemoveInspectionRow(row.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-soft hover:bg-alert-soft hover:text-alert transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                      title="Remove inspection row"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-paper-line">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="gap-2 bg-white"
        >
          <ArrowLeft size={16} /> Back to Permit Lookup
        </Button>

        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={handleValidateAndProceed}
          className="gap-2 shadow-md"
        >
          Preview Report <ArrowRight size={16} />
        </Button>
      </div>

      {/* Add Contractor Modal */}
      <AddContractorModal
        isOpen={isAddContractorOpen}
        onClose={() => setIsAddContractorOpen(false)}
        onAddContractor={(newContractor) => {
          onAddContractor(newContractor);
          onUpdateFormData({
            contractorId: newContractor.id,
            contractorName: `${newContractor.name} / ${newContractor.companyName}`,
            contractorLicense: newContractor.licenseNumber,
            contractorPhone: newContractor.phone,
            contractorEmail: newContractor.email,
          });
        }}
      />

      {/* Add Inspection Code Modal */}
      <AddInspectionCodeModal
        isOpen={isAddCodeModalOpen}
        onClose={() => setIsAddCodeModalOpen(false)}
        cityName={formData.city}
        onAddCode={(item) => {
          const newRow: InspectionItem = {
            id: `insp_${Date.now()}`,
            code: item.code,
            inspection: item.name,
            status: "Passed",
            date: new Date().toISOString().split("T")[0],
            inspector: formData.qualifierName || "Ali Marar",
          };
          onUpdateFormData({
            inspections: [...formData.inspections, newRow],
          });
        }}
      />
    </div>
  );
}
