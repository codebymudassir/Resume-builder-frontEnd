import React, { useMemo } from "react";
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

const ModernTemplate = ({ data, accentColor }) => {
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

  // Strip the protocol & www. prefix from a URL so the value rendered
  // next to the icon is short and ATS-friendly.
  const shortenUrl = (url) => {
    if (!url) return "";
    return url.replace(/^https?:\/\/(www\.)?/, "");
  };

  const summary = data?.professionalSummary || data?.professional_summary;

  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-800">
      {/* Header */}
      <header
        className="p-8 text-white"
        style={{ backgroundColor: accentColor }}
      >
        <h1 className="text-4xl font-bold mb-2 tracking-tight">
          {data.personal_info?.full_name || "Your Name"}
        </h1>
        <p className="uppercase mb-4 text-white/80 font-semibold text-xs tracking-widest">
          {data?.personal_info?.profession || "Profession"}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          {data.personal_info?.email && (
            <div className="flex items-center gap-2">
              <Mail className="size-4 flex-shrink-0" />
              <span className="break-all">{data.personal_info.email}</span>
            </div>
          )}
          {data.personal_info?.phone && (
            <div className="flex items-center gap-2">
              <Phone className="size-4 flex-shrink-0" />
              <span>{data.personal_info.phone}</span>
            </div>
          )}
          {data.personal_info?.location && (
            <div className="flex items-center gap-2">
              <MapPin className="size-4 flex-shrink-0" />
              <span>{data.personal_info.location}</span>
            </div>
          )}
          {data.personal_info?.linkedin && (
            <a
              target="_blank"
              rel="noreferrer"
              href={data.personal_info.linkedin}
              className="flex items-center gap-2 hover:underline min-w-0"
            >
              <Linkedin className="size-4 flex-shrink-0" />
              <span className="break-all text-xs">
                {shortenUrl(data.personal_info.linkedin)}
              </span>
            </a>
          )}
          {data.personal_info?.website && (
            <a
              target="_blank"
              rel="noreferrer"
              href={data.personal_info.website}
              className="flex items-center gap-2 hover:underline min-w-0"
            >
              <Globe className="size-4 flex-shrink-0" />
              <span className="break-all text-xs">
                {shortenUrl(data.personal_info.website)}
              </span>
            </a>
          )}
        </div>
      </header>

      <div className="p-8 space-y-8">
        {/* Professional Summary */}
        {summary && (
          <section>
            <h2
              className="text-xl font-bold mb-3 uppercase tracking-wider"
              style={{ color: accentColor }}
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
              className="text-xl font-bold mb-5 pb-2 border-b-2 uppercase tracking-wider"
              style={{ borderBottomColor: accentColor, color: accentColor }}
            >
              Work Experience
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div key={index} className="relative pl-6 border-l-2 border-gray-200"
                  style={{ borderLeftColor: accentColor }}
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-2">
                    <div>
                      <h3 className="text-base font-bold text-gray-900">
                        {exp.position}
                      </h3>
                      <p
                        className="text-sm font-semibold"
                        style={{ color: accentColor }}
                      >
                        {exp.company}
                        {exp.location ? ` | ${exp.location}` : ""}
                      </p>
                    </div>
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded whitespace-nowrap self-start">
                      {formatDate(exp.start_date)} -{" "}
                      {exp.is_current
                        ? "Present"
                        : formatDate(exp.end_date)}
                    </span>
                  </div>
                  {exp.description && (
                    <div className="mt-2">{renderDescription(exp.description)}</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <section>
            <h2
              className="text-xl font-bold mb-5 pb-2 border-b-2 uppercase tracking-wider"
              style={{ borderBottomColor: accentColor, color: accentColor }}
            >
              Projects
            </h2>
            <div className="space-y-6">
              {data.projects.map((p, index) => (
                <div
                  key={index}
                  className="relative pl-6 border-l-2"
                  style={{ borderLeftColor: accentColor }}
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-2">
                    <div>
                      <h3 className="text-base font-bold text-gray-900">
                        {p.name}
                      </h3>
                      {p.type && (
                        <p
                          className="text-sm font-semibold"
                          style={{ color: accentColor }}
                        >
                          {p.type}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-3 mt-1">
                        {p.link && (
                          <a
                            href={p.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs hover:underline"
                            style={{ color: accentColor }}
                          >
                            {shortenUrl(p.link)}
                          </a>
                        )}
                        {p.code_link && (
                          <a
                            href={p.code_link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-gray-600 hover:underline"
                          >
                            {shortenUrl(p.code_link)}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  {p.description && (
                    <div className="mt-2 text-sm">
                      {renderDescription(p.description)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education + Skills two-column */}
        <div className="grid sm:grid-cols-2 gap-8">
          {data.education && data.education.length > 0 && (
            <section>
              <h2
                className="text-xl font-bold mb-4 pb-2 border-b-2 uppercase tracking-wider"
                style={{ borderBottomColor: accentColor, color: accentColor }}
              >
                Education
              </h2>
              <div className="space-y-4">
                {data.education.map((edu, index) => (
                  <div key={index}>
                    <h3 className="font-bold text-gray-900 text-sm">
                      {edu.degree}
                      {edu.field ? ` in ${edu.field}` : ""}
                    </h3>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: accentColor }}
                    >
                      {edu.institute}
                    </p>
                    <div className="flex flex-wrap justify-between items-center text-xs text-gray-600 mt-1">
                      <span>{formatDate(edu.graduation_date)}</span>
                      {edu.gpa && <span>GPA: {edu.gpa}</span>}
                      {edu.marks && <span>Marks: {edu.marks}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.skills && data.skills.length > 0 && (
            <section>
              <h2
                className="text-xl font-bold mb-4 pb-2 border-b-2 uppercase tracking-wider"
                style={{ borderBottomColor: accentColor, color: accentColor }}
              >
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-xs text-white rounded-full font-medium"
                    style={{ backgroundColor: accentColor }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;
