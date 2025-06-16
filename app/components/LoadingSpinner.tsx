// This component is kept for future use in loading states across the application
export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center w-full h-32">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
