"use client";

import SponsorForm from "../../../components/dashboard/sponsors/SponsorForm";

export default function CreateSponsorPage() {
  return (
    <div className="space-y-4">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">Create New Sponsor</h1>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <SponsorForm />
      </div>
    </div>
  );
}
