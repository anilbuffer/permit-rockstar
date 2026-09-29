"use client";

import { useState, useRef } from "react";
import { X, Plus, Info, Check, Trash2 } from "lucide-react";
import clsx from "clsx";
import { AddInspectionCodeModal } from "./AddInspectionCodeModal";
import type { InspectionCity, InspectionCodeItem } from "@/lib/types";

interface AddCityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCity: (city: InspectionCity) => void;
}

const DYNAMIC_VARIABLES = [
  "$PermitNumber$",
  "$Address$",
  "$ContractorName$",
  "$ContractorLicense$",
  "$PrivateProviderName$",
  "$PrivateProviderLicense$",
  "$InspectionCode$",
  "$InspectionName$",
  "$InspectionDate$",
  "$InspectionStatus$",
];

export function AddCityModal({ isOpen, onClose, onAddCity }: AddCityModalProps) {
  const [activeTab, setActiveTab] = useState<"general" | "email">("general");

  // General Settings state
  const [cityName, setCityName] = useState("");
  const [cityType, setCityType] = useState("");
  const [workflowSteps, setWorkflowSteps] = useState<"One Step" | "Two Step">("One Step");
  const [emailRecipients, setEmailRecipients] = useState<string[]>([]);
  const [newEmailInput, setNewEmailInput] = useState("");
  const [isAddingEmail, setIsAddingEmail] = useState(false);

  const [inspectionCodes, setInspectionCodes] = useState<InspectionCodeItem[]>([]);
  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");
  const [isAddCodeModalOpen, setIsAddCodeModalOpen] = useState(false);

  // Step 1 Email state
  const [subjectTemplate, setSubjectTemplate] = useState("");
  const [bodyTemplate, setBodyTemplate] = useState("");
  const [attachmentRequired, setAttachmentRequired] = useState(false);

  // Track which input had focus for variable insertion
  const [lastFocusedField, setLastFocusedField] = useState<"subject" | "body">("subject");
  const subjectInputRef = useRef<HTMLInputElement>(null);
  const bodyTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Error state
  const [error, setError] = useState("");

  if (!isOpen) return null;

  function handleAddEmail() {
    const trimmed = newEmailInput.trim();
    if (!trimmed) return;
    if (!emailRecipients.includes(trimmed)) {
      setEmailRecipients([...emailRecipients, trimmed]);
    }
    setNewEmailInput("");
    setIsAddingEmail(false);
  }

  function handleRemoveEmail(emailToRemove: string) {
    setEmailRecipients(emailRecipients.filter((e) => e !== emailToRemove));
  }

  function handleAddInspectionCode() {
    if (!newCode.trim()) return;
    setInspectionCodes([
      ...inspectionCodes,
      { code: newCode.trim(), name: newName.trim() || newCode.trim() },
    ]);
    setNewCode("");
    setNewName("");
  }

  function handleRemoveInspectionCode(idx: number) {
    setInspectionCodes(inspectionCodes.filter((_, i) => i !== idx));
  }

  // Insert dynamic variable into last focused field
  function handleInsertVariable(variable: string) {
    if (lastFocusedField === "subject") {
      const input = subjectInputRef.current;
      if (input) {
        const start = input.selectionStart || subjectTemplate.length;
        const end = input.selectionEnd || subjectTemplate.length;
        const updated =
          subjectTemplate.substring(0, start) + variable + subjectTemplate.substring(end);
        setSubjectTemplate(updated);
        setTimeout(() => {
          input.focus();
          input.setSelectionRange(start + variable.length, start + variable.length);
        }, 0);
      } else {
        setSubjectTemplate((prev) => (prev ? `${prev} ${variable}` : variable));
      }
    } else {
      const textarea = bodyTextareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart || bodyTemplate.length;
        const end = textarea.selectionEnd || bodyTemplate.length;
        const updated =
          bodyTemplate.substring(0, start) + variable + bodyTemplate.substring(end);
        setBodyTemplate(updated);
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + variable.length, start + variable.length);
        }, 0);
      } else {
        setBodyTemplate((prev) => (prev ? `${prev} ${variable}` : variable));
      }
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!cityName.trim()) {
      setActiveTab("general");
      setError("City name is required");
      return;
    }

    const newCity: InspectionCity = {
      id: `city_${Date.now()}`,
      name: cityName.trim(),
      county: `${cityName.trim()} Building Department`,
      email: emailRecipients[0] || `inspections@${cityName.trim().toLowerCase().replace(/\s+/g, "")}.gov`,
      phone: "904-555-0100",
      cityType: cityType || "Municipality",
      workflowSteps,
      emailRecipients,
      inspectionCodes,
      subjectTemplate: subjectTemplate || `Permit $PermitNumber$ Inspection Report`,
      bodyTemplate: bodyTemplate || `Hello, please find the inspection report attached for permit $PermitNumber$.`,
      attachmentRequired,
    };

    onAddCity(newCity);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-up overflow-y-auto">
      <div className="relative my-auto w-full max-w-[620px] rounded-2xl bg-white border border-paper-line shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header matching Screenshot 1 & 2 */}
        <div className="relative border-b border-paper-line px-7 pt-6 pb-4">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-6 top-6 flex h-7 w-7 items-center justify-center rounded-lg text-slate-soft hover:bg-paper hover:text-ink transition-colors"
          >
            <X size={18} />
          </button>
          <h2 className="font-serif text-[22px] font-bold text-ink leading-tight">
            Add City Profile
          </h2>
          <p className="mt-1 text-[13px] text-slate">
            Create a new lookup municipality and templates
          </p>
        </div>

        {/* Tab Headers matching Screenshots 1 & 2 */}
        <div className="flex items-center gap-6 px-7 border-b border-paper-line bg-white">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={clsx(
              "py-3.5 text-[13.5px] font-semibold transition-all relative",
              activeTab === "general"
                ? "text-primary border-b-2 border-primary"
                : "text-slate hover:text-ink border-b-2 border-transparent"
            )}
          >
            General Settings
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("email")}
            className={clsx(
              "py-3.5 text-[13.5px] font-semibold transition-all relative",
              activeTab === "email"
                ? "text-primary border-b-2 border-primary"
                : "text-slate hover:text-ink border-b-2 border-transparent"
            )}
          >
            Step 1 Email
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-7 py-6 space-y-6">
          {error && (
            <div className="rounded-xl bg-alert-soft/60 border border-alert/30 px-4 py-2.5 text-[12.5px] font-semibold text-alert">
              {error}
            </div>
          )}

          {/* TAB 1: General Settings */}
          {activeTab === "general" && (
            <div className="space-y-6 animate-fade-up">
              {/* CITY NAME */}
              <div>
                <label className="block font-mono text-[10.5px] font-bold uppercase tracking-wider text-slate mb-1.5">
                  City Name
                </label>
                <input
                  type="text"
                  required
                  value={cityName}
                  onChange={(e) => {
                    setCityName(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="e.g. Gainesville"
                  className="w-full rounded-xl border border-paper-line bg-paper-raised px-4 py-2.5 text-[13.5px] text-ink placeholder:text-slate-soft/70 focus:border-primary focus:bg-white focus:outline-none transition-colors shadow-2xs"
                />
              </div>

              {/* CITY TYPE */}
              <div>
                <label className="block font-mono text-[10.5px] font-bold uppercase tracking-wider text-slate mb-1.5">
                  Jurisdiction Type
                </label>
                <div className="relative">
                  <select
                    value={cityType}
                    onChange={(e) => setCityType(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-paper-line bg-paper-raised px-4 py-2.5 text-[13.5px] text-ink focus:border-primary focus:bg-white focus:outline-none transition-colors pr-10 cursor-pointer shadow-2xs"
                  >
                    <option value="">Select jurisdiction type...</option>
                    <option value="Municipality">Municipality</option>
                    <option value="County">County Jurisdiction</option>
                    <option value="Town">Town / Township</option>
                    <option value="Village">Village</option>
                    <option value="Charter City">Charter City</option>
                    <option value="Independent Jurisdiction">Independent Jurisdiction</option>
                  </select>
                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-soft">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* WORKFLOW STEPS (Side-by-side radio cards) */}
              <div>
                <label className="block font-mono text-[10.5px] font-bold uppercase tracking-wider text-slate mb-1.5">
                  Workflow Steps
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Card 1: One Step */}
                  <div
                    onClick={() => setWorkflowSteps("One Step")}
                    className={clsx(
                      "flex items-center gap-3 rounded-xl border p-3.5 cursor-pointer transition-all duration-150",
                      workflowSteps === "One Step"
                        ? "border-primary bg-primary-soft/30 shadow-2xs"
                        : "border-paper-line bg-white hover:border-slate/40"
                    )}
                  >
                    <div
                      className={clsx(
                        "flex h-5 w-5 items-center justify-center rounded border transition-colors",
                        workflowSteps === "One Step"
                          ? "bg-primary border-primary text-white"
                          : "border-slate/40 bg-white"
                      )}
                    >
                      {workflowSteps === "One Step" && <Check size={14} strokeWidth={3} />}
                    </div>
                    <span className="text-[13.5px] font-bold text-ink">One Step</span>
                  </div>

                  {/* Card 2: Two Step */}
                  <div
                    onClick={() => setWorkflowSteps("Two Step")}
                    className={clsx(
                      "flex items-center gap-3 rounded-xl border p-3.5 cursor-pointer transition-all duration-150",
                      workflowSteps === "Two Step"
                        ? "border-primary bg-primary-soft/30 shadow-2xs"
                        : "border-paper-line bg-white hover:border-slate/40"
                    )}
                  >
                    <div
                      className={clsx(
                        "flex h-5 w-5 items-center justify-center rounded border transition-colors",
                        workflowSteps === "Two Step"
                          ? "bg-primary border-primary text-white"
                          : "border-slate/40 bg-white"
                      )}
                    >
                      {workflowSteps === "Two Step" && <Check size={14} strokeWidth={3} />}
                    </div>
                    <span className="text-[13.5px] font-medium text-ink">Two Step</span>
                  </div>
                </div>
              </div>

              {/* EMAIL RECIPIENTS */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <label className="block font-mono text-[10.5px] font-bold uppercase tracking-wider text-slate">
                      Email Recipients
                    </label>
                    <p className="text-[12px] text-slate mt-0.5">
                      Manage email notification list for this city.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddingEmail(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary hover:bg-primary-dark px-3 py-1.5 text-[11.5px] font-semibold text-white shadow-2xs transition-colors"
                  >
                    <Plus size={14} strokeWidth={2.5} /> Add Email
                  </button>
                </div>

                {/* Inline Add Email Input */}
                {isAddingEmail && (
                  <div className="flex items-center gap-2 mt-2 mb-3 animate-fade-up">
                    <input
                      type="email"
                      value={newEmailInput}
                      onChange={(e) => setNewEmailInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddEmail();
                        }
                      }}
                      placeholder="e.g. inspections@city.gov"
                      className="flex-1 rounded-xl border border-paper-line bg-paper px-3 py-2 text-[13px] text-ink focus:border-primary focus:bg-white focus:outline-none"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleAddEmail}
                      className="rounded-xl bg-primary hover:bg-primary-dark px-3.5 py-2 text-[12px] font-bold text-white transition-colors"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingEmail(false)}
                      className="rounded-xl border border-paper-line bg-white hover:bg-paper px-3 py-2 text-[12px] text-slate transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {/* Empty State Box */}
                {emailRecipients.length === 0 ? (
                  <div className="mt-2 rounded-xl border border-dashed border-paper-line bg-white py-4 px-5 text-center text-[12.5px] text-slate-soft">
                    No email recipients configured yet. Click "Add Email" above.
                  </div>
                ) : (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {emailRecipients.map((email) => (
                      <span
                        key={email}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-white text-[12px] font-medium px-2.5 py-1 shadow-2xs"
                      >
                        {email}
                        <button
                          type="button"
                          onClick={() => handleRemoveEmail(email)}
                          className="hover:opacity-75"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* INSPECTION CODES */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-[0.08em] text-slate">
                  INSPECTION CODES
                </label>
                <p className="text-[12px] text-slate mt-0.5 mb-2.5">
                  Add inspection lookup codes associated with this city (e.g. 12345, B, M-987).
                </p>

                {/* Input row matching brand design */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="Enter code (e.g. M-987)"
                    className="flex-1 rounded-xl border border-paper-line bg-paper-raised px-3.5 py-2.5 text-[13px] text-ink placeholder:text-slate-soft focus:border-primary focus:outline-none transition-colors"
                  />
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddInspectionCode();
                      }
                    }}
                    placeholder="Enter name (e.g. Footer)"
                    className="flex-1 rounded-xl border border-paper-line bg-paper-raised px-3.5 py-2.5 text-[13px] text-ink placeholder:text-slate-soft focus:border-primary focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={handleAddInspectionCode}
                    className="rounded-xl border border-paper-line bg-white hover:bg-paper px-5 py-2.5 text-[13px] font-bold text-ink shadow-2xs transition-colors"
                  >
                    Add
                  </button>
                </div>

                {/* Empty State Box matching Screenshot 1 */}
                {inspectionCodes.length === 0 ? (
                  <div className="mt-2.5 rounded-xl border border-dashed border-paper-line bg-white py-4 px-5 text-center text-[12.5px] text-slate-soft">
                    No inspection codes added yet.
                  </div>
                ) : (
                  <div className="mt-2.5 space-y-1.5 max-h-36 overflow-y-auto">
                    {inspectionCodes.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-lg border border-paper-line bg-paper/40 px-3 py-1.5 text-[12px]"
                      >
                        <span className="font-mono font-bold text-ink">
                          {item.code}{" "}
                          <span className="font-sans font-normal text-slate">— {item.name}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveInspectionCode(idx)}
                          className="text-slate-soft hover:text-alert transition-colors"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Step 1 Email */}
          {activeTab === "email" && (
            <div className="space-y-6 animate-fade-up">
              {/* SUBJECT TEMPLATE */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-[0.08em] text-slate mb-2">
                  SUBJECT TEMPLATE
                </label>
                <input
                  ref={subjectInputRef}
                  type="text"
                  value={subjectTemplate}
                  onFocus={() => setLastFocusedField("subject")}
                  onChange={(e) => setSubjectTemplate(e.target.value)}
                  placeholder="e.g. Permit $PermitNumber$ Inspection Report"
                  className="w-full rounded-xl border border-paper-line bg-paper-raised px-4 py-3 text-[14px] text-ink placeholder:text-slate-soft focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              {/* BODY TEMPLATE */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-[0.08em] text-slate mb-2">
                  BODY TEMPLATE
                </label>
                <textarea
                  ref={bodyTextareaRef}
                  rows={6}
                  value={bodyTemplate}
                  onFocus={() => setLastFocusedField("body")}
                  onChange={(e) => setBodyTemplate(e.target.value)}
                  placeholder="e.g. Hello, please find the inspection report attached..."
                  className="w-full rounded-xl border border-paper-line bg-paper-raised p-4 text-[13.5px] font-sans text-ink placeholder:text-slate-soft focus:border-primary focus:outline-none transition-colors resize-y leading-relaxed"
                />
              </div>

              {/* ATTACHMENT SETTINGS */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-[0.08em] text-slate mb-2">
                  ATTACHMENT SETTINGS
                </label>
                <div
                  onClick={() => setAttachmentRequired(!attachmentRequired)}
                  className="flex items-center gap-3 rounded-xl border border-paper-line bg-white p-3.5 cursor-pointer hover:border-primary/40 transition-colors"
                >
                  <div
                    className={clsx(
                      "flex h-5 w-5 items-center justify-center rounded border transition-colors",
                      attachmentRequired
                        ? "bg-primary border-primary text-white"
                        : "border-slate/40 bg-white"
                    )}
                  >
                    {attachmentRequired && <Check size={14} strokeWidth={3} />}
                  </div>
                  <span className="text-[13px] font-semibold text-ink">Attachment Required</span>
                </div>
              </div>

              {/* DYNAMIC VARIABLES Card */}
              <div className="rounded-2xl border border-primary/20 bg-primary-soft/30 p-4 sm:p-5 space-y-3">
                <div className="flex items-center gap-2 text-primary font-bold text-[12px] uppercase tracking-wider">
                  <Info size={16} className="text-primary" /> DYNAMIC VARIABLES
                </div>
                <p className="text-[12px] leading-relaxed text-slate">
                  Place the cursor inside the subject or body template input above and click any
                  variable pill below to auto-inject it.
                </p>

                {/* Variable Pills Grid */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {DYNAMIC_VARIABLES.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => handleInsertVariable(v)}
                      className="rounded-lg border border-primary/25 bg-white px-2.5 py-1 font-mono text-[11.5px] font-semibold text-primary hover:bg-primary-soft hover:border-primary/50 transition-colors shadow-2xs"
                      title={`Click to insert ${v}`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-4 border-t border-paper-line bg-white px-7 py-4">
          <button
            type="button"
            onClick={onClose}
            className="text-[13px] font-bold text-slate hover:text-ink transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-xl bg-primary hover:bg-primary-dark px-6 py-2.5 text-[13px] font-bold text-white shadow-[0_2px_8px_rgba(0,85,127,0.25)] transition-colors cursor-pointer"
          >
            Save Profile
          </button>
        </div>
      </div>

      {/* Add Inspection Code Modal */}
      <AddInspectionCodeModal
        isOpen={isAddCodeModalOpen}
        onClose={() => setIsAddCodeModalOpen(false)}
        cityName={cityName}
        onAddCode={(item) => setInspectionCodes([...inspectionCodes, item])}
      />
    </div>
  );
}
