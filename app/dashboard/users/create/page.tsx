import UserForm from "../../../components/dashboard/users/UserForm";

export default function CreateUserPage() {
  return (
    <div className="space-y-4">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">Create New User</h1>
      </div>
      <UserForm />
    </div>
  );
}
