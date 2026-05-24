import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import {
  ArrowLeftIcon,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  DownloadIcon,
  EyeIcon,
  EyeOffIcon,
  FileText,
  Folder,
  GraduationCap,
  Info,
  Share,
  Share2Icon,
  Sparkle,
  Sparkles,
  User,
} from "lucide-react";
import PersonalInfo from "../components/PersonalInfo";
import ResumePreview from "../components/ResumePreview";
import TemplateSelector from "../components/TemplateSelector";
import ColorPicker from "../components/ColorPicker";
import ProfessionalSummary from "../components/ProfessionalSummary";
import ExperienceForm from "../components/ExperienceForm";
import EducationForm from "../components/EducationForm";
import ProjectForm from "../components/ProjectForm.jsx";
import Skills from "../components/Skills.jsx";
import ResumeChatbot from "../components/ResumeChatbot.jsx";
import api from "../config/api.js";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";


const ResumeBuilder = () => {
  const { resumeId } = useParams();
  const [loading, setLoading] = useState(true);
  const [resumeData, setResumeData] = useState({
    _id: "",
    title: "",
    professional_summary: "",
    personal_info: {}, // G�� fixed spelling
    experience: [],
    education: [],
    projects: [],
    skills: [],
    tamplates: [],
    accent_color: "#3b82f6",
    public: false,
  });

  const { token } = useSelector((state) => state.auth);
  const loadExistingResume = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await api.get(`/api/resumes/get/${resumeId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data && response.data.resume) {
        const fetchedData = response.data.resume;

        setResumeData({
          ...fetchedData,
          // FIX: Map professional_summary from backend to professionalSummary in state
          professionalSummary: fetchedData.professional_summary || "",
          personal_info: fetchedData.personal_info || {},
          experience: fetchedData.experience || [],
          education: fetchedData.education || [],
          projects: fetchedData.projects || [],
          skills: fetchedData.skills || [],
        });

        document.title = fetchedData.title || "Resume Builder";
      }
    } catch (error) {
      console.error("Error loading resume:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
      }
      toast.error("Failed to fetch resume data");
    } finally {
      setLoading(false);
    }
  };
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);
  const contentRef = useRef();
  const handlePrint = useReactToPrint({
    contentRef,
  });

  const sections = [
    { id: "personal", name: "personal Info", icon: User },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "projects", name: "Projects", icon: Folder },
    { id: "skills", name: "Skills", icon: Sparkles },
  ];
  const activeSection = sections[activeSectionIndex];
  useEffect(() => {

    loadExistingResume();

  }, []);

  const changeResumeVisibility = async () => {
    try {
      const formData = new FormData();
      formData.append("resumeId", resumeId);
      formData.append("resumeData", JSON.stringify({ public: !resumeData.public }));
      const { data } = await api.put('/api/resumes/update', formData, {
        headers: {
          Authorization: token
        }
      })
      setResumeData({ ...resumeData, public: !resumeData.public });
      toast.success(data.message);

    } catch (error) {
      console.error("Error updating resume visibility:", error);
      toast.error("Failed to update resume visibility");
    }
  };

  const ShareResume = () => {
    const frontendURl = window.location.href.split(`/app/`)[0];
    const resumeURL = frontendURl + '/view/' + resumeId;
    if (navigator.share) {
      navigator.share({ url: resumeURL, text: "My Resume" })
    } else {
      alert("Share is not supported on this browser.")
    }
  }

  const DownloadResume = () => {
    handlePrint();
  }
  const saveResume = async () => {
    try {
      let updatedResumeData = structuredClone(resumeData);

      // FIX: Map professionalSummary to professional_summary for backend
      updatedResumeData.professional_summary = resumeData.professionalSummary;
      delete updatedResumeData.professionalSummary; // Remove the camelCase version

      if (typeof resumeData.personal_info.image === 'object') {
        delete updatedResumeData.personal_info.image;
      }

      const formData = new FormData();
      formData.append("resumeId", resumeId);
      formData.append("resumeData", JSON.stringify(updatedResumeData));

      removeBackground && formData.append("removeBackground", "yes");
      typeof resumeData.personal_info.image === 'object' && formData.append("image", resumeData.personal_info.image);

      const { data } = await api.put('/api/resumes/update', formData, {
        headers: { Authorization: token }
      });

      // FIX: After saving, map the response back to local state format
      setResumeData({
        ...data.resume,
        professionalSummary: data.resume.professional_summary || ""
      });

      toast.success(data.message);
    } catch (error) {
      console.error("Error saving resume:", error);
      toast.error("Failed to save resume");
    }
  }
  const handleAiResumeUpdate = async (generatedData) => {
    setResumeData((prev) => ({
      ...prev,
      // Merge Top level fields
      professionalSummary: generatedData.professional_summary || prev.professionalSummary,
      skills: generatedData.skills || prev.skills,

      // Merge Nested Objects carefully
      personal_info: {
        ...prev.personal_info,
        ...generatedData.personal_info,
      },

      // Replace arrays completely or append? (Usually replace for "Generate" action)
      experience: generatedData.experience || [],
      education: generatedData.education || [],
      projects: generatedData.projects || [],

    }));
    // Save immediately after AI update
    // saveResume();
  };




  return (
    <div className="min-h-screen   bg-gray-50 text-gray-900">
      {/* Header / Back Button */}
      <div
        className="sticky top-0 z-10 border-b border-gray-400 shadow-sm px-6 py-3 flex items-center gap-2"
      >
        <Link
          to="/app"
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-green-600 transition"
        >
          <ArrowLeftIcon className="size-4" />
          <span className="hover:text-green-500">
            Back to Dashboard
          </span>

        </Link>

      </div>
      <div className="border border-l-0 border-r-0  flex gap-3 w-full text-black overflow-hidden">
        <div className="animate-move-right w-full md:whitespace-nowrap md:[word-spacing:8px] tracking-wide">
          Please Click On Save Changes button to save your resume changes
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Panel - Form */}
          <div
            className="lg:col-span-5 border  mt-10 border-gray-400 bg-white rounded-2xl shadow p-6 relative"
          >
            <div className="relative mb-6">
              {/* Progress Bar */}
              <hr
                className="absolute top-0 h-1 rounded-full bg-transparent right-0 left-0 border border-gray-200"
              />
              <hr
                className="absolute top-0 left-0 h-1 bg-gradient-to-r from-green-500 to-green-600 border-none transition-all duration-300 rounded-full origin-right"
                style={{
                  width: `${(activeSectionIndex * 100) / (sections.length - 1)
                    }%`, // flips progress direction to start from right
                }}
              />
            </div>

            {/* section naviagtion */}
            <div className="flex justify-between items-center border-b  py-1 mb-6 border-gray-300">
              {/* Template <TemplateSelector></TemplateSelector> */}
              <div className="flex justify-between items-center gap-2">
                <TemplateSelector
                  SelectedTemplate={resumeData.template}
                  onChange={(template) =>
                    setResumeData((prev) => ({ ...prev, template }))
                  }
                />
                <ColorPicker
                  selectedColor={resumeData.accent_color}
                  onChange={(color) =>
                    setResumeData((prev) => ({ ...prev, accent_color: color }))
                  }
                />
              </div>

              <div className="flex items-center justify-end md:gap-1 gap-1 ">
                {activeSectionIndex !== 0 && (
                  <button
                    onClick={() =>
                      setActiveSectionIndex((previousIndex) =>
                        Math.max(previousIndex - 1, 0)
                      )
                    }
                    disabled={activeSectionIndex === 0}
                    className="flex items-center gap-1 md:px-4 px-1 py-2 md:py-2 rounded-lg text-sm font-medium text-gray-700 border border-gray-300 bg-white hover:bg-gray-100 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                )}

                <button
                  onClick={() => {
                    // Save the resume
                    saveResume();

                    // Move to the next section
                    setActiveSectionIndex((previousIndex) =>
                      Math.min(previousIndex + 1, sections.length - 1)
                    );
                  }}
                  className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-white bg-green-500 hover:bg-green-600 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${activeSectionIndex === sections.length - 1 ? "opacity-50" : ""}`}
                  disabled={activeSectionIndex === sections.length - 1}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>

              </div>
            </div>
            {/* form content */}
            <div className="space-y-6 ">
              {activeSection.id === "personal" && (
                <PersonalInfo
                  data={resumeData.personal_info}
                  onchange={(data) =>
                    setResumeData((prev) => ({ ...prev, personal_info: data }))
                  }
                  removeBackground={removeBackground}
                  setRemoveBackground={setRemoveBackground}
                />
              )}
              {activeSection.id == "summary" && (
                <ProfessionalSummary
                  data={resumeData.professionalSummary}
                  onChange={(data) =>
                    setResumeData((prev) => ({
                      ...prev,
                      professionalSummary: data,
                    }))
                  }
                  setResumeData={setResumeData}
                />
              )}
              {activeSection.id == "experience" && (
                <ExperienceForm
                  data={resumeData.experience}
                  onChange={(data) =>
                    setResumeData((prev) => ({
                      ...prev,
                      experience: data,
                    }))
                  }

                />
              )}
              {activeSection.id == "education" && (
                <EducationForm
                  data={resumeData.education}
                  onChange={(data) =>
                    setResumeData((prev) => ({
                      ...prev,
                      education: data,
                    }))
                  }

                />
              )}
              {activeSection.id == "projects" && (
                <ProjectForm
                  data={resumeData.projects}
                  onChange={(data) =>
                    setResumeData((prev) => ({
                      ...prev,
                      projects: data,
                    }))
                  }

                />
              )}
              {activeSection.id == "skills" && (
                <Skills
                  data={resumeData.skills}
                  onChange={(data) =>
                    setResumeData((prev) => ({
                      ...prev,
                      skills: data,
                    }))
                  }

                />
              )}

            </div>
            <button onClick={() => toast.promise(saveResume, { loading: 'Saving...' })} className="bg-gradient-to-br from-green-400 to-green-500 ring-green-700 mt-4 px-6 py-2 rounded-lg text-green ring">Save Changes</button>
            {/* You can add form content here */}
            {/* <p className="text-gray-500 text-sm">Form section will go here...</p> */}
          </div>

          {/* Right Panel - Resume Preview */}
          <div className="lg:col-span-7 max-lg:mt-6">

            <div className="relative md:justify-end mb-3 justify-center flex w-full">
              <div className="flex  md:mr-11 flex-wrap items-center gap-2 sm:gap-3">
                {/* Share Button: Only shows if public */}
                {resumeData.public && (
                  <button onClick={ShareResume} className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-950 shadow-sm transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950">
                    <Share2Icon className="size-4" />
                    <span className="sr-only">Share</span>
                  </button>
                )}

                {/* Visibility Toggle Button */}
                <button
                  onClick={changeResumeVisibility}
                  className={`inline-flex h-9 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 shadow-sm border 
                  ${resumeData.public
                      ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                    }`}
                >
                  {resumeData.public ? <EyeIcon className="size-4" /> : <EyeOffIcon className="size-4" />}
                  <span>{resumeData.public ? "Public" : "Private"}</span>
                </button>

                {/* Primary Download Button */}
                <button onClick={DownloadResume} className="inline-flex h-9 border items-center justify-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-slate-50 shadow transition-colors hover:bg-slate-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 active:scale-95">
                  <DownloadIcon className="size-4" />
                  <span className="hidden sm:inline">Download</span>
                  <span className="sm:hidden">PDF</span>
                </button>
              </div>
            </div>

            <div id="resume-print-area" className="lg:col-span-7 max-lg:mt-6">
              {/* ... visibility and download buttons ... */}

              {/* Wrap ONLY the component you want to print */}
              <div className="resume-content-to-print" ref={contentRef}>
                <ResumePreview
                  data={resumeData}
                  template={resumeData.template}
                  accentColor={resumeData.accent_color}
                  isLoading={loading}
                />
              </div>
            </div>
            <ResumeChatbot onUpdateResume={handleAiResumeUpdate}
              currentResume={resumeData}
            />

            <div className="border border-l-0 border-r-0 flex gap-3 w-full text-black overflow-hidden">
              {/* ... Warning Banner ... */}
            </div>

            {/* ... Main Content Grid ... */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* ... Rest of your existing JSX ... */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;

