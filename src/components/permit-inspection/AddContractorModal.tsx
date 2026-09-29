"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";
import clsx from "clsx";
import type { InspectionContractor } from "@/lib/types";

interface AddContractorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddContractor: (contractor: InspectionContractor) => void;
}

export function AddContractorModal({
  isOpen,
  onClose,
  onAddContractor,
}: AddContractorModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [identifierFormat, setIdentifierFormat] = useState<"name" | "company" | "both">("both");

  const [licenseInput, setLicenseInput] = useState("");
  const [licenses, setLicenses] = useState<string[]>([]);

  const [error, setError] = useState("");

  if (!isOpen) return null;

  const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
  const hasName = Boolean(fullName);
  const hasCompany = Boolean(companyName.trim());

  function handleAddLicense() {
    const trimmed = licenseInput.trim();
    if (!trimmed) return;
    if (!licenses.includes(trimmed)) {
      setLicenses([...licenses, trimmed]);
    }
    setLicenseInput("");
  }

  function handleRemoveLicense(licToRemove: string) {
    setLicenses(licenses.filter((l) => l !== licToRemove));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!hasName && !hasCompany) {
      setError("Please provide a contractor name or company name.");
      return;
    }

    // Determine display name based on identifier option
    let displayName = fullName;
    if (identifierFormat === "company" && hasCompany) {
      displayName = companyName.trim();
    } else if (identifierFormat === "both" && hasName && hasCompany) {
      displayName = `${fullName} / ${companyName.trim()}`;
    } else if (hasCompany && !hasName) {
      displayName = companyName.trim();
    }

    const primaryLicense = licenses[0] || licenseInput.trim() || "CGC-PENDING";
    const allLicenses = licenseInput.trim() && !licenses.includes(licenseInput.trim())
      ? [...licenses, licenseInput.trim()]
      : licenses;

    const newContractor: InspectionContractor = {
      id: `contr_${Date.now()}`,
      name: displayName,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      companyName: companyName.trim() || fullName,
      identifierFormat,
      licenseNumber: primaryLicense,
      licenses: allLicenses.length > 0 ? allLicenses : [primaryLicense],
      phone: "904-555-0144",
      email: `${(firstName || "contractor").toLowerCase()}@${(companyName || "builder").toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
      address: "Florida",
    };

    onAddContractor(newContractor);
    // Reset state
    setFirstName("");
    setLastName("");
    setCompanyName("");
    setIdentifierFormat("both");
    setLicenseInput("");
    setLicenses([]);
    setError("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-fade-up overflow-y-auto">
      <div className="relative my-auto w-full max-w-[500px] rounded-3xl bg-white border border-paper-line shadow-2xl overflow-hidden flex flex-col">
        {/* Top brand accent bar */}
        <div className="h-1.5 w-full bg-primary" />

        {/* Modal Header */}
        <div className="relative bg-white border-b border-paper-line px-7 pt-6 pb-4">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-xl text-slate-soft hover:bg-paper hover:text-ink transition-colors cursor-pointer"
          >
            <X size={18} strokeWidth={2} />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
              Directory Management
            </span>
          </div>
          <h2 className="text-[20px] font-bold text-ink leading-tight mt-0.5">
            Add New Contractor
          </h2>
          <p className="mt-1 text-[13px] text-slate">
            Create a contractor profile to use in your inspection reports
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-7 space-y-5 bg-paper/20">
          {error && (
            <div className="rounded-xl bg-alert-soft/80 border border-alert/30 px-4 py-2.5 text-[12.5px] font-semibold text-alert">
              {error}
            </div>
          )}

          {/* Row 1: FIRST NAME & LAST NAME */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[0.08em] text-slate mb-1.5">
                FIRST NAME
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  if (error) setError("");
                }}
                placeholder="John"
                className="w-full rounded-xl border border-paper-line bg-white px-4 py-2.5 text-[14px] text-ink placeholder:text-slate-soft/70 focus:border-primary focus:outline-none transition-colors shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[0.08em] text-slate mb-1.5">
                LAST NAME
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Doe"
                className="w-full rounded-xl border border-paper-line bg-white px-4 py-2.5 text-[14px] text-ink placeholder:text-slate-soft/70 focus:border-primary focus:outline-none transition-colors shadow-2xs"
              />
            </div>
          </div>

          {/* Row 2: COMPANY NAME */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-[0.08em] text-slate mb-1.5">
              COMPANY NAME
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => {
                setCompanyName(e.target.value);
                if (error) setError("");
              }}
              placeholder="e.g. Acme Contracting LLC"
              className="w-full rounded-xl border border-paper-line bg-white px-4 py-2.5 text-[14px] text-ink placeholder:text-slate-soft/70 focus:border-primary focus:outline-none transition-colors shadow-2xs"
            />
          </div>

          {/* Row 3: CONTRACTOR IDENTIFIER */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-[0.08em] text-slate">
                CONTRACTOR IDENTIFIER <span className="text-primary">*</span>
              </label>
              <span className="text-[12px] font-medium text-slate">
                Dropdown format
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {/* Option 1: User Name */}
              <button
                type="button"
                onClick={() => setIdentifierFormat("name")}
                className={clsx(
                  "rounded-xl border py-3 px-2 text-center transition-all cursor-pointer",
                  identifierFormat === "name"
                    ? "border-primary bg-primary-soft/40 shadow-xs ring-1 ring-primary/30"
                    : "border-paper-line bg-white hover:border-slate/40"
                )}
              >
                <p className={clsx("text-[13px] font-bold", identifierFormat === "name" ? "text-primary" : "text-ink")}>
                  User Name
                </p>
                <p className="text-[11px] text-slate mt-0.5">(Name only)</p>
              </button>

              {/* Option 2: Company Name */}
              <button
                type="button"
                onClick={() => setIdentifierFormat("company")}
                className={clsx(
                  "rounded-xl border py-3 px-2 text-center transition-all cursor-pointer",
                  identifierFormat === "company"
                    ? "border-primary bg-primary-soft/40 shadow-xs ring-1 ring-primary/30"
                    : "border-paper-line bg-white hover:border-slate/40"
                )}
              >
                <p className={clsx("text-[13px] font-bold", identifierFormat === "company" ? "text-primary" : "text-ink")}>
                  Company Name
                </p>
                <p className="text-[11px] text-slate mt-0.5">(Company only)</p>
              </button>

              {/* Option 3: Both */}
              <button
                type="button"
                onClick={() => setIdentifierFormat("both")}
                className={clsx(
                  "rounded-xl border py-3 px-2 text-center transition-all cursor-pointer",
                  identifierFormat === "both"
                    ? "border-primary bg-primary-soft/40 shadow-xs ring-1 ring-primary/30"
                    : "border-paper-line bg-white hover:border-slate/40"
                )}
              >
                <p className={clsx("text-[13px] font-bold", identifierFormat === "both" ? "text-primary" : "text-ink")}>
                  Both
                </p>
                <p className="text-[11px] text-slate mt-0.5">(Name / Company)</p>
              </button>
            </div>

            <p className="text-[11.5px] text-slate-soft italic mt-2">
              Enter name and/or company name above to configure contractor identifier.
            </p>
          </div>

          {/* Row 4: CONTRACTOR LICENSES */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-[0.08em] text-slate mb-1.5">
              CONTRACTOR LICENSES
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={licenseInput}
                onChange={(e) => setLicenseInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddLicense();
                  }
                }}
                placeholder="e.g. CGC1528812"
                className="flex-1 rounded-xl border border-paper-line bg-white px-4 py-2.5 text-[14px] text-ink placeholder:text-slate-soft/70 focus:border-primary focus:outline-none transition-colors shadow-2xs"
              />
              <button
                type="button"
                onClick={handleAddLicense}
                className="rounded-xl bg-primary hover:bg-primary-dark text-white px-5 py-2.5 text-[13px] font-bold transition-colors whitespace-nowrap shadow-[0_2px_8px_rgba(0,85,127,0.2)] cursor-pointer"
              >
                Add License
              </button>
            </div>

            {/* Added licenses list */}
            {licenses.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2.5">
                {licenses.map((lic) => (
                  <span
                    key={lic}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary-soft px-2.5 py-1 text-[12px] font-mono font-bold text-primary shadow-2xs"
                  >
                    {lic}
                    <button
                      type="button"
                      onClick={() => handleRemoveLicense(lic)}
                      className="text-primary hover:text-alert cursor-pointer transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-5 border-t border-paper-line">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-paper-line bg-white hover:bg-paper px-6 py-2.5 text-[13px] font-bold text-ink transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-primary hover:bg-primary-dark px-6 py-2.5 text-[13px] font-bold text-white shadow-[0_2px_8px_rgba(0,85,127,0.25)] transition-colors cursor-pointer"
            >
              Save Contractor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
