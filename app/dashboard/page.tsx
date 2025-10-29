import { UserDashboard } from "@/src/components/user-dashboard"

export default async function DashboardPage() {
  return (
    <main className="min-h-screen bg-background">
      <UserDashboard />
    </main>
  )
}
