"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  sponsorSchema,
  type SponsorFormData,
} from "../../../lib/validations/sponsorSchema";
import { createSponsor, updateSponsor } from "../../../lib/actions/sponsors";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Sponsor } from "../../../type/definitions";

interface SponsorFormProps {
  sponsor?: Sponsor;
}

export default function SponsorForm({ sponsor }: SponsorFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const isEditMode = !!sponsor;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SponsorFormData>({
    resolver: zodResolver(sponsorSchema) as any,
    defaultValues: {
      name: sponsor?.name || "",
      contact_email: sponsor?.contact_email || "",
      contact_phone: sponsor?.contact_phone || "",
      website_url: sponsor?.website_url || "",
      image_url: sponsor?.image_url || "",
      video_url: sponsor?.video_url || "",
      description: sponsor?.description || "",
    },
  });

  // Update form values when sponsor prop changes
  useEffect(() => {
    if (sponsor) {
      reset({
        name: sponsor.name,
        contact_email: sponsor.contact_email || "",
        contact_phone: sponsor.contact_phone || "",
        website_url: sponsor.website_url || "",
        image_url: sponsor.image_url || "",
        video_url: sponsor.video_url || "",
        description: sponsor.description || "",
      });
    }
  }, [sponsor, reset]);

  const onSubmit = async (data: SponsorFormData) => {
    try {
      setIsSubmitting(true);

      if (isEditMode && sponsor) {
        const { error } = await updateSponsor(sponsor.id, data);

        if (error) {
          toast.error(error);
          return;
        }

        toast.success("Sponsor updated successfully");
        router.push("/dashboard/sponsor");
      } else {
        const { error } = await createSponsor(data);

        if (error) {
          toast.error(error);
          return;
        }

        toast.success("Sponsor created successfully");
        router.push("/dashboard/sponsor");
      }
    } catch (error) {
      toast.error(
        isEditMode ? "Failed to update sponsor" : "Failed to create sponsor"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit) as any} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            {...register("name")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="contact_email"
            className="block text-sm font-medium text-gray-700"
          >
            Contact Email
          </label>
          <input
            type="email"
            id="contact_email"
            {...register("contact_email")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.contact_email && (
            <p className="mt-1 text-sm text-red-600">
              {errors.contact_email.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="contact_phone"
            className="block text-sm font-medium text-gray-700"
          >
            Contact Phone
          </label>
          <input
            type="text"
            id="contact_phone"
            {...register("contact_phone")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.contact_phone && (
            <p className="mt-1 text-sm text-red-600">
              {errors.contact_phone.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="website_url"
            className="block text-sm font-medium text-gray-700"
          >
            Website URL
          </label>
          <input
            type="url"
            id="website_url"
            {...register("website_url")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.website_url && (
            <p className="mt-1 text-sm text-red-600">
              {errors.website_url.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="image_url"
            className="block text-sm font-medium text-gray-700"
          >
            Image URL
          </label>
          <input
            type="url"
            id="image_url"
            {...register("image_url")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.image_url && (
            <p className="mt-1 text-sm text-red-600">
              {errors.image_url.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="video_url"
            className="block text-sm font-medium text-gray-700"
          >
            Video URL
          </label>
          <input
            type="url"
            id="video_url"
            {...register("video_url")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.video_url && (
            <p className="mt-1 text-sm text-red-600">
              {errors.video_url.message}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            {...register("description")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting
            ? isEditMode
              ? "Updating..."
              : "Creating..."
            : isEditMode
            ? "Update Sponsor"
            : "Create Sponsor"}
        </button>
      </div>
    </form>
  );
}
