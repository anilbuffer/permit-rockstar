"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Eye,
  Pencil,
  Trash2,
  ChevronDown,
  Plus,
  RotateCcw,
  FileCheck2,
} from "lucide-react";
import clsx from "clsx";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ViewPcaRecordModal } from "./ViewPcaRecordModal";
import { EditPcaRecordModal } from "./EditPcaRecordModal";
import { DeletePcaRecordModal } from "./DeletePcaRecordModal";
import {
  getStoredSavedPcaRecords,
  deletePcaRecordItem,
  updatePcaRecordItem,
} from "@/lib/mock-data";
import type { SavedPcaRecord } from "@/lib/types";

export function SavedPcaTable() {
  const [records, setRecords] = useState<SavedPcaRecord[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Filter state
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [providerQuery, setProviderQuery] = useState("");
  const [contractorQuery, setContractorQuery] = useState("");
  const [addressQuery, setAddressQuery] = useState("");

  // Applied filter state
  const [appliedFilters, setAppliedFilters] = useState({
    city: "All Cities",
    provider: "",
    contractor: "",
    address: "",
  });

  // Modals state
  const [viewRecord, setViewRecord] = useState<SavedPcaRecord | null>(null);
  const [editRecord, setEditRecord] = useState<SavedPcaRecord | null>(null);
  const [deleteRecord, setDeleteRecord] = useState<SavedPcaRecord | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    setRecords(getStoredSavedPcaRecords());
    setLoaded(true);
  }, []);

  // Unique cities list for the dropdown
  const cities = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r) => {
      if (r.city && r.city.trim()) set.add(r.city.trim());
    });
    return ["All Cities", ...Array.from(set)];
  }, [records]);

  // Apply filters
  function handleApply() {
    setAppliedFilters({
      city: selectedCity,
      provider: providerQuery.trim().toLowerCase(),
      contractor: contractorQuery.trim().toLowerCase(),
      address: addressQuery.trim().toLowerCase(),
    });
    setCurrentPage(1);
  }

  // Reset filters
  function handleReset() {
    setSelectedCity("All Cities");
    setProviderQuery("");
    setContractorQuery("");
    setAddressQuery("");
    setAppliedFilters({
      city: "All Cities",
      provider: "",
      contractor: "",
      address: "",
    });
    setCurrentPage(1);
  }

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((item) => {
      // City match
      if (
        appliedFilters.city !== "All Cities" &&
        item.city.toLowerCase() !== appliedFilters.city.toLowerCase()
      ) {
        return false;
      }
      // Provider match
      if (
        appliedFilters.provider &&
        !item.privateProvider.toLowerCase().includes(appliedFilters.provider)
      ) {
        return false;
      }
      // Contractor match
      if (
        appliedFilters.contractor &&
        !item.contractor.toLowerCase().includes(appliedFilters.contractor)
      ) {
        return false;
      }
      // Address match
      if (
        appliedFilters.address &&
        !(item.projectAddress || "").toLowerCase().includes(appliedFilters.address)
      ) {
        return false;
      }
      return true;
    });
  }, [records, appliedFilters]);

  // Pagination slice
  const totalCount = filteredRecords.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedRecords = filteredRecords.slice(
    startIndex,
    startIndex + pageSize
  );

  // Delete handler
  function handleDeleteConfirm(id: string) {
    const updated = deletePcaRecordItem(id);
    setRecords(updated);
  }

  // Save edited record handler
  function handleSaveEdit(updated: SavedPcaRecord) {
    const list = updatePcaRecordItem(updated);
    setRecords(list);
  }

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Top Brand Header */}
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-primary">
            Private Provider <span className="mx-1.5 text-slate-soft">/</span> Document Archive
          </p>
          <div className="mt-1 flex items-center gap-3">
            <h1 className="text-[20px] font-bold tracking-[-0.035em] text-ink sm:text-[26px]">
              Saved PCA Records
            </h1>
            <span className="rounded-full border border-primary/20 bg-primary-soft px-3 py-0.5 text-[11.5px] font-bold text-primary">
              {totalCount} records
            </span>
          </div>
          <p className="mt-1 max-w-2xl text-[12.5px] leading-relaxed text-slate">
            View, search, and manage all Florida private provider plan compliance certificates and affidavits.
          </p>
        </div>

        <Link href="/pca">
          <Button variant="primary" size="md" className="gap-2 shadow-xs shrink-0 font-semibold">
            <Plus size={16} /> New PCA Workflow
          </Button>
        </Link>
      </header>

      {/* Filter / Search Card */}
      <Card padded={false} className="p-5 sm:p-6 shadow-[0_4px_20px_rgba(23,19,15,0.03)] border-paper-line bg-paper-raised">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          {/* City Dropdown */}
          <div className="space-y-1.5">
            <label className="block font-mono text-[10.5px] font-bold uppercase tracking-wider text-slate">
              City
            </label>
            <div className="relative">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full appearance-none rounded-xl border border-paper-line bg-paper px-3 py-2 text-[13px] font-medium text-ink shadow-2xs focus:border-primary focus:bg-white focus:outline-none transition-colors pr-8 cursor-pointer"
              >
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-2.5 top-2.5 text-slate-soft"
              />
            </div>
          </div>

          {/* Private Provider Input */}
          <div className="space-y-1.5">
            <label className="block font-mono text-[10.5px] font-bold uppercase tracking-wider text-slate">
              Private Provider
            </label>
            <input
              type="text"
              value={providerQuery}
              onChange={(e) => setProviderQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleApply()}
              placeholder="Enter provider name"
              className="w-full rounded-xl border border-paper-line bg-paper px-3 py-2 text-[13px] font-medium text-ink shadow-2xs focus:border-primary focus:bg-white focus:outline-none transition-colors placeholder:text-slate-soft/70"
            />
          </div>

          {/* Contractor Name Input */}
          <div className="space-y-1.5">
            <label className="block font-mono text-[10.5px] font-bold uppercase tracking-wider text-slate">
              Contractor Name
            </label>
            <input
              type="text"
              value={contractorQuery}
              onChange={(e) => setContractorQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleApply()}
              placeholder="Enter contractor name"
              className="w-full rounded-xl border border-paper-line bg-paper px-3 py-2 text-[13px] font-medium text-ink shadow-2xs focus:border-primary focus:bg-white focus:outline-none transition-colors placeholder:text-slate-soft/70"
            />
          </div>

          {/* Project Address Input */}
          <div className="space-y-1.5">
            <label className="block font-mono text-[10.5px] font-bold uppercase tracking-wider text-slate">
              Project Address
            </label>
            <input
              type="text"
              value={addressQuery}
              onChange={(e) => setAddressQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleApply()}
              placeholder="Enter project address"
              className="w-full rounded-xl border border-paper-line bg-paper px-3 py-2 text-[13px] font-medium text-ink shadow-2xs focus:border-primary focus:bg-white focus:outline-none transition-colors placeholder:text-slate-soft/70"
            />
          </div>
        </div>

        {/* Action Buttons: Apply & Reset */}
        <div className="mt-4 flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleApply}
            className="px-6 py-2 font-bold shadow-xs text-[13px]"
          >
            Apply
          </Button>

          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={handleReset}
            className="px-6 py-2 bg-white font-medium text-ink shadow-xs text-[13px]"
          >
            Reset
          </Button>
        </div>
      </Card>

      {/* Data Table Card */}
      <Card padded={false} className="overflow-hidden shadow-[0_4px_24px_rgba(23,19,15,0.035)] border-paper-line bg-paper-raised">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-paper-line bg-paper/60 text-[10.5px] font-mono font-bold uppercase tracking-wider text-slate">
                <th className="py-3.5 px-5">Permit #</th>
                <th className="py-3.5 px-5">Project Address</th>
                <th className="py-3.5 px-5">City</th>
                <th className="py-3.5 px-5">Private Provider</th>
                <th className="py-3.5 px-5">Contractor</th>
                <th className="py-3.5 px-5">Date Saved</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-paper-line text-[13px]">
              {!loaded ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate">
                    Loading records...
                  </td>
                </tr>
              ) : paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center">
                    <div className="max-w-sm mx-auto space-y-2">
                      <FileCheck2 size={32} className="mx-auto text-slate-soft" />
                      <p className="text-[15px] font-bold text-ink">No matching records found</p>
                      <p className="text-[12.5px] text-slate">
                        Try adjusting your search criteria or resetting filters.
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleReset}
                        className="mt-2 bg-white"
                      >
                        Reset Filters
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="hover:bg-paper/40 transition-colors duration-150"
                  >
                    {/* Permit # */}
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      {record.permitNumber ? (
                        <span className="inline-block rounded-md border border-primary/20 bg-primary-soft px-2.5 py-0.5 font-mono text-[11.5px] font-bold text-primary shadow-2xs">
                          {record.permitNumber}
                        </span>
                      ) : (
                        <span className="italic text-slate-soft text-[12px]">
                          No Permit #
                        </span>
                      )}
                    </td>

                    {/* Project Address */}
                    <td className="py-3.5 px-5">
                      {record.projectAddress ? (
                        <strong className="font-bold text-ink text-[13px]">
                          {record.projectAddress}
                        </strong>
                      ) : (
                        <span className="italic text-slate-soft text-[12.5px]">
                          No address
                        </span>
                      )}
                    </td>

                    {/* City */}
                    <td className="py-3.5 px-5 text-slate font-medium">
                      {record.city}
                    </td>

                    {/* Private Provider */}
                    <td className="py-3.5 px-5">
                      {record.privateProvider ? (
                        <span className="font-medium text-ink text-[13px]">
                          {record.privateProvider}
                        </span>
                      ) : (
                        <span className="italic text-slate-soft text-[12.5px]">
                          N/A
                        </span>
                      )}
                    </td>

                    {/* Contractor */}
                    <td className="py-3.5 px-5 text-slate font-medium">
                      {record.contractor}
                    </td>

                    {/* Date Saved */}
                    <td className="py-3.5 px-5 text-slate font-medium whitespace-nowrap">
                      {record.dateSaved}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setViewRecord(record)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-soft transition-colors hover:bg-primary-soft hover:text-primary"
                          title="View certificate"
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() => setEditRecord(record)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-soft transition-colors hover:bg-primary-soft hover:text-primary"
                          title="Edit record"
                        >
                          <Pencil size={14} />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteRecord(record)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-soft transition-colors hover:bg-alert-soft hover:text-alert"
                          title="Delete record"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-paper-line bg-paper/40 px-5 py-3 text-[12px] text-slate">
          <div>
            Showing{" "}
            <strong className="text-ink font-semibold">
              {totalCount === 0 ? 0 : startIndex + 1}
            </strong>{" "}
            to{" "}
            <strong className="text-ink font-semibold">
              {Math.min(startIndex + pageSize, totalCount)}
            </strong>{" "}
            of <strong className="text-ink font-semibold">{totalCount}</strong>{" "}
            records
          </div>

          <div className="flex items-center gap-1">
            {/* First Page */}
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(1)}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-paper-line bg-white text-slate transition-colors hover:bg-paper hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed"
              title="First Page"
            >
              «
            </button>

            {/* Prev Page */}
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-paper-line bg-white text-slate transition-colors hover:bg-paper hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed"
              title="Previous Page"
            >
              ←
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => setCurrentPage(pageNum)}
                className={clsx(
                  "flex h-7 w-7 items-center justify-center rounded-md text-[11.5px] font-bold transition-colors",
                  currentPage === pageNum
                    ? "bg-primary text-white shadow-xs"
                    : "border border-paper-line bg-white text-slate hover:bg-paper hover:text-ink"
                )}
              >
                {pageNum}
              </button>
            ))}

            {/* Next Page */}
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-paper-line bg-white text-slate transition-colors hover:bg-paper hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed"
              title="Next Page"
            >
              →
            </button>

            {/* Last Page */}
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(totalPages)}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-paper-line bg-white text-slate transition-colors hover:bg-paper hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed"
              title="Last Page"
            >
              »
            </button>
          </div>
        </div>
      </Card>

      {/* View Modal */}
      <ViewPcaRecordModal
        record={viewRecord}
        onClose={() => setViewRecord(null)}
        onEdit={(rec) => {
          setViewRecord(null);
          setEditRecord(rec);
        }}
      />

      {/* Edit Modal */}
      <EditPcaRecordModal
        record={editRecord}
        isOpen={!!editRecord}
        onClose={() => setEditRecord(null)}
        onSave={handleSaveEdit}
      />

      {/* Delete Modal */}
      <DeletePcaRecordModal
        record={deleteRecord}
        isOpen={!!deleteRecord}
        onClose={() => setDeleteRecord(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
