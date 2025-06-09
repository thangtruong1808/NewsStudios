import UserForm from "../../../components/dashboard/users/form/UserForm";

export default function CreateUserPage() {
  return (
    <div className="bg-gray-50">
      <UserForm isEditMode={false} />
    </div>
  );
}
