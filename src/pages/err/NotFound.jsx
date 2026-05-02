import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6 text-center">
      <h1 className="text-7xl font-bold text-orange-500 mb-4">404</h1>

      <h2 className="text-2xl md:text-3xl font-semibold mb-3">
        Page Not Found
      </h2>

      <p className="text-gray-400 max-w-md mb-8">
        The page you are looking for does not exist or has been moved.
      </p>

      <Link
        to="/"
        className="px-6 py-3 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;