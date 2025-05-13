import UserForm from "../../../components/dashboard/users/form/UserForm";

export default function CreateUserPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="bg-white rounded-lg shadow">
        <div className="p-4">
          <UserForm isEditMode={false} />
        </div>
      </div>
    </div>
  );
}
