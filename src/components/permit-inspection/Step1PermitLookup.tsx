"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Sparkles,
  FolderCheck,
  FileText,
  FileSpreadsheet,
  Eye,
  Pencil,
  Trash2,
  Check,
  RotateCcw,
  Search,
} from "lucide-react";
import clsx from "clsx";
import { Button } from "@/components/ui/Button";
import { AddCityModal } from "./AddCityModal";
import type {
  InspectionCity,
  SavedPcaRecord,
  PermitLookupRecord,
  PermitInspectionFormData,
} from "@/lib/types";

interface Step1PermitLookupProps {
  formData: PermitInspectionFormData;
  onUpdateFormData: (data: Partial<PermitInspectionFormData>) => void;
  onGenerateForm: () => void;
  cities: InspectionCity[];
  onAddCity: (city: InspectionCity) => void;
  savedPcaRecords: SavedPcaRecord[];
  permitRecords: PermitLookupRecord[];
  onSelectSavedPca: (pca: SavedPcaRecord) => void;
  onSelectPermit: (permit: PermitLookupRecord) => void;
  onDeletePcaRecord?: (id: string) => void;
}

export function Step1PermitLookup({
  formData,
  onUpdateFormData,
  onGenerateForm,
  cities,
  onAddCity,
  savedPcaRecords,
  permitRecords,
  onSelectSavedPca,
  onSelectPermit,
  onDeletePcaRecord,
}: Step1PermitLookupProps) {
  const [isAddCityOpen, setIsAddCityOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"pca" | "permits">("pca");

  // Filter state for Saved PCAs
  const [pcaProviderFilter, setPcaProviderFilter] = useState("");
  const [pcaContractorFilter, setPcaContractorFilter] = useState("");
  const [pcaAddressFilter, setPcaAddressFilter] = useState("");
  const [appliedPcaFilters, setAppliedPcaFilters] = useState({
    provider: "",
    contractor: "",
    address: "",
  });

  // Filter state for Permits
  const [permitNumberFilter, setPermitNumberFilter] = useState("");
  const [permitContractorFilter, setPermitContractorFilter] = useState("");
  const [permitAddressFilter, setPermitAddressFilter] = useState("");
  const [appliedPermitFilters, setAppliedPermitFilters] = useState({
    permitNumber: "",
    contractor: "",
    address: "",
  });

  // View Modal for Saved PCA
  const [previewRecord, setPreviewRecord] = useState<SavedPcaRecord | null>(null);

  // Form validation error
  const [formError, setFormError] = useState("");

  // Handlers for Saved PCAs filters
  function handleApplyPcaFilter() {
    setAppliedPcaFilters({
      provider: pcaProviderFilter.trim().toLowerCase(),
      contractor: pcaContractorFilter.trim().toLowerCase(),
      address: pcaAddressFilter.trim().toLowerCase(),
    });
  }

  function handleResetPcaFilter() {
    setPcaProviderFilter("");
    setPcaContractorFilter("");
    setPcaAddressFilter("");
    setAppliedPcaFilters({
      provider: "",
      contractor: "",
      address: "",
    });
  }

  // Handlers for Permits filters
  function handleApplyPermitFilter() {
    setAppliedPermitFilters({
      permitNumber: permitNumberFilter.trim().toLowerCase(),
      contractor: permitContractorFilter.trim().toLowerCase(),
      address: permitAddressFilter.trim().toLowerCase(),
    });
  }

  function handleResetPermitFilter() {
    setPermitNumberFilter("");
    setPermitContractorFilter("");
    setPermitAddressFilter("");
    setAppliedPermitFilters({
      permitNumber: "",
      contractor: "",
      address: "",
    });
  }

  // Filtered PCAs
  const filteredPcas = useMemo(() => {
    return savedPcaRecords.filter((rec) => {
      if (
        appliedPcaFilters.provider &&
        !(rec.privateProvider || "").toLowerCase().includes(appliedPcaFilters.provider)
      ) {
        return false;
      }
      if (
        appliedPcaFilters.contractor &&
        !(rec.contractor || "").toLowerCase().includes(appliedPcaFilters.contractor)
      ) {
        return false;
      }
      if (
        appliedPcaFilters.address &&
        !(rec.projectAddress || "").toLowerCase().includes(appliedPcaFilters.address)
      ) {
        return false;
      }
      return true;
    });
  }, [savedPcaRecords, appliedPcaFilters]);

  // Filtered Permits
  const filteredPermits = useMemo(() => {
    return permitRecords.filter((perm) => {
      if (
        appliedPermitFilters.permitNumber &&
        !(perm.permitNumber || "").toLowerCase().includes(appliedPermitFilters.permitNumber)
      ) {
        return false;
      }
      if (
        appliedPermitFilters.contractor &&
        !(perm.contractorName || "").toLowerCase().includes(appliedPermitFilters.contractor)
      ) {
        return false;
      }
      if (
        appliedPermitFilters.address &&
        !(perm.projectAddress || "").toLowerCase().includes(appliedPermitFilters.address)
      ) {
        return false;
      }
      return true;
    });
  }, [permitRecords, appliedPermitFilters]);

  function handleGenerateClick() {
    if (!formData.permitNumber.trim()) {
      setFormError("Please enter a permit number to generate the form");
      return;
    }
    setFormError("");
    onGenerateForm();
  }

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Eyebrow & Brand Page Header */}
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-primary">
            Permit Inspection <span className="mx-1.5 text-slate-soft">/</span> Step 01 - Lookup
          </p>
          <h1 className="mt-1 text-[20px] font-bold tracking-[-0.035em] text-ink sm:text-[26px]">
            Permit Inspection Report
          </h1>
          <p className="mt-1 max-w-2xl text-[12.5px] leading-relaxed text-slate">
            Generate an official Florida Private Provider Inspection (PPI) compliance report under § 553.791 F.S.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddCityOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-paper-line bg-paper-raised hover:bg-paper px-4 py-2 text-[12px] font-semibold text-ink shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus size={15} className="text-primary" /> Add City Profile
        </button>
      </header>

      {/* Main Card: PERMIT LOOKUP */}
      <div className="rounded-2xl border border-paper-line bg-paper-raised p-6 sm:p-7 shadow-xs">
        <div className="flex items-center gap-3 mb-5">
          <span className="font-mono text-[11px] font-bold tracking-[0.14em] text-primary uppercase">
            Permit Lookup
          </span>
          <div className="h-px flex-1 bg-paper-line" />
        </div>

        {formError && (
          <div className="mb-4 rounded-xl bg-alert-soft/60 border border-alert/30 px-4 py-2.5 text-[12.5px] font-semibold text-alert">
            {formError}
          </div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* CITY Dropdown */}
            <div>
              <label className="block font-mono text-[10.5px] font-bold uppercase tracking-wider text-slate mb-1.5">
                City / Jurisdiction
              </label>
              <div className="relative">
                <select
                  value={formData.city}
                  onChange={(e) => {
                    const selectedCity = cities.find((c) => c.name === e.target.value);
                    onUpdateFormData({
                      city: e.target.value,
                      countyDepartment: selectedCity?.county || e.target.value,
                    });
                  }}
                  className="w-full appearance-none rounded-xl border border-paper-line bg-paper px-4 py-2.5 text-[13.5px] font-medium text-ink focus:border-primary focus:bg-white focus:outline-none transition-colors pr-10 cursor-pointer shadow-2xs"
                >
                  {cities.map((city) => (
                    <option key={city.id} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-soft">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* PERMIT NUMBER Input */}
            <div>
              <label className="block font-mono text-[10.5px] font-bold uppercase tracking-wider text-slate mb-1.5">
                Permit Number
              </label>
              <input
                type="text"
                value={formData.permitNumber}
                onChange={(e) => {
                  onUpdateFormData({ permitNumber: e.target.value });
                  if (formError) setFormError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleGenerateClick();
                  }
                }}
                placeholder="Enter permit number (e.g. B-26-422413.000)"
                className="w-full rounded-xl border border-paper-line bg-paper px-4 py-2.5 text-[13.5px] text-ink placeholder:text-slate-soft/70 focus:border-primary focus:bg-white focus:outline-none transition-colors shadow-2xs font-mono font-medium"
              />
            </div>
          </div>

          {/* Generate Form Button */}
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleGenerateClick}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-dark py-2.5 px-6 text-[13.5px] font-semibold text-white shadow-xs transition-all cursor-pointer"
            >
              <Sparkles size={16} /> Generate Form & Continue →
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Section: Saved PCAs & Active Permits */}
      <div className="space-y-4">
        {/* Modern Segmented Tab Bar */}
        <div className="inline-flex items-center rounded-xl bg-paper p-1 border border-paper-line shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveTab("pca")}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 text-[12.5px] font-semibold rounded-lg transition-all",
              activeTab === "pca"
                ? "bg-white text-ink shadow-xs"
                : "text-slate hover:text-ink"
            )}
          >
            <FolderCheck size={15} className={activeTab === "pca" ? "text-primary" : "text-slate"} /> Saved PCAs
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("permits")}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 text-[12.5px] font-semibold rounded-lg transition-all",
              activeTab === "permits"
                ? "bg-white text-ink shadow-xs"
                : "text-slate hover:text-ink"
            )}
          >
            <FileSpreadsheet size={15} className={activeTab === "permits" ? "text-primary" : "text-slate"} /> Active Permits
          </button>
        </div>

        {/* Tab 1 Content: Saved PCAs */}
        {activeTab === "pca" && (
          <div className="rounded-2xl border border-paper-line bg-paper-raised overflow-hidden shadow-xs">
            {/* Filters Bar */}
            <div className="p-4 sm:p-5 border-b border-paper-line bg-paper/30">
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 items-end">
                <div>
                  <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate mb-1">
                    PRIVATE PROVIDER
                  </label>
                  <input
                    type="text"
                    value={pcaProviderFilter}
                    onChange={(e) => setPcaProviderFilter(e.target.value)}
                    placeholder="Enter provider name"
                    className="w-full rounded-xl border border-paper-line bg-paper px-3 py-2 text-[12.5px] text-ink focus:border-primary focus:bg-white focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate mb-1">
                    CONTRACTOR NAME
                  </label>
                  <input
                    type="text"
                    value={pcaContractorFilter}
                    onChange={(e) => setPcaContractorFilter(e.target.value)}
                    placeholder="Enter contractor name"
                    className="w-full rounded-xl border border-paper-line bg-paper px-3 py-2 text-[12.5px] text-ink focus:border-primary focus:bg-white focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate mb-1">
                    PROJECT ADDRESS
                  </label>
                  <input
                    type="text"
                    value={pcaAddressFilter}
                    onChange={(e) => setPcaAddressFilter(e.target.value)}
                    placeholder="Enter project address"
                    className="w-full rounded-xl border border-paper-line bg-paper px-3 py-2 text-[12.5px] text-ink focus:border-primary focus:bg-white focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleApplyPcaFilter}
                    className="flex-1 rounded-xl bg-primary hover:bg-primary-dark px-4 py-2 text-[12.5px] font-bold text-white shadow-2xs transition-colors"
                  >
                    Apply
                  </button>
                  <button
                    type="button"
                    onClick={handleResetPcaFilter}
                    className="rounded-xl border border-paper-line bg-white hover:bg-paper px-3.5 py-2 text-[12.5px] font-semibold text-ink transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Saved PCAs Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12.5px] text-ink">
                <thead>
                  <tr className="border-b border-paper-line bg-paper/60 text-[10.5px] font-bold uppercase tracking-wider text-slate">
                    <th className="py-3 px-5 whitespace-nowrap">PERMIT #</th>
                    <th className="py-3 px-5">PROJECT ADDRESS</th>
                    <th className="py-3 px-5">CITY</th>
                    <th className="py-3 px-5">PRIVATE PROVIDER</th>
                    <th className="py-3 px-5">CONTRACTOR</th>
                    <th className="py-3 px-5 whitespace-nowrap">DATE SAVED</th>
                    <th className="py-3 px-5 text-right whitespace-nowrap">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-paper-line">
                  {filteredPcas.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate">
                        No saved PCAs found matching filters.
                      </td>
                    </tr>
                  ) : (
                    filteredPcas.map((rec) => (
                      <tr key={rec.id} className="hover:bg-paper/40 transition-colors">
                        <td className="py-3.5 px-5 whitespace-nowrap">
                          {rec.permitNumber ? (
                            <span className="inline-block rounded-md border border-primary/20 bg-primary-soft px-2.5 py-0.5 font-mono text-[11.5px] font-bold text-primary">
                              {rec.permitNumber}
                            </span>
                          ) : (
                            <span className="italic text-slate-soft text-[12px]">
                              No Permit #
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-5 font-medium">
                          {rec.projectAddress ? (
                            rec.projectAddress
                          ) : (
                            <span className="italic text-slate-soft">No address</span>
                          )}
                        </td>
                        <td className="py-3.5 px-5 font-bold text-ink">{rec.city}</td>
                        <td className="py-3.5 px-5 text-slate font-medium">
                          {rec.privateProvider || "—"}
                        </td>
                        <td className="py-3.5 px-5 text-slate font-medium">
                          {rec.contractor || "—"}
                        </td>
                        <td className="py-3.5 px-5 text-slate whitespace-nowrap">
                          {rec.dateSaved}
                        </td>
                        <td className="py-3.5 px-5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => onSelectSavedPca(rec)}
                              className="inline-flex items-center gap-1 rounded-lg bg-primary hover:bg-primary-dark px-2.5 py-1.5 text-[11.5px] font-bold text-white shadow-2xs transition-colors"
                            >
                              <Check size={13} strokeWidth={2.5} /> Select PCA
                            </button>
                            <button
                              type="button"
                              onClick={() => setPreviewRecord(rec)}
                              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-soft hover:bg-paper hover:text-ink transition-colors"
                              title="View details"
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => onSelectSavedPca(rec)}
                              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-soft hover:bg-paper hover:text-primary transition-colors"
                              title="Edit in form"
                            >
                              <Pencil size={14} />
                            </button>
                            {onDeletePcaRecord && (
                              <button
                                type="button"
                                onClick={() => onDeletePcaRecord(rec.id)}
                                className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-soft hover:bg-alert-soft hover:text-alert transition-colors"
                                title="Delete record"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2 Content: Permits */}
        {activeTab === "permits" && (
          <div className="rounded-2xl border border-paper-line bg-paper-raised overflow-hidden shadow-xs">
            {/* Filters Bar matching Screenshot 2 */}
            <div className="p-4 sm:p-5 border-b border-paper-line bg-paper/30">
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 items-end">
                <div>
                  <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate mb-1">
                    PERMIT #
                  </label>
                  <input
                    type="text"
                    value={permitNumberFilter}
                    onChange={(e) => setPermitNumberFilter(e.target.value)}
                    placeholder="Enter permit number"
                    className="w-full rounded-xl border border-paper-line bg-paper px-3 py-2 text-[12.5px] text-ink focus:border-primary focus:bg-white focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate mb-1">
                    CONTRACTOR NAME
                  </label>
                  <input
                    type="text"
                    value={permitContractorFilter}
                    onChange={(e) => setPermitContractorFilter(e.target.value)}
                    placeholder="Enter contractor name"
                    className="w-full rounded-xl border border-paper-line bg-paper px-3 py-2 text-[12.5px] text-ink focus:border-primary focus:bg-white focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate mb-1">
                    PROJECT ADDRESS
                  </label>
                  <input
                    type="text"
                    value={permitAddressFilter}
                    onChange={(e) => setPermitAddressFilter(e.target.value)}
                    placeholder="Enter project address"
                    className="w-full rounded-xl border border-paper-line bg-paper px-3 py-2 text-[12.5px] text-ink focus:border-primary focus:bg-white focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleApplyPermitFilter}
                    className="flex-1 rounded-xl bg-primary hover:bg-primary-dark px-4 py-2 text-[12.5px] font-bold text-white shadow-2xs transition-colors"
                  >
                    Apply
                  </button>
                  <button
                    type="button"
                    onClick={handleResetPermitFilter}
                    className="rounded-xl border border-paper-line bg-white hover:bg-paper px-3.5 py-2 text-[12.5px] font-semibold text-ink transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Permits Table matching Screenshot 2 */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12.5px] text-ink">
                <thead>
                  <tr className="border-b border-paper-line bg-paper/60 text-[10.5px] font-bold uppercase tracking-wider text-slate">
                    <th className="py-3 px-5 whitespace-nowrap">PERMIT NUMBER</th>
                    <th className="py-3 px-5">PROJECT ADDRESS</th>
                    <th className="py-3 px-5">CONTRACTOR NAME</th>
                    <th className="py-3 px-5">LAST ACTIVITY</th>
                    <th className="py-3 px-5 whitespace-nowrap">MODIFICATION DATE</th>
                    <th className="py-3 px-5 text-right whitespace-nowrap">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-paper-line">
                  {filteredPermits.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate">
                        No active permits found matching filters.
                      </td>
                    </tr>
                  ) : (
                    filteredPermits.map((perm) => (
                      <tr key={perm.id} className="hover:bg-paper/40 transition-colors">
                        <td className="py-3.5 px-5 whitespace-nowrap">
                          <span className="inline-block rounded-md border border-primary/20 bg-primary-soft px-2.5 py-0.5 font-mono text-[11.5px] font-bold text-primary">
                            {perm.permitNumber}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 font-bold text-ink">
                          {perm.projectAddress}
                        </td>
                        <td className="py-3.5 px-5 text-slate font-medium">
                          {perm.contractorName}
                        </td>
                        <td className="py-3.5 px-5">
                          <span
                            className={clsx(
                              "inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold",
                              perm.lastActivity === "COC" && "bg-forest-soft text-forest",
                              perm.lastActivity === "PASSED" && "bg-forest-soft text-forest",
                              perm.lastActivity === "INSP" && "bg-primary-soft text-primary",
                              perm.lastActivity === "REVIEW" && "bg-secondary-soft text-ink"
                            )}
                          >
                            {perm.lastActivity}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-slate whitespace-nowrap">
                          {perm.modificationDate}
                        </td>
                        <td className="py-3.5 px-5 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => onSelectPermit(perm)}
                            className="inline-flex items-center gap-1 rounded-lg bg-primary hover:bg-primary-dark px-3 py-1.5 text-[11.5px] font-bold text-white shadow-2xs transition-colors"
                          >
                            <Check size={13} strokeWidth={2.5} /> Select Permit
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add City Modal */}
      <AddCityModal
        isOpen={isAddCityOpen}
        onClose={() => setIsAddCityOpen(false)}
        onAddCity={(newCity) => {
          onAddCity(newCity);
          onUpdateFormData({
            city: newCity.name,
            countyDepartment: newCity.county,
          });
        }}
      />

      {/* View PCA Record Modal */}
      {previewRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-up">
          <div className="w-full max-w-md rounded-2xl bg-paper-raised border border-paper-line shadow-2xl p-6">
            <h3 className="font-bold text-[16px] text-ink mb-2">Saved PCA Details</h3>
            <div className="space-y-2 text-[13px] text-slate mb-5">
              <p>
                <strong className="text-ink">Permit #:</strong> {previewRecord.permitNumber || "N/A"}
              </p>
              <p>
                <strong className="text-ink">City:</strong> {previewRecord.city}
              </p>
              <p>
                <strong className="text-ink">Address:</strong> {previewRecord.projectAddress || "None"}
              </p>
              <p>
                <strong className="text-ink">Provider:</strong> {previewRecord.privateProvider}
              </p>
              <p>
                <strong className="text-ink">Contractor:</strong> {previewRecord.contractor}
              </p>
              <p>
                <strong className="text-ink">Date Saved:</strong> {previewRecord.dateSaved}
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setPreviewRecord(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  onSelectSavedPca(previewRecord);
                  setPreviewRecord(null);
                }}
              >
                Use This PCA
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
