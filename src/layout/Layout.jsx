import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

const Layout = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-[#0f5c4a]/10 blur-3xl" />
        <div className="absolute bottom-20 right-0 h-80 w-80 rounded-full bg-[#d9a520]/15 blur-3xl" />
      </div>

      <Header />
      <main className="pb-8 pt-24">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout
