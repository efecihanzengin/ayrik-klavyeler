import Header from './Header'
import Footer from './Footer'

const PageContent = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default PageContent
