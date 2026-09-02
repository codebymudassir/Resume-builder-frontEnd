import React, { useMemo, useEffect } from "react";
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

const MinimalImageTemplate = ({ data, accentColor }) => {
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

  const renderDescription = (content, isSummary = false) => {
    if (!content) return null;
    const items = String(content)
      .split("\n")
      .map((line) => line.replace(/^[•\-\*]\s*/, "").trim())
      .filter((line) => line.length > 0);
    if (items.length === 0) return null;
    return (
      <ul
        className={`list-disc list-inside text-sm text-zinc-700 leading-relaxed space-y-1 ${
          isSummary ? "list-none ml-0" : ""
        }`}
      >
        {items.map((item, index) => (
          <li key={index} className={isSummary ? "mb-1" : ""}>
            {item}
          </li>
        ))}
      </ul>
    );
  };

  const shortenUrl = (url) => (url ? url.replace(/^https?:\/\/(www\.)?/, "") : "");

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

  useEffect(() => {
    return () => {
      if (imageSrc && typeof data?.personal_info?.image !== "string") {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [imageSrc, data?.personal_info?.image]);

  const summary = data?.professionalSummary || data?.professional_summary;

  return (
    <div className="max-w-5xl mx-auto bg-white text-zinc-800 shadow-lg rounded-lg overflow-hidden">
      {/* Professional Header */}
      <div className="relative bg-gradient-to-r from-slate-800 to-slate-900 px-8 py-8">
        <div className="flex items-center gap-6">
          {imageSrc && (
            <div className="flex-shrink-0">
              <img
                src={imageSrc}
                alt="Profile"
                className="w-28 h-28 object-cover rounded-lg border-4 border-white shadow-xl"
                style={{ background: `${accentColor}70` }}
              />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
              {data.personal_info?.full_name || "Your Name"}
            </h1>
            <p className="text-lg text-slate-300 font-medium">
              {data?.personal_info?.profession || "Profession"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4">
        {/* Left Sidebar */}
        <aside className="col-span-1 bg-slate-50 border-r border-slate-200 p-6 space-y-8">
          {/* Contact */}
          <section>
            <h2 className="text-xs font-bold tracking-wider text-slate-500 uppercase mb-4 border-b border-slate-300 pb-2">
              Contact
            </h2>
            <div className="space-y-3 text-sm">
              {data.personal_info?.phone && (
                <div className="flex items-start gap-3">
                  <Phone size={16} className="flex-shrink-0 mt-0.5" style={{ color: accentColor }} />
                  <span className="text-slate-700">{data.personal_info.phone}</span>
                </div>
              )}
              {data.personal_info?.email && (
                <div className="flex items-start gap-3">
                  <Mail size={16} className="flex-shrink-0 mt-0.5" style={{ color: accentColor }} />
                  <span className="text-slate-700 break-all">{data.personal_info.email}</span>
                </div>
              )}
              {data.personal_info?.location && (
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="flex-shrink-0 mt-0.5" style={{ color: accentColor }} />
                  <span className="text-slate-700">{data.personal_info.location}</span>
                </div>
              )}
              {data.personal_info?.linkedin && (
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={data.personal_info.linkedin}
                  className="flex items-start gap-3 hover:opacity-70 transition-opacity min-w-0"
                >
                  <Linkedin size={16} className="flex-shrink-0 mt-0.5" style={{ color: accentColor }} />
                  <span className="text-slate-700 break-all text-xs">
                    {shortenUrl(data.personal_info.linkedin)}
                  </span>
                </a>
              )}
              {data.personal_info?.website && (
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={data.personal_info.website}
                  className="flex items-start gap-3 hover:opacity-70 transition-opacity min-w-0"
                >
                  <Globe size={16} className="flex-shrink-0 mt-0.5" style={{ color: accentColor }} />
                  <span className="text-slate-700 break-all text-xs">
                    {shortenUrl(data.personal_info.website)}
                  </span>
                </a>
              )}
            </div>
          </section>

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <section>
              <h2 className="text-xs font-bold tracking-wider text-slate-500 uppercase mb-4 border-b border-slate-300 pb-2">
                Education
              </h2>
              <div className="space-y-5">
                {data.education.map((edu, index) => (
                  <div key={index} className="space-y-1">
                    <p className="font-bold text-slate-900 text-sm">
                      {edu.degree}
                      {edu.field ? ` in ${edu.field}` : ""}
                    </p>
                    <p className="text-xs text-slate-500">
                      {edu.institute}
                    </p>
                    <p className="text-xs text-slate-400">
                      {formatDate(edu.graduation_date)}
                    </p>
                    {edu.gpa && (
                      <p className="text-xs text-slate-600">
                        GPA: {edu.gpa}
                      </p>
                    )}
                    {edu.marks && (
                      <p className="text-xs text-slate-600">
                        Marks: {edu.marks}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {data.skills && data.skills.length > 0 && (
            <section>
              <h2 className="text-xs font-bold tracking-wider text-slate-500 uppercase mb-4 border-b border-slate-300 pb-2">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-white text-slate-700 text-xs font-semibold rounded-full border border-slate-200 shadow-sm"
                    style={{ borderColor: `${accentColor}40` }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}
        </aside>

        {/* Right Content */}
        <main className="col-span-3 p-8 space-y-8">
          {summary && (
            <section>
              <h2
                className="text-base font-bold uppercase tracking-wider mb-3 pb-2 border-b-2"
                style={{ color: accentColor, borderColor: `${accentColor}30` }}
              >
                Professional Summary
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed">
                {renderDescription(summary, true)}
              </div>
            </section>
          )}

          {data.experience && data.experience.length > 0 && (
            <section>
              <h2
                className="text-base font-bold uppercase tracking-wider mb-4 pb-2 border-b-2"
                style={{ color: accentColor, borderColor: `${accentColor}30` }}
              >
                Work Experience
              </h2>
              <div className="space-y-6">
                {data.experience.map((exp, index) => (
                  <div
                    key={index}
                    className="relative pl-4 border-l-2"
                    style={{ borderColor: `${accentColor}40` }}
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-2">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">
                          {exp.position}
                        </h3>
                        <p className="text-sm font-semibold" style={{ color: accentColor }}>
                          {exp.company}
                          {exp.location ? ` | ${exp.location}` : ""}
                        </p>
                      </div>
                      <span className="text-xs text-slate-500 whitespace-nowrap">
                        {formatDate(exp.start_date)} -{" "}
                        {exp.is_current ? "Present" : formatDate(exp.end_date)}
                      </span>
                    </div>
                    <div className="text-sm text-slate-700">
                      {renderDescription(exp.description)}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.projects && data.projects.length > 0 && (
            <section>
              <h2
                className="text-base font-bold uppercase tracking-wider mb-4 pb-2 border-b-2"
                style={{ color: accentColor, borderColor: `${accentColor}30` }}
              >
                Projects
              </h2>
              <div className="space-y-5">
                {data.projects.map((project, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                      <h3 className="text-sm font-bold text-slate-900">
                        {project.name}
                      </h3>
                      {project.type && (
                        <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600 font-semibold w-fit">
                          {project.type}
                        </span>
                      )}
                    </div>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs inline-flex items-center gap-1 hover:underline break-all"
                        style={{ color: accentColor }}
                      >
                        {shortenUrl(project.link)}
                      </a>
                    )}
                    <div className="text-sm text-slate-700">
                      {renderDescription(project.description)}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default MinimalImageTemplate;
