"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { SavedPcaRecord } from "@/lib/types";

interface DeletePcaRecordModalProps {
  record: SavedPcaRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => void;
}

export function DeletePcaRecordModal({
  record,
  isOpen,
  onClose,
  onConfirm,
}: DeletePcaRecordModalProps) {
  if (!isOpen || !record) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-xs animate-fade-up">
      <div className="relative w-full max-w-md rounded-2xl border border-paper-line bg-paper-raised p-6 shadow-2xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-alert-soft text-alert">
            <AlertTriangle size={22} />
          </div>
          <div>
            <h3 className="text-[16px] font-bold text-ink">
              Delete PCA Record?
            </h3>
            <p className="text-[12px] text-slate">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <p className="text-[13px] text-slate leading-relaxed">
          Are you sure you want to delete the PCA record for{" "}
          <strong className="text-ink font-semibold">
            {record.projectAddress || record.permitNumber || record.city}
          </strong>
          ?
        </p>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="bg-white"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => {
              onConfirm(record.id);
              onClose();
            }}
            className="bg-alert hover:bg-alert/90 text-white"
          >
            Delete Record
          </Button>
        </div>
      </div>
    </div>
  );
}
