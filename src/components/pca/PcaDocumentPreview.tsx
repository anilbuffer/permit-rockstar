"use client";

import type {
  PcaProvider,
  PcaNotary,
  PcaSheetFile,
  PcaTemplateType,
  PcaSignatureType,
  SheetViewMode,
} from "@/lib/types";
import { formatSheetsList } from "@/lib/mock-data";

interface PcaDocumentPreviewProps {
  template: PcaTemplateType;
  signatureOption: PcaSignatureType;
  provider: PcaProvider;
  notary: PcaNotary;
  signedDate: string;
  files: PcaSheetFile[];
  viewMode: SheetViewMode;
}

export function PcaDocumentPreview({
  template,
  signatureOption,
  provider,
  notary,
  signedDate,
  files,
  viewMode,
}: PcaDocumentPreviewProps) {
  const isJacksonville = template === "jacksonville";
  const hasSignatures = signatureOption === "embedded";
  const sheetsText = formatSheetsList(files, viewMode);
  const totalPages = isJacksonville ? 2 : 1;

  // Format date display (e.g. 09-29-2026)
  const formattedDate = signedDate || "09-29-2026";

  return (
    <div className="space-y-8 font-serif text-black print:space-y-0" id="pca-printable-document">
      {/* PAGE 1: Jacksonville Cover Page (Only if template is jacksonville) */}
      {isJacksonville && (
        <div className="mx-auto w-full max-w-[760px] bg-white p-8 sm:p-12 shadow-xl border border-paper-line rounded-sm print:shadow-none print:border-none print:m-0 print:p-8 print:max-w-none print:page-break-after-always">
          {/* Page Number */}
          <div className="text-right text-[10px] font-sans font-semibold tracking-wider text-slate-soft mb-2">
            PAGE 1 OF {totalPages}
          </div>

          {/* Header */}
          <div className="flex items-center gap-4 border-b border-black pb-4">
            {/* Jacksonville Emblem SVG */}
            <div className="h-16 w-16 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="h-16 w-16 text-primary">
                <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="3" />
                <circle cx="50" cy="50" r="44" fill="#00557f" />
                <circle cx="50" cy="50" r="39" fill="none" stroke="#f5b82e" strokeWidth="1.5" />
                {/* Skyline / Bridge motif */}
                <path
                  d="M25 62 L32 45 L38 52 L48 36 L55 50 L65 40 L75 62 Z"
                  fill="#ffffff"
                  opacity="0.9"
                />
                <path
                  d="M20 62 Q50 56 80 62"
                  stroke="#f5b82e"
                  strokeWidth="2.5"
                  fill="none"
                />
                <path
                  d="M22 66 Q50 63 78 66"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  fill="none"
                />
                <text
                  x="50"
                  y="26"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="7"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  CITY OF JACKSONVILLE
                </text>
                <text
                  x="50"
                  y="82"
                  textAnchor="middle"
                  fill="#f5b82e"
                  fontSize="6.5"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  FLORIDA
                </text>
              </svg>
            </div>

            <div className="text-center flex-1">
              <h1 className="text-[15px] sm:text-[17px] font-bold uppercase tracking-wide leading-tight text-ink font-serif">
                City of Jacksonville - Department of Public Works
              </h1>
              <h2 className="text-[13px] sm:text-[14px] font-semibold text-ink font-serif mt-0.5">
                Building Inspection Division
              </h2>
            </div>
          </div>

          {/* Document Title */}
          <div className="mt-4 text-center">
            <h3 className="text-[13px] sm:text-[14.5px] font-bold uppercase tracking-wider text-ink font-serif">
              PRIVATE PROVIDER PLAN COMPLIANCE AFFIDAVIT COVER PAGE
            </h3>
            <div className="mt-1 flex items-center justify-center gap-6 text-[10.5px] font-sans text-slate">
              <span>REVISED: <strong className="text-ink underline">{formattedDate}</strong></span>
              <span className="italic">* Indicates a required field</span>
            </div>
          </div>

          {/* PROJECT INFORMATION BOX */}
          <div className="mt-4 border border-black p-3.5">
            <div className="bg-black text-white text-center py-0.5 text-[10px] font-bold uppercase tracking-wider font-sans">
              Project Information
            </div>
            <div className="mt-3 space-y-3 text-[11px] font-serif">
              <div className="flex items-baseline gap-2">
                <span className="font-bold whitespace-nowrap">*Permit Number:</span>
                <span className="flex-1 border-b border-black h-4 block" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-bold whitespace-nowrap">*Project Address:</span>
                <span className="flex-1 border-b border-black h-4 block" />
              </div>
            </div>
          </div>

          {/* REQUIRED INSPECTIONS BOX */}
          <div className="mt-4 border border-black p-3.5">
            <div className="bg-black text-white text-center py-0.5 text-[10px] font-bold uppercase tracking-wider font-sans">
              Required Inspections
            </div>

            <div className="mt-3 grid grid-cols-12 gap-3 text-[10px] font-serif">
              {/* Left sidebar: Required Associated Permits */}
              <div className="col-span-4 border-r border-black pr-3 space-y-2">
                <div className="border border-black p-1.5 text-center font-bold font-sans text-[9px] bg-paper-line/30 uppercase leading-tight">
                  Required Associated Permits
                </div>
                <div className="space-y-1.5 pl-1 pt-1">
                  {["Electrical Permit", "Mechanical Permit", "Plumbing Permit", "Roofing Permit"].map(
                    (p) => (
                      <label key={p} className="flex items-center gap-2 cursor-default">
                        <span className="h-3 w-3 border border-black inline-block bg-white" />
                        <span>{p}</span>
                      </label>
                    )
                  )}
                </div>
              </div>

              {/* Right: Inspection Checkboxes in 2 columns */}
              <div className="col-span-8 grid grid-cols-2 gap-x-2 gap-y-1 pl-1">
                {[
                  "Accessibility",
                  "Deep Foundation",
                  "Dry-In",
                  "Drywall Fastening",
                  "Elevated Flatwork/Flashing",
                  "Fill Cell",
                  "Final",
                  "Final Curtain Wall",
                  "Footing",
                  "Framing",
                  "Insulation",
                  "Lathing",
                  "Open Floor Framing",
                  "Rated Wall",
                  "Roof Sheathing (Commercial)",
                  "Roof/Wall Sheathing (Residential)",
                  "Slab",
                  "Swimming Pool",
                  "Threshold Insp/Report",
                  "Tie/Beam",
                  "Tilt Wall Panel",
                  "Wall Sheathing (Commercial)",
                ].map((insp) => (
                  <label key={insp} className="flex items-center gap-1.5 cursor-default truncate">
                    <span className="h-3 w-3 border border-black inline-block shrink-0 bg-white" />
                    <span className="truncate">{insp}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* PRIVATE PROVIDER FIRM CONTACT INFORMATION */}
          <div className="mt-4 border border-black p-3.5">
            <div className="bg-black text-white text-center py-0.5 text-[10px] font-bold uppercase tracking-wider font-sans">
              Private Provider Firm Contact Information
            </div>

            <div className="mt-3 space-y-2 text-[10.5px] font-serif">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-bold">*Company Name: </span>
                  <span className="font-semibold underline">{provider.companyName}</span>
                </div>
                <div>
                  <span className="font-bold">*Qualifier: </span>
                  <span className="font-semibold underline">{provider.name}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-bold">*License #: </span>
                  <span className="font-semibold underline">{provider.licenseNumber}</span>
                </div>
                <div />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-bold">*Phone #: </span>
                  <span className="font-semibold underline">{provider.phone}</span>
                </div>
                <div>
                  <span className="font-bold">*Email: </span>
                  <span className="font-semibold underline">{provider.email}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1">
                <div className="flex items-baseline gap-1">
                  <span className="font-bold whitespace-nowrap">*Primary Contact:</span>
                  <span className="flex-1 border-b border-black h-3.5 block" />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-bold whitespace-nowrap">*Email:</span>
                  <span className="flex-1 border-b border-black h-3.5 block" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-baseline gap-1">
                  <span className="font-bold whitespace-nowrap">*Phone #:</span>
                  <span className="flex-1 border-b border-black h-3.5 block" />
                </div>
                <div />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1">
                <div className="flex items-baseline gap-1">
                  <span className="font-bold whitespace-nowrap">Secondary Contact:</span>
                  <span className="flex-1 border-b border-black h-3.5 block" />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-bold whitespace-nowrap">Email:</span>
                  <span className="flex-1 border-b border-black h-3.5 block" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-baseline gap-1">
                  <span className="font-bold whitespace-nowrap">Phone #:</span>
                  <span className="flex-1 border-b border-black h-3.5 block" />
                </div>
                <div />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 2: Private Provider Plan Compliance Affidavit */}
      <div className="mx-auto w-full max-w-[760px] bg-white p-8 sm:p-12 shadow-xl border border-paper-line rounded-sm print:shadow-none print:border-none print:m-0 print:p-8 print:max-w-none">
        {/* Page Number */}
        <div className="text-right text-[10px] font-sans font-semibold tracking-wider text-slate-soft mb-2">
          PAGE {totalPages} OF {totalPages}
        </div>

        {/* Top Header */}
        <div className="text-center space-y-1 border-b border-paper-line pb-4">
          <p className="text-[10px] font-mono text-slate">Form # 98 / 1891-2002-02</p>
          <h2 className="text-[18px] sm:text-[20px] font-bold text-ink font-serif tracking-tight">
            Private Provider
          </h2>
          <h3 className="text-[16px] sm:text-[18px] font-bold text-ink font-serif">
            Plan Compliance Affidavit
          </h3>
          <p className="text-[11px] font-serif italic text-slate">
            Effective January 20, 2003
          </p>
        </div>

        {/* Firm / Provider Meta Block */}
        <div className="mt-5 space-y-2 text-[11px] font-serif leading-relaxed">
          <div>
            <span className="font-bold">Private Provider Firm: </span>
            <span className="font-bold">{provider.companyName}</span>
          </div>
          <div>
            <span className="font-bold">Private Provider: </span>
            <span className="font-bold">{provider.name}</span>
          </div>
          <div>
            <span className="font-bold">Address: </span>
            <span>{provider.address}</span>
          </div>
          <div className="flex items-center gap-8">
            <div>
              <span className="font-bold">Phone: </span>
              <span>{provider.phone}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-bold">Fax: </span>
              <span className="w-48 border-b border-black inline-block h-3" />
            </div>
          </div>
          <div>
            <span className="font-bold">Email: </span>
            <span className="underline">{provider.email}</span>
          </div>
        </div>

        {/* Statutory Legal Affirmation Paragraph */}
        <div className="mt-5 text-[11px] leading-relaxed text-justify font-serif">
          I hereby certify that to the best of my knowledge and belief the plans submitted were
          reviewed for and are in compliance with the Florida Building Code and all local amendments
          to the Florida Building Code by the following affiant, who is duly authorized to perform
          plans review pursuant to Section 553.791, Florida Statute and holds the appropriate license
          or certificate.
        </div>

        {/* Reviewer Details & Dynamic Plan Sheets */}
        <div className="mt-5 space-y-2.5 text-[11px] font-serif">
          <div>
            <span className="font-bold">Name: </span>
            <span className="font-bold">{provider.name}</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-bold whitespace-nowrap">Plan Sheets: </span>
            <span className="font-bold border-b border-black pb-0.5 flex-1 break-words">
              {sheetsText}
            </span>
          </div>

          <div>
            <span className="font-bold">
              Florida License/Registration/Certification #(s) and description:{" "}
            </span>
            <span className="font-bold">{provider.licenseNumber}</span>
          </div>
        </div>

        {/* Signature of Reviewer */}
        <div className="mt-6 pt-2">
          <div className="flex flex-col max-w-sm">
            <div className="h-14 relative flex items-end">
              {hasSignatures ? (
                /* Authentic Blue Cursive Signature Graphic */
                <svg viewBox="0 0 260 70" className="h-14 text-[#003399]">
                  <path
                    d="M15 48 C 25 15, 35 12, 45 42 C 55 58, 65 30, 75 42 C 85 45, 95 38, 110 40 C 130 42, 140 22, 155 38 C 170 50, 185 30, 205 32 C 225 34, 245 28, 255 30"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M32 20 Q 55 60 70 30"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M10 54 Q 130 50 250 48"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <div className="w-full border-b border-black" />
              )}
            </div>
            <div className="border-t border-black pt-1 text-[10.5px] font-serif">
              Signature of Reviewer
            </div>
          </div>
        </div>

        {/* Jurat Statement */}
        <div className="mt-5 space-y-1.5 text-[11px] font-serif leading-snug">
          <p>
            SWORN AND SUBSCRIBED before me by{" "}
            <strong className="underline font-bold">{provider.name}</strong> on:{" "}
            <strong className="underline font-bold">{formattedDate}</strong>
          </p>
          <div className="flex items-center gap-6 text-[10.5px]">
            <span className="flex items-center gap-1.5">
              being personally known to me
              <span className="h-4 w-4 border border-black inline-flex items-center justify-center font-bold text-[11px]">
                ✓
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              or having produced as identification
              <span className="h-4 w-4 border border-black inline-block" />
            </span>
          </div>
          <p className="text-[10.5px] text-justify pt-1">
            and who being fully sworn and cautioned, state that the foregoing is true and correct to the
            best of his/her knowledge or belief.
          </p>
        </div>

        {/* Notary Jurat, Signature, Stamp Block */}
        <div className="mt-6 grid grid-cols-12 gap-6 items-end">
          {/* Left: Notary Signature & Details */}
          <div className="col-span-7 space-y-2">
            <div className="h-14 relative flex items-end">
              {hasSignatures ? (
                /* Notary Cursive Signature */
                <svg viewBox="0 0 240 60" className="h-14 text-ink">
                  <path
                    d="M10 42 C 28 10, 40 18, 55 40 C 70 55, 80 25, 95 38 C 110 46, 125 32, 140 38 C 160 42, 175 22, 195 32 C 210 40, 225 30, 235 34"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M38 12 Q 52 52 65 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <div className="w-full border-b border-black" />
              )}
            </div>
            <div className="border-t border-black pt-1 text-[10.5px] font-serif">
              Signature of Notary
            </div>

            <div className="pt-2 text-[10.5px] font-serif space-y-1">
              <div>
                <span className="font-bold">Print Name: </span>
                <span className="font-bold underline">{notary.name}</span>
              </div>
              <p className="italic text-[10px] text-slate">
                *Notarized online using audio-video communication
              </p>
              <p className="font-bold text-[10px] uppercase tracking-wider text-ink pt-1">
                Notary Public: NOTARY STAMP BELOW
              </p>
              <div>
                <span>My commission expires: </span>
                <span className="font-bold underline">{notary.commissionExpires}</span>
              </div>
            </div>
          </div>

          {/* Right: Authentic Florida Notary Stamp */}
          <div className="col-span-5 flex justify-end">
            <div className="border-2 border-black p-2.5 w-60 rounded-xs bg-white text-center shadow-xs">
              <div className="flex items-center gap-2 border border-black p-2">
                {/* Florida Notary Seal Graphic */}
                <svg viewBox="0 0 80 80" className="h-12 w-12 shrink-0">
                  <circle cx="40" cy="40" r="38" fill="none" stroke="black" strokeWidth="2" />
                  <circle cx="40" cy="40" r="34" fill="none" stroke="black" strokeWidth="1" />
                  <text
                    x="40"
                    y="18"
                    textAnchor="middle"
                    fontSize="6"
                    fontWeight="bold"
                    fontFamily="serif"
                  >
                    STATE OF FLORIDA
                  </text>
                  {/* State silhouette representation */}
                  <path
                    d="M26 30 L45 30 L48 46 L58 58 L54 62 L46 54 L44 48 L26 38 Z"
                    fill="#333"
                  />
                  <text
                    x="40"
                    y="70"
                    textAnchor="middle"
                    fontSize="5"
                    fontWeight="bold"
                    fontFamily="serif"
                  >
                    NOTARY PUBLIC
                  </text>
                </svg>

                {/* Stamp Text */}
                <div className="text-left font-sans text-[8.5px] leading-tight flex-1">
                  <p className="font-black uppercase tracking-wider text-black">{notary.name}</p>
                  <p className="text-[7.5px] uppercase font-bold text-slate">Notary Public</p>
                  <p className="text-[7.5px] uppercase font-bold text-slate">State of Florida</p>
                  <p className="font-mono text-[8px] font-bold text-black mt-0.5">
                    Comm. #{notary.commissionNumber}
                  </p>
                  <p className="text-[7.5px] font-semibold text-slate">
                    Expires {notary.commissionExpires}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
