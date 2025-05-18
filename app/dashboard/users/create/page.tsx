import UserForm from "../../../components/dashboard/users/form/UserForm";

export default function CreateUserPage() {
  return (
    <div className="w-full">
      <UserForm isEditMode={false} />
    </div>
  );
}
