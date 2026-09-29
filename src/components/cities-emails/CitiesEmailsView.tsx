"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Building2,
  Mail,
  Phone,
  FileCode2,
  CheckCircle2,
  ChevronRight,
  Search,
  Filter,
  Copy,
  Check,
  MapPin,
  ExternalLink,
  Layers,
  X,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AddCityModal } from "@/components/permit-inspection/AddCityModal";
import {
  DEFAULT_INSPECTION_CITIES,
  getStoredInspectionCities,
  saveStoredInspectionCity,
} from "@/lib/mock-data";
import type { InspectionCity } from "@/lib/types";

export function CitiesEmailsView() {
  const [cities, setCities] = useState<InspectionCity[]>(DEFAULT_INSPECTION_CITIES);
  const [isAddCityOpen, setIsAddCityOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<InspectionCity | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterWorkflow, setFilterWorkflow] = useState<"all" | "One Step" | "Two Step">("all");
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  useEffect(() => {
    setCities(getStoredInspectionCities());
  }, []);

  function handleAddCity(newCity: InspectionCity) {
    const updated = saveStoredInspectionCity(newCity);
    setCities(updated);
  }

  function handleCopyEmail(email: string) {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 1800);
  }

  const filteredCities = useMemo(() => {
    return cities.filter((city) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        city.name.toLowerCase().includes(q) ||
        city.county.toLowerCase().includes(q) ||
        city.email.toLowerCase().includes(q) ||
        (city.phone && city.phone.toLowerCase().includes(q));

      const matchesWorkflow =
        filterWorkflow === "all" ||
        (filterWorkflow === "One Step" && (!city.workflowSteps || city.workflowSteps === "One Step")) ||
        (filterWorkflow === "Two Step" && city.workflowSteps === "Two Step");

      return matchesSearch && matchesWorkflow;
    });
  }, [cities, searchQuery, filterWorkflow]);

  return (
    <div className="space-y-7 animate-fade-up">
      {/* Brand Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
              MUNICIPALITY DIRECTORY
            </span>
            <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[10.5px] font-bold text-primary">
              {cities.length} Configured
            </span>
          </div>
          <h1 className="mt-1 text-[26px] sm:text-[32px] font-bold tracking-tight text-ink">
            Cities & Email Profiles
          </h1>
          <p className="mt-1 text-[13.5px] leading-relaxed text-slate max-w-2xl">
            Configure Florida municipal building departments, automated email dispatch templates,
            inspection lookup codes, and two-step verification workflows.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          onClick={() => setIsAddCityOpen(true)}
          className="gap-2 shadow-[0_2px_8px_rgba(0,85,127,0.25)] shrink-0 cursor-pointer"
        >
          <Plus size={16} /> Add City Profile
        </Button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-paper-line bg-paper-raised p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate">
              Active Municipalities
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-soft text-primary">
              <Building2 size={15} />
            </div>
          </div>
          <p className="text-[24px] font-bold text-ink mt-1">{cities.length}</p>
          <p className="text-[12px] text-slate-soft mt-0.5">Across Florida counties</p>
        </div>

        <div className="rounded-2xl border border-paper-line bg-paper-raised p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate">
              Automated Email Routes
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-forest-soft text-forest">
              <CheckCircle2 size={15} />
            </div>
          </div>
          <p className="text-[24px] font-bold text-ink mt-1">100%</p>
          <p className="text-[12px] text-slate-soft mt-0.5">Direct jurisdiction dispatch</p>
        </div>

        <div className="rounded-2xl border border-paper-line bg-paper-raised p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate">
              Inspection Workflows
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-soft text-primary">
              <Layers size={15} />
            </div>
          </div>
          <p className="text-[24px] font-bold text-ink mt-1">Single & Two-Step</p>
          <p className="text-[12px] text-slate-soft mt-0.5">Custom template support</p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-paper-line bg-paper-raised p-3 shadow-2xs">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-soft" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by city, county, email, or phone..."
            className="w-full rounded-xl border border-paper-line bg-white pl-9.5 pr-4 py-2 text-[13.5px] text-ink placeholder:text-slate-soft focus:border-primary focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[12px] font-semibold text-slate whitespace-nowrap pl-1">Workflow:</span>
          <div className="flex rounded-xl border border-paper-line bg-paper p-0.5">
            <button
              type="button"
              onClick={() => setFilterWorkflow("all")}
              className={`rounded-lg px-3 py-1.5 text-[12px] font-bold transition-all cursor-pointer ${
                filterWorkflow === "all"
                  ? "bg-white text-ink shadow-2xs"
                  : "text-slate hover:text-ink"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilterWorkflow("One Step")}
              className={`rounded-lg px-3 py-1.5 text-[12px] font-bold transition-all cursor-pointer ${
                filterWorkflow === "One Step"
                  ? "bg-white text-ink shadow-2xs"
                  : "text-slate hover:text-ink"
              }`}
            >
              One Step
            </button>
            <button
              type="button"
              onClick={() => setFilterWorkflow("Two Step")}
              className={`rounded-lg px-3 py-1.5 text-[12px] font-bold transition-all cursor-pointer ${
                filterWorkflow === "Two Step"
                  ? "bg-white text-ink shadow-2xs"
                  : "text-slate hover:text-ink"
              }`}
            >
              Two Step
            </button>
          </div>
        </div>
      </div>

      {/* Grid of City Profiles */}
      {filteredCities.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-paper-line bg-paper-raised py-16 px-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary mb-3">
            <Building2 size={24} />
          </div>
          <h3 className="text-[16px] font-bold text-ink">No cities found</h3>
          <p className="text-[13px] text-slate mt-1 max-w-sm mx-auto">
            No jurisdiction matched your search criteria. Try a different query or add a new city profile.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setFilterWorkflow("all");
            }}
            className="mt-4 text-[13px] font-bold text-primary hover:underline cursor-pointer"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCities.map((city) => (
            <div
              key={city.id}
              className="group rounded-2xl border border-paper-line bg-paper-raised p-5 shadow-2xs hover:shadow-md hover:border-primary/40 transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-3.5">
                {/* Card Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-200 shrink-0">
                      <Building2 size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-[16px] text-ink leading-snug">{city.name}</h3>
                      <p className="text-[11.5px] text-slate-soft flex items-center gap-1 mt-0.5">
                        <MapPin size={11} className="shrink-0" />
                        <span className="truncate max-w-[170px]">{city.county}</span>
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft/80 border border-primary/20 px-2.5 py-0.5 text-[10.5px] font-bold text-primary shrink-0">
                    {city.workflowSteps || "One Step"}
                  </span>
                </div>

                {/* Contact info list */}
                <div className="space-y-2 text-[12px] pt-3 border-t border-paper-line">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-slate truncate">
                      <Mail size={13} className="text-slate-soft shrink-0" />
                      <span className="font-mono text-[11.5px] text-ink truncate">{city.email}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyEmail(city.email)}
                      className="text-slate-soft hover:text-primary transition-colors cursor-pointer shrink-0"
                      title="Copy email address"
                    >
                      {copiedEmail === city.email ? (
                        <Check size={13} className="text-forest" />
                      ) : (
                        <Copy size={13} />
                      )}
                    </button>
                  </div>

                  {city.phone && (
                    <div className="flex items-center gap-1.5 text-slate">
                      <Phone size={13} className="text-slate-soft shrink-0" />
                      <span className="font-mono text-[11.5px] text-ink">{city.phone}</span>
                    </div>
                  )}
                </div>

                {/* Inspection codes preview */}
                {city.inspectionCodes && city.inspectionCodes.length > 0 && (
                  <div className="pt-1">
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-soft block mb-1">
                      Lookup Codes:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {city.inspectionCodes.slice(0, 3).map((item, idx) => (
                        <span
                          key={idx}
                          className="rounded-lg bg-primary-soft/40 border border-primary/20 px-2 py-0.5 text-[11px] font-mono font-bold text-primary"
                        >
                          {item.code}
                        </span>
                      ))}
                      {city.inspectionCodes.length > 3 && (
                        <span className="text-[11px] font-medium text-slate-soft self-center">
                          +{city.inspectionCodes.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="mt-4 pt-3 border-t border-paper-line flex items-center justify-between text-[12px]">
                <span className="text-slate-soft text-[11px] flex items-center gap-1">
                  <FileText size={12} />
                  {city.subjectTemplate ? "Custom Subject" : "Default Template"}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedCity(city)}
                  className="font-bold text-primary hover:text-primary-dark flex items-center gap-1 cursor-pointer transition-colors"
                >
                  View Details <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add City Modal */}
      <AddCityModal
        isOpen={isAddCityOpen}
        onClose={() => setIsAddCityOpen(false)}
        onAddCity={handleAddCity}
      />

      {/* View City Profile Details Modal */}
      {selectedCity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-fade-up overflow-y-auto">
          <div className="relative my-auto w-full max-w-xl rounded-3xl bg-white border border-paper-line shadow-2xl overflow-hidden flex flex-col">
            {/* Top brand accent bar */}
            <div className="h-1.5 w-full bg-primary" />

            {/* Header */}
            <div className="relative bg-white border-b border-paper-line px-7 pt-6 pb-4">
              <button
                type="button"
                onClick={() => setSelectedCity(null)}
                className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-xl text-slate-soft hover:bg-paper hover:text-ink transition-colors cursor-pointer"
              >
                <X size={18} strokeWidth={2} />
              </button>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                  Jurisdiction Profile
                </span>
                <span className="rounded-full bg-primary-soft border border-primary/20 px-2 py-0.5 text-[10.5px] font-bold text-primary">
                  {selectedCity.workflowSteps || "One Step"}
                </span>
              </div>
              <h3 className="text-[20px] font-bold text-ink leading-tight mt-0.5">
                {selectedCity.name}
              </h3>
              <p className="mt-1 text-[13px] text-slate">{selectedCity.county}</p>
            </div>

            {/* Details Body */}
            <div className="p-7 space-y-5 bg-paper/20 max-h-[70vh] overflow-y-auto">
              {/* Contact Information */}
              <div className="rounded-2xl border border-paper-line bg-white p-4 space-y-3 shadow-2xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate block">
                  Contact Information
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]">
                  <div>
                    <span className="text-[11px] text-slate-soft block">Notification Email:</span>
                    <span className="font-mono font-medium text-ink">{selectedCity.email}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-soft block">Department Phone:</span>
                    <span className="font-mono font-medium text-ink">{selectedCity.phone || "—"}</span>
                  </div>
                </div>

                {selectedCity.emailRecipients && selectedCity.emailRecipients.length > 0 && (
                  <div className="pt-2 border-t border-paper-line">
                    <span className="text-[11px] text-slate-soft block mb-1">Additional Recipients:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCity.emailRecipients.map((em, idx) => (
                        <span
                          key={idx}
                          className="rounded-lg bg-paper border border-paper-line px-2 py-0.5 text-[11.5px] font-mono text-ink"
                        >
                          {em}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Email Templates */}
              <div className="rounded-2xl border border-paper-line bg-white p-4 space-y-3.5 shadow-2xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate block">
                  Email Dispatch Templates
                </span>

                <div>
                  <span className="text-[11.5px] font-medium text-slate mb-1 block">Subject Template</span>
                  <div className="font-mono text-ink bg-paper/60 p-3 rounded-xl border border-paper-line text-[12.5px]">
                    {selectedCity.subjectTemplate || "Permit $PermitNumber$ Inspection Report"}
                  </div>
                </div>

                <div>
                  <span className="text-[11.5px] font-medium text-slate mb-1 block">Body Template</span>
                  <div className="font-mono text-ink bg-paper/60 p-3 rounded-xl border border-paper-line text-[12.5px] whitespace-pre-wrap leading-relaxed">
                    {selectedCity.bodyTemplate ||
                      "Hello,\n\nPlease find the inspection report attached for permit $PermitNumber$.\n\nThank you,\nPermit Rockstar"}
                  </div>
                </div>
              </div>

              {/* Inspection Lookup Codes */}
              {selectedCity.inspectionCodes && selectedCity.inspectionCodes.length > 0 && (
                <div className="rounded-2xl border border-paper-line bg-white p-4 space-y-2.5 shadow-2xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate block">
                    Inspection Lookup Codes ({selectedCity.inspectionCodes.length})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {selectedCity.inspectionCodes.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-xl border border-paper-line bg-paper/40 px-3 py-2 text-[12px]"
                      >
                        <span className="font-mono font-bold text-primary">{item.code}</span>
                        <span className="font-sans text-slate text-[11.5px]">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-5 border-t border-paper-line bg-white">
              <Button
                variant="outline"
                onClick={() => setSelectedCity(null)}
                className="cursor-pointer"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
