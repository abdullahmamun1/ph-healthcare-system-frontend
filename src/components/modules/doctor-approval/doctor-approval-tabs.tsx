"use client";

import { type ChangeEvent, Suspense, useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useDebounce from "@/hooks/debounce.hook";
import type { DoctorParams, DoctorVerificationStatus } from "@/types";
import DoctorApprovalTable from "./doctor-approval-table";
import DoctorApprovalTableLoading from "./doctor-approval-table-loading";
import DoctorReviewSheet from "./doctor-review-sheet";

const verificationStatus: ["ALL" | DoctorVerificationStatus, string][] = [
  ["APPROVED", "Approved"],
  ["PENDING", "Pending"],
  ["REJECTED", "Rejected"],
  ["ALL", "All"],
];

export default function DoctorApprovalTabs() {
  const [tab, setTab] = useState<"ALL" | DoctorVerificationStatus>("ALL");
  const [selectedId, setSelectedId] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(searchInput);

  const handleSearch = (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setPage(1);
  };

  const queryParams: DoctorParams = {
    page,
    limit: 10,
    ...(tab === "ALL" ? {} : { verificationStatus: tab }),
    ...(debouncedSearch ? { searchTerm: debouncedSearch } : {}),
  };

  return (
    <>
      <div className="flex justify-between my-5">
        <div>
          <Input
            onChange={(e) => handleSearch(e)}
            type="search"
            placeholder="Search by name or email"
          />
        </div>
        <Tabs value={tab} onValueChange={(value) => setTab(value)}>
          <TabsList>
            {verificationStatus.map(([value, label]) => (
              <TabsTrigger key={value} value={value}>
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <Suspense fallback={<DoctorApprovalTableLoading />}>
        <DoctorApprovalTable
          {...queryParams}
          handleReview={setSelectedId}
          handlePageChange={setPage}
        />
      </Suspense>

      <DoctorReviewSheet
        selectedId={selectedId}
        onClose={() => setSelectedId("")}
        {...queryParams}
      />
    </>
  );
}
