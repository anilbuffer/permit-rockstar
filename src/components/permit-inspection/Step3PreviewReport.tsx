"use client";

import { useState } from "react";
import {
  Printer,
  Mail,
  ArrowLeft,
  CheckCircle2,
  Download,
  Building2,
  HardHat,
  Award,
  ShieldCheck,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SendEmailModal } from "./SendEmailModal";
import type { PermitInspectionFormData } from "@/lib/types";

interface Step3PreviewReportProps {
  formData: PermitInspectionFormData;
  onBackToForm: () => void;
  onRestart: () => void;
  onSaveReportRecord?: () => void;
}

export function Step3PreviewReport({
  formData,
  onBackToForm,
  onRestart,
  onSaveReportRecord,
}: Step3PreviewReportProps) {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const formattedDate = new Date().toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });

  function handlePrint() {
    window.print();
  }

  function handleSave() {
    setIsSaved(true);
    onSaveReportRecord?.();
    setToastMessage("Permit inspection report saved successfully to database!");
    setTimeout(() => setToastMessage(""), 4000);
  }

  function handleEmailSuccess(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 5000);
  }

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-forest/30 bg-forest text-white px-5 py-3.5 shadow-xl animate-fade-up">
          <CheckCircle2 size={18} strokeWidth={2.5} />
          <span className="text-[13px] font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header and Action Controls (hidden when printing) */}
      <div className="print:hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-primary">
            Permit Inspection <span className="mx-1.5 text-slate-soft">/</span> Step 03 - Preview Report
          </p>
          <h1 className="mt-1 text-[20px] font-bold tracking-[-0.035em] text-ink sm:text-[26px]">
            Permit Inspection Report
          </h1>
          <p className="mt-0.5 text-[12.5px] font-medium text-slate">
            {formData.city?.toUpperCase()} &bull; Permit <span className="font-mono font-bold text-primary">{formData.permitNumber}</span> &bull; Ready for Transmission
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onBackToForm}
            className="gap-1.5 bg-white"
          >
            <ArrowLeft size={15} /> Edit Form
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="gap-1.5 bg-white"
          >
            <Printer size={15} /> Print / PDF
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => setIsEmailModalOpen(true)}
            className="gap-1.5 shadow-sm"
          >
            <Mail size={15} /> Send via Email
          </Button>

          <Button
            type="button"
            variant="forest"
            size="sm"
            disabled={isSaved}
            onClick={handleSave}
            className="gap-1.5"
          >
            <CheckCircle2 size={15} /> {isSaved ? "Saved" : "Save Report"}
          </Button>
        </div>
      </div>

      {/* Official PPI Document Container (A4 styling) */}
      <div
        id="ppi-printable-report"
        className="mx-auto w-full max-w-[840px] rounded-2xl border border-paper-line bg-white p-8 sm:p-14 shadow-lg print:m-0 print:max-w-none print:border-none print:p-8 print:shadow-none"
      >
        {/* Document Header */}
        <div className="border-b-2 border-black pb-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded border border-ink/30 px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-widest text-ink mb-1.5">
                Official PPI Compliance Notice
              </div>
              <h2 className="font-serif text-[22px] sm:text-[24px] font-bold text-ink leading-tight">
                PRIVATE PROVIDER INSPECTION REPORT
              </h2>
              <p className="text-[12px] font-sans font-medium text-slate-soft">
                Pursuant to Florida Statute § 553.791 (Alternative Plans Review & Inspection)
              </p>
            </div>

            {/* Official Stamp / Seal Motif */}
            <div className="shrink-0 flex items-center justify-center h-20 w-20 rounded-full border-2 border-primary text-primary p-1 text-center font-mono">
              <div className="flex flex-col items-center justify-center">
                <span className="text-[7.5px] font-bold uppercase tracking-wider">FLORIDA P.E.</span>
                <span className="text-[13px] font-bold leading-none my-0.5">#92978</span>
                <span className="text-[7px] font-bold uppercase tracking-tight">CERTIFIED PPI</span>
              </div>
            </div>
          </div>
        </div>

        {/* Project & Authority Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-5 border-b border-paper-line text-[13px]">
          <div className="space-y-1.5">
            <p>
              <span className="font-bold text-slate text-[11px] uppercase tracking-wider">
                BUILDING JURISDICTION:
              </span>{" "}
              <strong className="text-ink font-semibold">{formData.countyDepartment || formData.city}</strong>
            </p>
            <p>
              <span className="font-bold text-slate text-[11px] uppercase tracking-wider">
                PERMIT NUMBER:
              </span>{" "}
              <span className="font-mono font-bold text-primary bg-primary-soft px-2 py-0.5 rounded">
                {formData.permitNumber}
              </span>
            </p>
            <p>
              <span className="font-bold text-slate text-[11px] uppercase tracking-wider">
                PROJECT ADDRESS:
              </span>{" "}
              <strong className="text-ink font-semibold">{formData.projectAddress || "None Specified"}</strong>
            </p>
          </div>

          <div className="space-y-1.5 sm:text-right">
            <p>
              <span className="font-bold text-slate text-[11px] uppercase tracking-wider">
                REPORT DATE:
              </span>{" "}
              <span className="font-mono text-ink font-semibold">{formattedDate}</span>
            </p>
            <p>
              <span className="font-bold text-slate text-[11px] uppercase tracking-wider">
                CITY / MUNICIPALITY:
              </span>{" "}
              <strong className="text-ink font-semibold">{formData.city}</strong>
            </p>
            <p>
              <span className="font-bold text-slate text-[11px] uppercase tracking-wider">
                GOVERNING CODE:
              </span>{" "}
              <span className="text-ink font-semibold">Florida Building Code 8th Edition (2023)</span>
            </p>
          </div>
        </div>

        {/* Provider & Contractor Details Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-5 border-b border-paper-line text-[12.5px]">
          {/* Provider Box */}
          <div className="rounded-xl border border-paper-line bg-paper/30 p-4 space-y-1">
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate mb-1 flex items-center gap-1.5">
              <Award size={13} className="text-primary" /> PRIVATE PROVIDER FIRM
            </p>
            <p className="font-bold text-ink">{formData.firmName}</p>
            <p className="text-slate">
              Qualifier: <strong className="text-ink font-semibold">{formData.qualifierName}</strong> (FL PE #92978)
            </p>
            <p className="text-slate font-mono text-[11.5px]">Phone: {formData.phone}</p>
            <p className="text-slate font-mono text-[11.5px]">Email: {formData.email}</p>
          </div>

          {/* Contractor Box */}
          <div className="rounded-xl border border-paper-line bg-paper/30 p-4 space-y-1">
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate mb-1 flex items-center gap-1.5">
              <HardHat size={13} className="text-slate" /> GENERAL CONTRACTOR
            </p>
            <p className="font-bold text-ink">{formData.contractorName || "Contractor On File"}</p>
            <p className="text-slate font-mono text-[11.5px]">
              License: <span className="font-semibold text-ink">{formData.contractorLicense || "N/A"}</span>
            </p>
            <p className="text-slate font-mono text-[11.5px]">Phone: {formData.contractorPhone || "N/A"}</p>
            <p className="text-slate font-mono text-[11.5px]">Email: {formData.contractorEmail || "N/A"}</p>
          </div>
        </div>

        {/* Inspections Conducted Table */}
        <div className="py-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-[13px] uppercase tracking-wider text-ink flex items-center gap-1.5">
              <FileCheck size={16} className="text-forest" /> RECORD OF INSPECTIONS CONDUCTED
            </h3>
            <span className="text-[11px] font-semibold text-slate">
              Total Inspections: {formData.inspections.length}
            </span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-black/80">
            <table className="w-full text-left text-[12px] text-ink font-sans">
              <thead>
                <tr className="border-b border-black bg-paper text-[10.5px] font-bold uppercase tracking-wider">
                  <th className="py-2.5 px-3 w-10">#</th>
                  <th className="py-2.5 px-3 w-20">CODE</th>
                  <th className="py-2.5 px-3">INSPECTION DESCRIPTION</th>
                  <th className="py-2.5 px-3 w-24">RESULT</th>
                  <th className="py-2.5 px-3 w-28 whitespace-nowrap">DATE</th>
                  <th className="py-2.5 px-3">INSPECTOR / LICENSE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/20">
                {formData.inspections.map((row, idx) => (
                  <tr key={row.id}>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-ink">{row.code}</td>
                    <td className="py-2.5 px-3 font-semibold text-ink">{row.inspection}</td>
                    <td className="py-2.5 px-3">
                      <span className="inline-flex items-center gap-1 rounded bg-forest-soft px-2 py-0.5 text-[11px] font-bold text-forest">
                        ✓ {row.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono whitespace-nowrap">{row.date}</td>
                    <td className="py-2.5 px-3 font-medium text-slate">
                      {row.inspector} (FL PE #92978)
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Florida Statute Certification Statement */}
        <div className="rounded-xl border border-paper-line bg-paper/20 p-4 text-[11.5px] text-ink leading-relaxed space-y-2">
          <p className="font-bold uppercase tracking-wider text-slate text-[10px]">
            STATUTORY AFFIDAVIT & CERTIFICATION OF COMPLIANCE
          </p>
          <p>
            Pursuant to <strong>Section 553.791, Florida Statutes</strong>, the undersigned licensed Private
            Provider / Qualified Inspector certifies that the components and work described in the inspection log
            above were inspected on the dates indicated and found to be in compliance with the permitted plans
            and the applicable provisions of the Florida Building Code.
          </p>
          <p className="text-[11px] text-slate italic">
            This report serves as formal notification to the local building official and property owner. All field
            inspection records, photographs, and logs are maintained in the permanent records of the Private Provider firm.
          </p>
        </div>

        {/* Signatures & Seal Section */}
        <div className="pt-8 mt-6 border-t border-black/80 flex flex-col sm:flex-row items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="h-10 flex items-end">
              <span className="font-serif italic text-[18px] text-ink font-bold">
                {formData.qualifierName}
              </span>
            </div>
            <div className="w-64 border-t border-black pt-1">
              <p className="font-bold text-[12px] text-ink">{formData.qualifierName}, P.E.</p>
              <p className="text-[11px] text-slate">Florida Professional Engineer #92978</p>
              <p className="text-[11px] text-slate font-mono">Date: {formattedDate}</p>
            </div>
          </div>

          {/* Seal Box */}
          <div className="rounded-lg border border-dashed border-slate-soft p-3 text-center w-52">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary text-primary">
              <ShieldCheck size={26} />
            </div>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-primary">
              DIGITALLY CERTIFIED & SEALED
            </p>
            <p className="text-[9.5px] text-slate font-mono">
              FL PE #92978 · SHA256:4f8e...
            </p>
          </div>
        </div>
      </div>

      {/* Bottom controls (hidden when printing) */}
      <div className="print:hidden flex items-center justify-between pt-4 border-t border-paper-line">
        <Button variant="outline" onClick={onBackToForm} className="gap-2 bg-white">
          <ArrowLeft size={16} /> Back to Complete Form
        </Button>

        <div className="flex items-center gap-3">
          <Button variant="primary" onClick={() => setIsEmailModalOpen(true)} className="gap-2 shadow-sm">
            <Mail size={16} /> Send Document via Email
          </Button>
          <Button variant="outline" onClick={onRestart} className="bg-white">
            New Permit Inspection
          </Button>
        </div>
      </div>

      {/* Send Document via Email Modal */}
      <SendEmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        permitNumber={formData.permitNumber}
        cityName={formData.city}
        defaultDate={formData.inspections[0]?.date || formattedDate}
        onSuccess={handleEmailSuccess}
      />
    </div>
  );
}
