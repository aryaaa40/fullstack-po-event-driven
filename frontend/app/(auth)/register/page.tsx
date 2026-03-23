import LoginLeftPanel from "../login/_components/LoginLeftPanel";
import RegisterForm from "./_components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <LoginLeftPanel />
      <RegisterForm />
    </div>
  );
}
