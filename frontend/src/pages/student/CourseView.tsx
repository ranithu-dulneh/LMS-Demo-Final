import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, FileText, MessageSquare, Download } from 'lucide-react';
import CustomVideoPlayer from '../../components/video/CustomVideoPlayer';

const CourseView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // Using id in the future
  console.log("Course ID:", id);
  const [activeTab, setActiveTab] = useState<'materials' | 'discussion'>('materials');

  // Mock data for the specific course/lesson
  const courseData = {
    title: 'Unit 05 - Partnership Accounts',
    description: 'In this lesson, we will cover the fundamentals of partnership accounts, including profit sharing ratios, goodwill adjustments, and revaluation accounts.',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Using a placeholder YT link
    materials: [
      { id: 1, title: 'Unit 05 Lecture Slides', type: 'PDF', size: '2.4 MB' },
      { id: 2, title: 'Past Paper Questions (2015-2022)', type: 'PDF', size: '5.1 MB' },
      { id: 3, title: 'Tutorial 05', type: 'PDF', size: '1.2 MB' }
    ],
    discussions: [
      { id: 1, user: 'Kasun', text: 'Madam, how do we calculate the new profit sharing ratio if a partner retires?', time: '2 hours ago' },
      { id: 2, user: 'Admin (Teacher)', text: 'Hi Kasun, the new ratio is usually given. If not, the remaining partners share the retiring partner\'s portion in their existing ratio unless stated otherwise.', time: '1 hour ago', isTeacher: true }
    ]
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Navigation & Header */}
      <div>
        <Link to="/student/dashboard" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 mb-4 transition-colors">
          <ChevronLeft size={16} className="mr-1" /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">{courseData.title}</h1>
      </div>

      {/* Video Player Section */}
      <div className="shadow-xl rounded-2xl bg-black">
        <CustomVideoPlayer url={courseData.videoUrl} />
      </div>

      {/* Course Info & Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
           <p className="text-gray-700 leading-relaxed">{courseData.description}</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6">
          <button
            onClick={() => setActiveTab('materials')}
            className={`flex items-center gap-2 py-4 px-2 mr-8 border-b-2 font-medium transition-colors ${activeTab === 'materials' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <FileText size={18} /> Course Materials
          </button>
          <button
            onClick={() => setActiveTab('discussion')}
            className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium transition-colors ${activeTab === 'discussion' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <MessageSquare size={18} /> Q&A Discussion
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 bg-gray-50/50">
          {activeTab === 'materials' && (
            <div className="space-y-4">
              {courseData.materials.map(material => (
                <div key={material.id} className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between hover:border-blue-300 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-50 p-2 rounded-lg text-red-500">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{material.title}</h4>
                      <p className="text-xs text-gray-500">{material.type} • {material.size}</p>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium">
                    <Download size={18} /> Download
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'discussion' && (
            <div className="space-y-6">
              {/* Add Comment */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold flex-shrink-0">
                  S
                </div>
                <div className="flex-1">
                  <textarea
                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    rows={3}
                    placeholder="Ask a question about this lesson..."
                  ></textarea>
                  <div className="mt-2 flex justify-end">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                      Post Question
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 my-6"></div>

              {/* Comments List */}
              <div className="space-y-6">
                {courseData.discussions.map(comment => (
                  <div key={comment.id} className="flex gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${comment.isTeacher ? 'bg-purple-100 text-purple-700' : 'bg-gray-200 text-gray-700'}`}>
                      {comment.user.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 mb-1">
                        <h5 className="font-bold text-gray-900">{comment.user}</h5>
                        {comment.isTeacher && <span className="bg-purple-100 text-purple-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">Teacher</span>}
                        <span className="text-xs text-gray-500">{comment.time}</span>
                      </div>
                      <p className="text-gray-700 bg-white p-4 rounded-xl border border-gray-200 inline-block">
                        {comment.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseView;
