import './globals.css';

export const metadata = {
  title: "SmartScore QA - Upload Files",
  description: "Upload call recordings, chat transcripts, or email text files to generate comprehensive QA reports.",
};

function NavBar() {
  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-sm z-10 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <a href="/" className="text-xl font-bold text-gray-800">SmartScore QA</a>
        <nav className="space-x-8 flex">
          <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Home</a>
          <a href="#" className="text-blue-600 font-semibold border-b-2 border-blue-600">Upload</a>
          <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Reports</a>
          <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
        </nav>
      </div>
    </header>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* Changed bg-gray-50 to a subtle gradient to match the PDF */}
      <body className="bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 font-sans antialiased pt-16">
        <NavBar />
        <div className="min-h-screen flex flex-col items-center w-full">
          {children}
        </div>
      </body>
    </html>
  );
}