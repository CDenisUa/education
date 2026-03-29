// Components
import { Sidebar } from '@/components/layout/Sidebar'
// Data
import { navTree } from '@/data'

export default function TopicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-[100svh] flex-col overflow-hidden bg-slate-950 lg:h-screen lg:flex-row">
      <Sidebar nav={navTree} />
      <main className="flex-1 min-h-0 min-w-0 overflow-hidden">
        {children}
      </main>
    </div>
  )
}
