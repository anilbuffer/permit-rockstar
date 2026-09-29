"use client";

import { useState } from "react";
import { X, ChevronDown, Send, Calendar, Check, Loader2 } from "lucide-react";
import clsx from "clsx";

interface SendEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  permitNumber?: string;
  cityName?: string;
  defaultDate?: string;
  onSuccess?: (message: string) => void;
}

export function SendEmailModal({
  isOpen,
  onClose,
  permitNumber = "256966",
  cityName = "Boca Raton",
  defaultDate = "09-30-2026",
  onSuccess,
}: SendEmailModalProps) {
  const [fromEmail, setFromEmail] = useState("fabian@permitrockstar.com");
  const [senderName, setSenderName] = useState("Permit Rockstar");
  const [replyTo, setReplyTo] = useState("fabian@permitrockstar.com");

  const [toRecipients, setToRecipients] = useState<string[]>([
    "archana@creativebuffer.com",
    "JTcheou@myboca.us",
    "test@yopmail.com",
  ]);
  const [newToInput, setNewToInput] = useState("");

  const [ccRecipients, setCcRecipients] = useState<string[]>([
    "fabian@permitrockstar.com",
    "karen@permitrockstar.com",
    "fadil@permitrockstar.com",
  ]);
  const [newCcInput, setNewCcInput] = useState("");

  const [subject, setSubject] = useState(
    `Private Provider inspection notification - 369457896 - ${permitNumber || "45899"}`
  );

  const [messageBody, setMessageBody] = useState(
    `We want to notify the City of the following inspections\n\n${defaultDate}`
  );

  const [isSending, setIsSending] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [showSchedulePicker, setShowSchedulePicker] = useState(false);
  const [scheduleDateTime, setScheduleDateTime] = useState("2026-09-30T08:00");

  if (!isOpen) return null;

  function handleAddRecipient(type: "to" | "cc") {
    const val = type === "to" ? newToInput.trim() : newCcInput.trim();
    if (!val) return;

    if (type === "to") {
      if (!toRecipients.includes(val)) {
        setToRecipients([...toRecipients, val]);
      }
      setNewToInput("");
    } else {
      if (!ccRecipients.includes(val)) {
        setCcRecipients([...ccRecipients, val]);
      }
      setNewCcInput("");
    }
  }

  function handleRemoveRecipient(type: "to" | "cc", emailToRemove: string) {
    if (type === "to") {
      setToRecipients(toRecipients.filter((e) => e !== emailToRemove));
    } else {
      setCcRecipients(ccRecipients.filter((e) => e !== emailToRemove));
    }
  }

  function handleSend() {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      onSuccess?.(
        `Inspection report successfully dispatched to ${toRecipients.length} recipients.`
      );
      onClose();
    }, 1200);
  }

  function handleSchedule() {
    setIsScheduled(true);
    setTimeout(() => {
      setIsScheduled(false);
      setShowSchedulePicker(false);
      onSuccess?.(
        `Inspection report transmission scheduled for ${scheduleDateTime.replace("T", " at ")}.`
      );
      onClose();
    }, 900);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-up overflow-y-auto">
      <div className="relative my-auto w-full max-w-[620px] rounded-2xl bg-paper-raised border border-paper-line shadow-2xl overflow-hidden">
        {/* Top brand banner accent */}
        <div className="h-1.5 w-full bg-primary" />

        {/* Modal Header */}
        <div className="relative border-b border-paper-line px-6 pt-5 pb-4">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 flex h-7 w-7 items-center justify-center rounded-lg text-slate-soft hover:bg-paper hover:text-ink transition-colors"
          >
            <X size={18} />
          </button>
          <h2 className="font-bold text-[18px] text-ink">Send Document via Email</h2>
          <p className="mt-0.5 text-[12.5px] text-slate">
            Transmit the generated Private Provider Inspector report as a PDF attachment
          </p>
        </div>

        {/* Modal Body */}
        <div className="max-h-[75vh] overflow-y-auto px-6 py-5 space-y-4">
          {/* FROM (EMAIL) */}
          <div>
            <label className="block font-mono text-[10.5px] font-bold uppercase tracking-wider text-slate mb-1">
              FROM (EMAIL)
            </label>
            <input
              type="email"
              value={fromEmail}
              onChange={(e) => setFromEmail(e.target.value)}
              className="w-full rounded-xl border border-paper-line bg-paper-raised px-3.5 py-2.5 text-[13.5px] text-ink focus:border-primary focus:bg-white focus:outline-none transition-colors"
            />
          </div>

          {/* SENDER NAME */}
          <div>
            <label className="block font-mono text-[10.5px] font-bold uppercase tracking-wider text-slate mb-1">
              SENDER NAME
            </label>
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              className="w-full rounded-xl border border-paper-line bg-paper-raised px-3.5 py-2.5 text-[13.5px] text-ink focus:border-primary focus:bg-white focus:outline-none transition-colors"
            />
          </div>

          {/* REPLY TO */}
          <div>
            <label className="block font-mono text-[10.5px] font-bold uppercase tracking-wider text-slate mb-1">
              REPLY TO
            </label>
            <div className="flex items-center justify-between rounded-xl border border-paper-line bg-paper-raised px-3 py-2 text-[13px] text-ink focus-within:border-primary transition-colors">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-paper px-2 py-1 text-[12.5px] font-medium text-ink">
                {replyTo}
                <button
                  type="button"
                  onClick={() => setReplyTo("")}
                  className="text-slate-soft hover:text-ink"
                >
                  <X size={12} />
                </button>
              </span>
              <div className="flex items-center gap-2 text-slate-soft">
                <div className="h-4 w-px bg-paper-line" />
                <ChevronDown size={14} />
              </div>
            </div>
          </div>

          {/* TO */}
          <div>
            <label className="block font-mono text-[10.5px] font-bold uppercase tracking-wider text-slate mb-1">
              TO
            </label>
            <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-paper-line bg-paper-raised p-2 focus-within:border-primary transition-colors">
              {toRecipients.map((recipient) => (
                <span
                  key={recipient}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-white text-[12px] font-medium px-2.5 py-1 shadow-2xs"
                >
                  <span>{recipient}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveRecipient("to", recipient)}
                    className="hover:opacity-75"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}

              <input
                type="email"
                value={newToInput}
                onChange={(e) => setNewToInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    handleAddRecipient("to");
                  }
                }}
                onBlur={() => handleAddRecipient("to")}
                placeholder={toRecipients.length === 0 ? "Add email address..." : ""}
                className="flex-1 min-w-[130px] border-none bg-transparent px-1 py-0.5 text-[12.5px] text-ink outline-none placeholder:text-slate-soft"
              />

              <div className="ml-auto flex items-center gap-1.5 pl-2 text-slate-soft">
                {toRecipients.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setToRecipients([])}
                    className="hover:text-ink"
                    title="Clear all"
                  >
                    <X size={13} />
                  </button>
                )}
                <div className="h-4 w-px bg-paper-line" />
                <ChevronDown size={14} />
              </div>
            </div>
          </div>

          {/* CC */}
          <div>
            <label className="block font-mono text-[10.5px] font-bold uppercase tracking-wider text-slate mb-1">
              CC
            </label>
            <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-paper-line bg-paper-raised p-2 focus-within:border-primary transition-colors">
              {ccRecipients.map((recipient) => (
                <span
                  key={recipient}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-white text-[12px] font-medium px-2.5 py-1 shadow-2xs"
                >
                  <span>{recipient}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveRecipient("cc", recipient)}
                    className="hover:opacity-75"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}

              <input
                type="email"
                value={newCcInput}
                onChange={(e) => setNewCcInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    handleAddRecipient("cc");
                  }
                }}
                onBlur={() => handleAddRecipient("cc")}
                placeholder={ccRecipients.length === 0 ? "Add CC email..." : ""}
                className="flex-1 min-w-[130px] border-none bg-transparent px-1 py-0.5 text-[12.5px] text-ink outline-none placeholder:text-slate-soft"
              />

              <div className="ml-auto flex items-center gap-1.5 pl-2 text-slate-soft">
                {ccRecipients.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setCcRecipients([])}
                    className="hover:text-ink"
                    title="Clear all"
                  >
                    <X size={13} />
                  </button>
                )}
                <div className="h-4 w-px bg-paper-line" />
                <ChevronDown size={14} />
              </div>
            </div>
          </div>

          {/* SUBJECT */}
          <div>
            <label className="block font-mono text-[10.5px] font-bold uppercase tracking-wider text-slate mb-1">
              SUBJECT
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-xl border border-paper-line bg-paper-raised px-3.5 py-2.5 text-[13.5px] text-ink focus:border-primary focus:bg-white focus:outline-none transition-colors"
            />
          </div>

          {/* MESSAGE BODY */}
          <div>
            <label className="block font-mono text-[10.5px] font-bold uppercase tracking-wider text-slate mb-1">
              MESSAGE BODY
            </label>
            <textarea
              rows={4}
              value={messageBody}
              onChange={(e) => setMessageBody(e.target.value)}
              className="w-full rounded-xl border border-paper-line bg-paper-raised p-3.5 text-[13.5px] font-sans text-ink focus:border-primary focus:bg-white focus:outline-none transition-colors resize-y leading-relaxed"
            />
          </div>

          {/* PDF Attachment badge */}
          <div className="flex items-center gap-3 rounded-xl border border-paper-line bg-paper/60 p-3 text-[12px]">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-soft text-primary font-bold text-[11px]">
              PDF
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-ink">
                PPI_Inspection_Report_{permitNumber || "256966"}.pdf
              </p>
              <p className="text-[11px] text-slate">148 KB · Certified Private Provider Document</p>
            </div>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-forest">
              <Check size={14} /> Attached
            </span>
          </div>

          {/* Schedule Picker expansion */}
          {showSchedulePicker && (
            <div className="rounded-xl border border-paper-line bg-paper/60 p-4 space-y-3 animate-fade-up">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold uppercase tracking-wider text-ink flex items-center gap-1.5">
                  <Calendar size={14} className="text-primary" /> Schedule Transmission
                </span>
                <button
                  type="button"
                  onClick={() => setShowSchedulePicker(false)}
                  className="text-[11px] text-slate hover:text-ink"
                >
                  Cancel
                </button>
              </div>
              <input
                type="datetime-local"
                value={scheduleDateTime}
                onChange={(e) => setScheduleDateTime(e.target.value)}
                className="w-full rounded-lg border border-paper-line bg-white px-3 py-2 text-[13px] text-ink focus:border-primary focus:outline-none"
              />
              <p className="text-[11px] text-slate">
                Email will automatically be dispatched to the jurisdiction at the specified time.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex flex-wrap items-center justify-end gap-2.5 border-t border-paper-line bg-paper/40 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-paper-line bg-white px-5 py-2.5 text-[12.5px] font-semibold text-ink hover:bg-paper transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isSending || isScheduled}
            onClick={() => {
              if (!showSchedulePicker) {
                setShowSchedulePicker(true);
              } else {
                handleSchedule();
              }
            }}
            className="flex items-center gap-1.5 rounded-xl border border-paper-line bg-white hover:bg-paper px-5 py-2.5 text-[12.5px] font-semibold text-ink shadow-2xs transition-colors disabled:opacity-50"
          >
            {isScheduled ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Scheduling...
              </>
            ) : (
              <>
                <Calendar size={14} /> Schedule Email
              </>
            )}
          </button>

          <button
            type="button"
            disabled={isSending || isScheduled}
            onClick={handleSend}
            className="flex items-center gap-2 rounded-xl bg-primary hover:bg-primary-dark px-6 py-2.5 text-[12.5px] font-semibold text-white shadow-sm transition-colors disabled:opacity-50"
          >
            {isSending ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Sending...
              </>
            ) : (
              <>
                <Send size={14} /> Send Email
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
