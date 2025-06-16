// This component is kept for future use in error handling across the application
interface ErrorMessageProps {
  error: Error;
}

export function ErrorMessage({ error }: ErrorMessageProps) {
  return (
    <div className="flex items-center justify-center w-full h-32">
      <div className="text-red-500">
        <h3 className="text-lg font-medium">Something went wrong!</h3>
        <p className="text-sm">{error.message}</p>
      </div>
    </div>
  );
}
