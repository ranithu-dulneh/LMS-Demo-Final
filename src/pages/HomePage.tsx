import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock, Video } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full text-center py-20 px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Master A/L Accounting with <span className="text-blue-600">DM Education</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Sri Lanka's premier platform for interactive learning, video lessons, and comprehensive study materials.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
            Get Started <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="w-full py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
            <Video size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Custom Video Player</h3>
          <p className="text-gray-600">High-quality video lessons with distraction-free custom controls designed for learning.</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6">
            <BookOpen size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Resource Repository</h3>
          <p className="text-gray-600">Access thousands of past papers, tutorials, and structured study packs.</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
            <Clock size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Structured Scheduling</h3>
          <p className="text-gray-600">Stay on top of deadlines and live sessions with our integrated class schedule.</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
