import React, { useMemo, useEffect } from "react";
import { Linkedin, Globe, Mail, Phone, MapPin } from "lucide-react";

const MinimalTemplate = ({ data, accentColor }) => {
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

  // Memoize the image src + revoke object URL on unmount to avoid leaks.
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
    <div className="max-w-4xl mx-auto p-10 bg-white text-gray-900 font-sans">
      {/* Header */}
      <header className="mb-10 text-center">
        {imageSrc && (
          <div className="mb-6 flex justify-center">
            <img
              src={imageSrc}
              alt="Profile"
              className="w-32 h-32 object-cover rounded-full"
              style={{ background: `${accentColor}70` }}
            />
          </div>
        )}
        <h1 className="text-4xl font-bold mb-3 tracking-tight text-gray-900">
          {data.personal_info?.full_name || "Your Name"}
        </h1>
        <p className="uppercase mb-4 text-zinc-700 font-semibold text-xs tracking-widest">
          {data?.personal_info?.profession || "Profession"}
        </p>

        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-gray-600">
          {data.personal_info?.email && (
            <span className="flex items-center gap-1.5">
              <Mail className="size-4 text-gray-500" />
              {data.personal_info.email}
            </span>
          )}
          {data.personal_info?.phone && (
            <span className="flex items-center gap-1.5">
              <Phone className="size-4 text-gray-500" />
              {data.personal_info.phone}
            </span>
          )}
          {data.personal_info?.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4 text-gray-500" />
              {data.personal_info.location}
            </span>
          )}
          {data.personal_info?.linkedin && (
            <a
              target="_blank"
              rel="noreferrer"
              href={data.personal_info.linkedin}
              className="flex items-center gap-1.5 hover:text-gray-900 min-w-0"
            >
              <Linkedin className="size-4 text-gray-500 flex-shrink-0" />
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
              className="flex items-center gap-1.5 hover:text-gray-900 min-w-0"
            >
              <Globe className="size-4 text-gray-500 flex-shrink-0" />
              <span className="break-all text-xs">
                {shortenUrl(data.personal_info.website)}
              </span>
            </a>
          )}
        </div>
      </header>

      {/* Professional Summary */}
      {summary && (
        <section className="mb-8">
          <h2
            className="text-sm font-bold uppercase tracking-widest mb-3 border-b pb-1"
            style={{ color: accentColor, borderColor: accentColor }}
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
        <section className="mb-10">
          <h2
            className="text-sm font-bold uppercase tracking-widest mb-5 border-b pb-1"
            style={{ color: accentColor, borderColor: accentColor }}
          >
            Work Experience
          </h2>
          <div className="space-y-6">
            {data.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex flex-wrap justify-between items-baseline mb-1">
                  <h3 className="text-base font-bold text-gray-900">
                    {exp.position}
                  </h3>
                  <span className="text-xs text-gray-500 font-medium">
                    {formatDate(exp.start_date)} -{" "}
                    {exp.is_current ? "Present" : formatDate(exp.end_date)}
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  {exp.company}
                  {exp.location ? ` | ${exp.location}` : ""}
                </p>
                {exp.description && renderDescription(exp.description)}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-10">
          <h2
            className="text-sm font-bold uppercase tracking-widest mb-5 border-b pb-1"
            style={{ color: accentColor, borderColor: accentColor }}
          >
            Projects
          </h2>
          <div className="space-y-5">
            {data.projects.map((proj, index) => (
              <div key={index}>
                <div className="flex flex-wrap justify-between items-baseline mb-1">
                  <h3 className="text-base font-bold text-gray-900">
                    {proj.name}
                  </h3>
                  {proj.type && (
                    <span
                      className="text-xs font-semibold"
                      style={{ color: accentColor }}
                    >
                      {proj.type}
                    </span>
                  )}
                </div>
                {proj.link && (
                  <a
                    href={proj.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs hover:underline block mb-1"
                    style={{ color: accentColor }}
                  >
                    {shortenUrl(proj.link)}
                  </a>
                )}
                {proj.description && renderDescription(proj.description)}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <section className="mb-10">
          <h2
            className="text-sm font-bold uppercase tracking-widest mb-5 border-b pb-1"
            style={{ color: accentColor, borderColor: accentColor }}
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
            className="text-sm font-bold uppercase tracking-widest mb-3 border-b pb-1"
            style={{ color: accentColor, borderColor: accentColor }}
          >
            Skills
          </h2>
          <p className="text-sm text-gray-700">
            {data.skills.join(" | ")}
          </p>
        </section>
      )}
    </div>
  );
};

export default MinimalTemplate;
