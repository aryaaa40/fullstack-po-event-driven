import AuthGuard from "./_components/AuthGuard";
import Sidebar from "./_components/Sidebar";
import TopBar from "./_components/TopBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <TopBar />
          <main
            className="flex-1 overflow-auto p-6"
            style={{ backgroundColor: "#f7f9fb" }}
          >
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
