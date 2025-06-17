declare module '@/app/dashboard/author/[id]/edit/EditAuthorPageClient' {
  interface EditAuthorPageClientProps {
    params: {
      id: string;
    };
  }
  const EditAuthorPageClient: React.FC<EditAuthorPageClientProps>;
  export default EditAuthorPageClient;
} 