import React from "react";
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

const ProfessionalTemplate = ({ data, accentColor }) => {
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
      <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700 leading-relaxed">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    );
  };

  const shortenUrl = (url) => (url ? url.replace(/^https?:\/\/(www\.)?/, "") : "");

  const summary = data?.professionalSummary || data?.professional_summary;

  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-800 p-10 font-sans">
      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
          {data.personal_info?.full_name || "Your Name"}
        </h1>
        <p
          className="text-base font-semibold mb-6 uppercase tracking-wider"
          style={{ color: accentColor }}
        >
          {data?.personal_info?.profession || "Profession"}
        </p>

        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-gray-600">
          {data.personal_info?.phone && (
            <div className="flex items-center gap-1.5">
              <Phone size={14} className="text-gray-400 flex-shrink-0" />
              <span>{data.personal_info.phone}</span>
            </div>
          )}
          {data.personal_info?.email && (
            <div className="flex items-center gap-1.5">
              <Mail size={14} className="text-gray-400 flex-shrink-0" />
              <span>{data.personal_info.email}</span>
            </div>
          )}
          {data.personal_info?.location && (
            <div className="flex items-center gap-1.5">
              <MapPin size={14} className="text-gray-400 flex-shrink-0" />
              <span>{data.personal_info.location}</span>
            </div>
          )}
          {data.personal_info?.linkedin && (
            <div className="flex items-center gap-1.5 min-w-0">
              <Linkedin size={14} className="text-gray-400 flex-shrink-0" />
              <a
                href={data.personal_info.linkedin}
                target="_blank"
                rel="noreferrer"
                className="hover:text-gray-800 underline decoration-gray-300 underline-offset-2 break-all"
              >
                {shortenUrl(data.personal_info.linkedin)}
              </a>
            </div>
          )}
          {data.personal_info?.website && (
            <div className="flex items-center gap-1.5 min-w-0">
              <Globe size={14} className="text-gray-400 flex-shrink-0" />
              <a
                href={data.personal_info.website}
                target="_blank"
                rel="noreferrer"
                className="hover:text-gray-800 underline decoration-gray-300 underline-offset-2 break-all"
              >
                {shortenUrl(data.personal_info.website)}
              </a>
            </div>
          )}
        </div>
      </header>

      <div className="space-y-8">
        {/* Professional Summary */}
        {summary && (
          <section>
            <h2
              className="text-sm font-bold uppercase tracking-widest mb-3 text-gray-900 border-b-2 pb-1"
              style={{ borderColor: accentColor }}
            >
              Professional Summary
            </h2>
            <div className="text-sm text-gray-700 leading-relaxed">
              {renderDescription(summary)}
            </div>
          </section>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <section>
            <h2
              className="text-sm font-bold uppercase tracking-widest mb-4 text-gray-900 border-b-2 pb-1"
              style={{ borderColor: accentColor }}
            >
              Work Experience
            </h2>
            <div className="space-y-5">
              {data.experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex flex-wrap justify-between items-baseline mb-1">
                    <h3 className="font-bold text-gray-900 text-sm">
                      {exp.position}
                    </h3>
                    <span className="text-xs text-gray-500 font-medium">
                      {formatDate(exp.start_date)} —{" "}
                      {exp.is_current ? "Present" : formatDate(exp.end_date)}
                    </span>
                  </div>
                  <p className="text-sm font-semibold mb-2 text-gray-700">
                    {exp.company}
                    {exp.location ? ` | ${exp.location}` : ""}
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
              className="text-sm font-bold uppercase tracking-widest mb-4 text-gray-900 border-b-2 pb-1"
              style={{ borderColor: accentColor }}
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
                    <p className="text-sm text-gray-700">{edu.institute}</p>
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
              className="text-sm font-bold uppercase tracking-widest mb-3 text-gray-900 border-b-2 pb-1"
              style={{ borderColor: accentColor }}
            >
              Skills
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {data.skills.join(" | ")}
            </p>
          </section>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <section>
            <h2
              className="text-sm font-bold uppercase tracking-widest mb-4 text-gray-900 border-b-2 pb-1"
              style={{ borderColor: accentColor }}
            >
              Projects
            </h2>
            <div className="space-y-5">
              {data.projects.map((project, index) => (
                <div key={index}>
                  <div className="flex flex-wrap justify-between items-baseline mb-1">
                    <h3 className="font-bold text-gray-900 text-sm">
                      {project.name}
                    </h3>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-gray-500 hover:text-gray-800 underline"
                      >
                        {shortenUrl(project.link)}
                      </a>
                    )}
                  </div>
                  {project.type && (
                    <p className="text-xs italic mb-2 text-gray-500">
                      {project.type}
                    </p>
                  )}
                  {project.description && renderDescription(project.description)}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProfessionalTemplate;
