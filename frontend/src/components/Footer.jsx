export default function Footer() {
  return (
    <footer className="bg-dark-200 text-gray-300 py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">🔬 Venture Autopsy</h3>
            <p className="text-sm">
              AI-powered startup failure intelligence for strategic decision-making.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/startups" className="hover:text-white transition-colors">Startups</a></li>
              <li><a href="/users" className="hover:text-white transition-colors">Users</a></li>
              <li><a href="/analytics" className="hover:text-white transition-colors">Analytics</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="https://fastapi.tiangolo.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">FastAPI Docs</a></li>
              <li><a href="https://react.dev" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">React Docs</a></li>
              <li><a href="https://tailwindcss.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Tailwind CSS</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a></li>
              <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Twitter</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Venture Autopsy. Built with ❤️ using FastAPI & React.</p>
        </div>
      </div>
    </footer>
  )
}