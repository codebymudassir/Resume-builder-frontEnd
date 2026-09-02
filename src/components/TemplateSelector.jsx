import { Check, Layout, X } from "lucide-react";
import React from "react";

const TemplateSelector = ({ SelectedTemplate, onChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const templates = [
    {
      id: "classic",
      name: "Classic",
      previewImage:
        "A Clean and traditional resume layout with a focus on readability and structure.",
    },
    {
      id: "modern",
      name: "Modern",
      previewImage:
        "A sleek and contemporary resume design with bold headings and a dynamic layout.",
    },
    {
      id: "minimal",
      name: "Minimal",
      previewImage:
        "A simple and elegant resume style with ample white space and a focus on essential information.",
    },
    {
      id: "minimal-image",
      name: "Minimal Image",
      previewImage:
        "A minimalist resume format that incorporates a profile image for a personal touch.",
    },
    {
      id: "modern-card",
      name: "Modern-Card",
      previewImage: "A Modern Card template ",
    },
    {
      id: "modern-card-template",
      name: "Modern Card Template",
      previewImage: "A professional and stylish card-style resume layout.",
    },
    {
      id: "simple",
      name: "Simple",
      previewImage:
        "A straightforward and clean resume design that emphasizes clarity and organization.",
    },
    {
      id: "executive-pro",
      name: "Executive Pro",
      previewImage:
        "A premium two-column corporate layout with sidebar for maximum impact.",
    },
    {
      id: "professional",
      name: "Professional",
      previewImage:
        "A high-end, modern two-column layout designed for maximum professionalism and clarity.",
    },
    {
      id: "ats-classic",
      name: "ATS Classic",
      previewImage:
        "Single-column, plain-text layout. Highest compatibility with all ATS systems — recommended for corporate/ATS-driven applications.",
    }
  ];

  return (
    <div className="relative inline-block text-left">
      {/* Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex mt-0 items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 
                           hover:border-green-400 hover:bg-green-50 transition-all duration-200 shadow-sm"
      >
        <Layout size={16} className="text-green-600" />
        <span className="max-sm:hidden font-medium">Template</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute z-50 mt-2 w-80 left-0 bg-white border border-gray-200 rounded-xl shadow-2xl 
                               p-3 transition-all duration-300 origin-top-right animate-in fade-in slide-in-from-top-2"
        >
           <div className=" flex items-center text-center justify-between">
             <h3 className="text-gray-800 font-semibold text-sm mb-2 px-2">
                Choose a Template
            </h3>
             <X onClick={()=>setIsOpen(false)} className="h-6 cursor-pointer mb-2 text-gray-700 w-6"/>
           </div>
          <div className="space-y-3 max-h-80  overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => {
                  onChange(template.id);
                  setIsOpen(false);
                }}
                className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 
                                           ${
                                             SelectedTemplate === template.id
                                               ? "border-green-500 bg-green-50 shadow-sm"
                                               : "border-gray-200 hover:border-green-400 hover:bg-gray-50"
                                           }`}
              >
                {/* Selected Checkmark */}
                {SelectedTemplate === template.id && (
                  <div className="absolute top-3 right-3 text-green-600">
                    <Check size={18} />
                  </div>
                )}

                {/* Template Info */}
                <div>
                  <h4 className="text-gray-900 font-semibold text-base mb-1">
                    {template.name}
                  </h4>
                  <p className="text-gray-600 italic text-sm leading-snug">
                    {template.previewImage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;
