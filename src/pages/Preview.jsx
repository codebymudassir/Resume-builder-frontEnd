import React, { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Download, Loader2 } from 'lucide-react';
import ResumePreview from '../components/ResumePreview';
import api from '../config/api';

const Preview = () => {
  const { resumeId } = useParams();
  const [resumeData, setResumeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPreparing, setIsPreparing] = useState(false);

  const contentRef = useRef(null);
  const beforePrintHandlerRef = useRef(null);
  const afterPrintHandlerRef = useRef(null);

  const loadResume = async () => {
    try {
      const { data } = await api.get('/api/resumes/public/' + resumeId);
      setResumeData(data);
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadResume();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Native print events — yeh sab se reliable hain.
  // beforeprint: jab browser print dialog open hone wala ho
  // afterprint:  jab print dialog band ho jaye (ya cancel ho)
  useEffect(() => {
    const handleBeforePrint = () => {
      setIsPreparing(false); // print dialog khul gaya, loading hatao
    };
    const handleAfterPrint = () => {
      setIsPreparing(false);
    };

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);

    beforePrintHandlerRef.current = handleBeforePrint;
    afterPrintHandlerRef.current = handleAfterPrint;

    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, []);

  // Document title update karo
  useEffect(() => {
    if (resumeData?.title) {
      document.title = resumeData.title;
    }
  }, [resumeData]);

  const handleDownloadClick = () => {
    // Step 1: Loading ON
    setIsPreparing(true);

    // Step 2: Chhota sa delay taake user ko loading clearly dikhe (UX feel ke liye)
    setTimeout(() => {
      // Step 3: Native browser print dialog kholo
      // Jab yeh line execute hogi, browser 'beforeprint' event fire karega
      // jis se loading automatically hat jayegi
      window.print();
    }, 800);
  };

  if (isLoading) {
    return (
      <div className='h-screen items-center justify-center flex flex-col gap-4 bg-gray-50'>
        <div className="w-12 h-12 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">Loading your resume...</p>
      </div>
    );
  }

  if (!resumeData) {
    return (
      <div className='h-screen items-center justify-center flex bg-gray-50'>
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
          <p className="text-5xl md:text-6xl font-black italic tracking-tighter text-gray-900 mb-4 drop-shadow-sm">
            Resume not found
          </p>
          <p className="text-gray-500 text-lg mb-8 max-w-md text-center">
            The link might be broken, or the resume has been set to private.
          </p>
          <Link
            to="/"
            className="flex items-center gap-3 px-8 py-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-lg shadow-lg shadow-green-200 transition-all duration-200 active:scale-95 w-full max-w-[280px] justify-center"
          >
            <ArrowLeft className="size-5 stroke-[3px]" />
            Go Back
          </Link>
          <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Full-screen loading overlay — print dialog khulte hi apne aap hat jayega */}
      {isPreparing && (
        <div className="no-print fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-slate-900 rounded-full animate-spin" />
          <p className="mt-5 text-gray-800 font-semibold animate-pulse text-lg">
            Preparing your PDF...
          </p>
          <p className="mt-1 text-gray-500 text-sm">Opening print dialog</p>
        </div>
      )}

      {/* Action bar — print mein hide hota hai */}
      <div className="no-print sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-200">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-green-600 transition"
          >
            <ArrowLeft className="size-4" />
            Back
          </Link>
          <button
            onClick={handleDownloadClick}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium shadow hover:bg-slate-800 transition active:scale-95"
          >
            {isPreparing ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Download className="size-4" />
            )}
            Download PDF
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-3xl py-6 sm:py-10 px-2 sm:px-4">
        <div className="resume-print" ref={contentRef}>
          <ResumePreview
            classes="py-4 bg-white"
            data={resumeData}
            template={resumeData.template}
            accentColor={resumeData.accent_color || "#3B82F6"}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Preview;
