"use client";

interface DescriptionFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export default function DescriptionField({
  value,
  onChange,
}: DescriptionFieldProps) {
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
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter video description"
          className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 px-3 py-2"
        />
      </div>
    </div>
  );
}
