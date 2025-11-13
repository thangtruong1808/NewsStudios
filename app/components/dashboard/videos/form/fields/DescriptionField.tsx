"use client";

import type { ChangeEvent } from "react";

/* eslint-disable no-unused-vars */
interface DescriptionFieldProps {
  value: string;
  onChange: (value: string) => void;
}
/* eslint-enable no-unused-vars */

// Description: Render textarea for video description entry in dashboard forms.
// Data created: 2024-11-13
// Author: thangtruong
export default function DescriptionField({
  value,
  onChange,
}: DescriptionFieldProps) {
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  return (
    <div>
      <label htmlFor="description" className="block text-sm font-medium">
        Description
      </label>
      <div className="mt-2">
        <textarea
          id="description"
          rows={5}
          value={value}
          onChange={handleChange}
          placeholder="Enter video description"
          className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 px-3 py-2"
        />
      </div>
    </div>
  );
}
