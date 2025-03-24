export default function BlogLayout({ children }) {
    return (
      <div className="p-6 bg-gray-100">
        <h1 className="text-4xl font-bold text-center mb-6">📝 Mon Blog</h1>
        {children}
      </div>
    );
  }
  