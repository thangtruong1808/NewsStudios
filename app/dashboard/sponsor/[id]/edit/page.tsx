"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SponsorForm from "../../../../components/dashboard/sponsors/SponsorForm";
import { getSponsorById } from "../../../../lib/actions/sponsors";
import { Sponsor } from "../../../../lib/definition";

export default function EditSponsorPage() {
  const params = useParams();
  const id = Number(params.id);
  const [sponsor, setSponsor] = useState<Sponsor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSponsor = async () => {
      try {
        setLoading(true);
        const { data, error } = await getSponsorById(id);

        if (error) {
          setError(error);
          return;
        }

        if (data) {
          setSponsor(data as Sponsor);
        }
      } catch (err) {
        setError("Failed to fetch sponsor");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSponsor();
    }
  }, [id]);

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <h3 className="text-sm font-medium text-red-800">Error</h3>
        <div className="mt-2 text-sm text-red-700">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!sponsor) {
    return <div className="text-center py-4">Sponsor not found</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">Edit Sponsor: {sponsor.name}</h1>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <SponsorForm sponsor={sponsor} />
      </div>
    </div>
  );
}
