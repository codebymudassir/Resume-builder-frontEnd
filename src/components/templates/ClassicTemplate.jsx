import React, { useMemo } from "react";
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

const ClassicTemplate = ({ data, accentColor }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month] = String(dateStr).split("-");
    const m = parseInt(month, 10);
    if (!year || Number.isNaN(m)) return dateStr;
    return new Date(Number(year), m - 1).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const renderDescription = (content) => {
    if (!content) return null;
    const items = String(content)
      .split("\n")
      .map((line) => line.replace(/^[•\-\*]\s*/, "").trim())
      .filter((line) => line.length > 0);
    if (items.length === 0) return null;
    return (
      <ul className="list-disc pl-5 space-y-1 text-gray-700 leading-relaxed text-sm">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    );
  };

  // Resolve image once. If it's a string (URL/uploaded path) use as-is;
  // if it's a File object create an object URL but memoize so we don't
  // leak a new URL on every render.
  const imageSrc = useMemo(() => {
    const img = data?.personal_info?.image;
    if (!img) return null;
    if (typeof img === "string") return img;
    try {
      return URL.createObjectURL(img);
    } catch {
      return null;
    }
  }, [data?.personal_info?.image]);

  React.useEffect(() => {
    return () => {
      // Revoke the object URL when component unmounts or image changes
      // to avoid leaking the underlying File.
      if (imageSrc && typeof data?.personal_info?.image !== "string") {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [imageSrc, data?.personal_info?.image]);

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white text-gray-800 shadow-sm border border-gray-200">
      {/* Header Section */}
      <header className="text-center mb-8">
        {imageSrc && (
          <div className="mb-4 flex justify-center">
            <img
              src={imageSrc}
              alt="Profile"
              className="w-24 h-24 object-cover rounded-full border-4"
              style={{ borderColor: accentColor }}
            />
          </div>
        )}
        <h1
          className="text-3xl font-bold mb-1"
          style={{ color: accentColor }}
        >
          {data.personal_info?.full_name || "Your Name"}
        </h1>
        <p className="text-lg italic text-gray-600 mb-4">
          {data?.personal_info?.profession || "Profession"}
        </p>

        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-gray-500 border-t border-b py-3 border-gray-100">
          {data.personal_info?.email && (
            <div className="flex items-center gap-1">
              <Mail className="size-3" /> <span>{data.personal_info.email}</span>
            </div>
          )}
          {data.personal_info?.phone && (
            <div className="flex items-center gap-1">
              <Phone className="size-3" /> <span>{data.personal_info.phone}</span>
            </div>
          )}
          {data.personal_info?.location && (
            <div className="flex items-center gap-1">
              <MapPin className="size-3" /> <span>{data.personal_info.location}</span>
            </div>
          )}
          {data.personal_info?.linkedin && (
            <a
              href={data.personal_info.linkedin}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-gray-800"
            >
              <Linkedin className="size-3" /> <span>LinkedIn</span>
            </a>
          )}
          {data.personal_info?.website && (
            <a
              href={data.personal_info.website}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-gray-800"
            >
              <Globe className="size-3" /> <span>Website</span>
            </a>
          )}
        </div>
      </header>

      <div className="space-y-8">
        {/* Professional Summary */}
        {(data.professionalSummary || data.professional_summary) && (
          <section>
            <h2
              className="text-sm font-bold uppercase tracking-widest border-b-2 pb-1 mb-3"
              style={{ borderColor: accentColor, color: accentColor }}
            >
              Professional Summary
            </h2>
            <div className="text-sm text-gray-700 leading-relaxed">
              {renderDescription(
                data.professionalSummary || data.professional_summary
              )}
            </div>
          </section>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <section>
            <h2
              className="text-sm font-bold uppercase tracking-widest border-b-2 pb-1 mb-3"
              style={{ borderColor: accentColor, color: accentColor }}
            >
              Experience
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div key={index} className="relative">
                  <div className="flex flex-wrap justify-between items-baseline mb-1">
                    <h3 className="font-bold text-gray-900 text-sm">
                      {exp.position}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {formatDate(exp.start_date)} -{" "}
                      {exp.is_current ? "Present" : formatDate(exp.end_date)}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    {exp.company}
                    {exp.location ? `, ${exp.location}` : ""}
                  </p>
                  {exp.description && renderDescription(exp.description)}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <section>
            <h2
              className="text-sm font-bold uppercase tracking-widest border-b-2 pb-1 mb-3"
              style={{ borderColor: accentColor, color: accentColor }}
            >
              Education
            </h2>
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <div
                  key={index}
                  className="flex flex-wrap justify-between items-baseline"
                >
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      {edu.degree}
                      {edu.field ? ` in ${edu.field}` : ""}
                    </h3>
                    <p className="text-sm text-gray-600">{edu.institute}</p>
                    {(edu.gpa || edu.marks) && (
                      <p className="text-xs text-gray-500">
                        {edu.gpa ? `GPA: ${edu.gpa}` : ""}
                        {edu.gpa && edu.marks ? " | " : ""}
                        {edu.marks ? `Marks: ${edu.marks}` : ""}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatDate(edu.graduation_date)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <section>
            <h2
              className="text-sm font-bold uppercase tracking-widest border-b-2 pb-1 mb-3"
              style={{ borderColor: accentColor, color: accentColor }}
            >
              Skills
            </h2>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {data.skills.map((skill, index) => (
                <span key={index} className="text-sm text-gray-700">
                  <span style={{ color: accentColor }} className="mr-1">●</span>{" "}
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <section>
            <h2
              className="text-sm font-bold uppercase tracking-widest border-b-2 pb-1 mb-3"
              style={{ borderColor: accentColor, color: accentColor }}
            >
              Projects
            </h2>
            <div className="space-y-5">
              {data.projects.map((project, index) => (
                <div key={index}>
                  <div className="flex flex-wrap justify-between items-baseline mb-1">
                    <h3 className="font-bold text-gray-800 text-sm">
                      {project.name}
                    </h3>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-gray-500 hover:text-gray-800 underline"
                      >
                        Visit Project
                      </a>
                    )}
                  </div>
                  {project.type && (
                    <p className="text-xs italic mb-2 text-gray-500">
                      {project.type}
                    </p>
                  )}
                  {project.description &&
                    renderDescription(project.description)}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ClassicTemplate;
