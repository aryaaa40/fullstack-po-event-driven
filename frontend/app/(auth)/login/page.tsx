import LoginLeftPanel from "./_components/LoginLeftPanel";
import LoginForm from "./_components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <LoginLeftPanel />
      <LoginForm />
    </div>
  );
}
