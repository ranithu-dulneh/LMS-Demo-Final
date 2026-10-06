import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Settings, FileText, FastForward, ArrowRight } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center -mt-8">
      {/* Hero Section */}
      <section className="w-full min-h-[600px] bg-gradient-to-br from-[#eef2ff] via-[#f8fafc] to-[#e0efff] relative overflow-hidden flex items-center py-16 px-4 md:px-12 w-screen max-w-none ml-[calc(-50vw+50%)]">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="flex flex-col items-start text-left">
            <div className="inline-block bg-[#fdf5e6] text-gray-800 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-[#f0e6d2]">
              Empowering Future Accountants
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
              The Island's Best<br />
              <span className="text-[#a67c00]">A/L Accounting</span> Class
            </h1>
            <p className="text-lg text-gray-600 mb-10 max-w-xl">
              Join a legacy of excellence. Master accounting principles with our proven methodology and secure your top island rank.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/login" className="bg-black hover:bg-gray-800 text-white px-8 py-3.5 rounded-md font-medium text-base transition-all shadow-md">
                Join the 2026 Batch
              </Link>
              <Link to="/login" className="bg-white hover:bg-gray-50 text-gray-900 px-8 py-3.5 rounded-md font-medium text-base transition-all shadow-sm border border-gray-200">
                LMS Login
              </Link>
            </div>
          </div>

          <div className="relative flex justify-center items-center">
            {/* Decorative Circle Background */}
            <div className="absolute inset-0 bg-white rounded-3xl shadow-xl transform rotate-3 scale-105"></div>
            <div className="relative bg-white p-4 rounded-3xl w-full max-w-md aspect-square shadow-lg flex items-center justify-center overflow-hidden">
               <div className="w-64 h-64 rounded-full border-8 border-[#3b5998] flex items-center justify-center bg-gray-50 overflow-hidden">
                  <div className="text-gray-400 text-center p-4">
                    <p className="text-sm font-medium">Portrait Placeholder</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="w-full max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Our Courses</h2>
            <p className="text-lg text-gray-600">Comprehensive learning paths for every student.</p>
          </div>
          <Link to="#" className="hidden md:flex items-center text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors">
            View Schedule <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Theory Course */}
          <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
            <div className="w-12 h-12 bg-[#f0e6d2] text-[#a67c00] rounded-lg flex items-center justify-center mb-6">
              <BookOpen size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Theory</h3>
            <p className="text-gray-600 mb-8 flex-grow">
              In-depth coverage of the entire syllabus from foundational principles to advanced concepts.
            </p>
            <Link to="#" className="text-xs font-bold text-gray-800 tracking-wider uppercase hover:text-[#a67c00] transition-colors">
              LEARN MORE
            </Link>
          </div>

          {/* Revision Course */}
          <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
            <div className="w-12 h-12 bg-[#f0e6d2] text-[#a67c00] rounded-lg flex items-center justify-center mb-6">
              <Settings size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Revision</h3>
            <p className="text-gray-600 mb-8 flex-grow">
              Targeted review sessions focusing on high-yield topics and exam strategies.
            </p>
            <Link to="#" className="text-xs font-bold text-gray-800 tracking-wider uppercase hover:text-[#a67c00] transition-colors">
              LEARN MORE
            </Link>
          </div>

          {/* Paper Class Course */}
          <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
            <div className="w-12 h-12 bg-[#f0e6d2] text-[#a67c00] rounded-lg flex items-center justify-center mb-6">
              <FileText size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Paper Class</h3>
            <p className="text-gray-600 mb-8 flex-grow">
              Rigorous practice with past papers and model questions under simulated exam conditions.
            </p>
            <Link to="#" className="text-xs font-bold text-gray-800 tracking-wider uppercase hover:text-[#a67c00] transition-colors">
              LEARN MORE
            </Link>
          </div>

          {/* Fast Track Course */}
          <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
            <div className="w-12 h-12 bg-orange-100 text-orange-500 rounded-lg flex items-center justify-center mb-6">
              <FastForward size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Fast Track</h3>
            <p className="text-gray-600 mb-8 flex-grow">
              Intensive crash course designed for final month preparation and rapid revision.
            </p>
            <Link to="#" className="text-xs font-bold text-[#a67c00] tracking-wider uppercase hover:text-yellow-700 transition-colors">
              LEARN MORE
            </Link>
          </div>
        </div>

        <Link to="#" className="md:hidden mt-8 flex items-center justify-center text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors">
            View Schedule <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </section>
    </div>
  );
};

export default HomePage;
