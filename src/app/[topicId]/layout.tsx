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
    <div className="flex h-screen overflow-hidden bg-slate-950">
      <Sidebar nav={navTree} />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  )
}
