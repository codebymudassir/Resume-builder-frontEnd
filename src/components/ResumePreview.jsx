import React from 'react';
import ClassicTemplate from './templates/ClassicTemplate.jsx';
import ModernTemplate from './templates/ModernTemplate.jsx';
import MinimallmageTemplate from './templates/MinimalImageTemplate.jsx';
import MinimalTemplate from './templates/MinimalTemplate.jsx';
import ModernCardTemplate from './templates/ModernCardTemplate.jsx';
import SimpleTemplate from './templates/SimpleTemplate.jsx';
import ExecutiveProTemplate from './templates/ExecutiveProTemplate.jsx';
import ProfessionalTemplate from './templates/ProfessionalTemplate.jsx';

const ResumePreview = ({ data, template, accentColor, classes = '', isLoading = false }) => {

  const renderTamplate = () => {
    switch (template) {
      case 'modern':
        return <ModernTemplate data={data} accentColor={accentColor} />;
      case 'minimal':
        return <MinimalTemplate data={data} accentColor={accentColor} />;
      case 'minimal-image':
        return <MinimallmageTemplate data={data} accentColor={accentColor} />;
      case 'modern-card-template':
        return <ModernCardTemplate data={data} accentColor={accentColor} />;
      case 'executive-pro':
        return <ExecutiveProTemplate data={data} accentColor={accentColor} />;
      case 'professional':
        return <ProfessionalTemplate data={data} accentColor={accentColor} />;
      case 'simple':
        return <SimpleTemplate data={data} accentColor={accentColor} />;
      default:
        return <ClassicTemplate data={data} accentColor={accentColor} />;
    }
  };

  const ResumeSkeleton = () => (
    <div className="w-full min-h-[800px] p-8 animate-pulse bg-white">
      <div className="flex items-center gap-4 mb-8 border-b pb-6 border-slate-200">
        <div className="w-20 h-20 rounded-full bg-slate-200"></div>
        <div className="space-y-3 flex-1">
          <div className="h-6 rounded w-1/3 bg-slate-200"></div>
          <div className="h-4 rounded w-1/4 bg-slate-200"></div>
          <div className="flex gap-4 mt-2">
            <div className="h-3 rounded w-20 bg-slate-200"></div>
            <div className="h-3 rounded w-20 bg-slate-200"></div>
          </div>
        </div>
      </div>
      <div className="mb-8 space-y-2">
        <div className="h-4 rounded w-full bg-slate-200"></div>
        <div className="h-4 rounded w-full bg-slate-200"></div>
        <div className="h-4 rounded w-3/4 bg-slate-200"></div>
      </div>
      <div className="mb-8">
        <div className="h-5 rounded w-1/4 mb-4 bg-slate-300"></div>
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <div className="h-4 rounded w-1/3 bg-slate-200"></div>
                <div className="h-4 rounded w-1/6 bg-slate-200"></div>
              </div>
              <div className="h-3 rounded w-full bg-slate-100"></div>
              <div className="h-3 rounded w-5/6 bg-slate-100"></div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="h-5 rounded w-1/3 mb-4 bg-slate-300"></div>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 w-20 rounded bg-slate-100"></div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-5 rounded w-1/3 mb-4 bg-slate-300"></div>
          <div className="space-y-2">
            <div className="h-3 rounded w-full bg-slate-100"></div>
            <div className="h-3 rounded w-full bg-slate-100"></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`w-full rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ${
      'bg-white border border-slate-200/50'
    }`}>
      <div className="w-full">
        <div className={`relative max-w-3xl mx-auto transition-all duration-300 ${
          'bg-white'
        }`}>
          <div className={`transform transition-transform duration-300 hover:scale-[1.01] text-sm sm:text-base leading-relaxed ${
            'text-gray-900'
          }`}>
            {isLoading ? <ResumeSkeleton /> : renderTamplate()}
          </div>

          {!isLoading && (
            <div
              className="absolute bottom-0 left-0 h-[3px] sm:h-1 w-full transition-all duration-300"
              style={{ backgroundColor: accentColor }}
            ></div>
          )}
        </div>
      </div>

      <style>
        {`

        `}
      </style>
    </div>
  );
};

export default ResumePreview;
