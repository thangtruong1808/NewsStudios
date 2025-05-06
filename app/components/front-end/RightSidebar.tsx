"use client";

export default function RightSidebar() {
  return (
    <div className="w-64 min-h-screen bg-gradient-to-b from-emerald-900 to-emerald-800 p-6 text-white">
      <div className="space-y-6">
        <h2 className="text-xl font-bold mb-4">Popular Posts</h2>
        <div className="space-y-4">
          <div className="bg-emerald-800/50 rounded-lg p-4 hover:bg-emerald-800 transition-colors duration-300">
            <h3 className="font-semibold mb-2">Latest Technology Trends</h3>
            <p className="text-sm text-emerald-100">
              Explore the newest innovations in tech...
            </p>
          </div>
          <div className="bg-emerald-800/50 rounded-lg p-4 hover:bg-emerald-800 transition-colors duration-300">
            <h3 className="font-semibold mb-2">Business Insights</h3>
            <p className="text-sm text-emerald-100">
              Key strategies for business growth...
            </p>
          </div>
          <div className="bg-emerald-800/50 rounded-lg p-4 hover:bg-emerald-800 transition-colors duration-300">
            <h3 className="font-semibold mb-2">Lifestyle Tips</h3>
            <p className="text-sm text-emerald-100">
              Improve your daily routine...
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-emerald-700">
          <h3 className="text-lg font-semibold mb-3">Newsletter</h3>
          <form className="space-y-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-lg bg-emerald-800/50 border border-emerald-700 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors duration-300"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
