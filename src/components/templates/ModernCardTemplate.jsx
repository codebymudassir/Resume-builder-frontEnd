import React, { useMemo, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Globe,
  Briefcase,
  GraduationCap,
  Code,
  User,
  Award,
  ExternalLink,
} from "lucide-react";

const ModernCardTemplate = ({ data, accentColor = "#10b981" }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const [year, month] = String(dateStr).split("-");
      const m = parseInt(month, 10);
      if (!year || Number.isNaN(m)) return dateStr;
      return new Date(Number(year), m - 1).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      });
    } catch {
      return dateStr;
    }
  };

  const renderDescription = (content) => {
    if (!content) return null;
    const items = String(content)
      .split("\n")
      .map((line) => line.replace(/^[•\-\*]\s*/, "").trim())
      .filter((line) => line.length > 0);
    if (items.length === 0) return null;
    return (
      <ul className="space-y-1.5">
        {items.map((item, index) => (
          <li
            key={index}
            className="flex items-start gap-2 text-slate-700 text-sm leading-relaxed"
          >
            <span
              className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: accentColor }}
            ></span>
            <span>{item}</span>
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

  const SectionTitle = ({ title, icon: Icon }) => (
    <div className="flex items-center gap-2 mb-4">
      <div
        className="p-2 rounded-lg"
        style={{ backgroundColor: `${accentColor}15` }}
      >
        <Icon className="w-4 h-4" style={{ color: accentColor }} />
      </div>
      <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
        {title}
      </h2>
    </div>
  );

  const summary = data?.professionalSummary || data?.professional_summary;

  return (
    <div className="w-full bg-slate-50 font-sans antialiased p-4">
      <div className="max-w-[210mm] mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        {/* HEADER - Modern Card Style */}
        <header className="relative">
          <div className="h-2 w-full" style={{ backgroundColor: accentColor }}></div>

          <div className="px-8 py-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">
                  {data.personal_info?.full_name || "Your Name"}
                </h1>
                <p
                  className="text-base font-semibold mb-4"
                  style={{ color: accentColor }}
                >
                  {data.personal_info?.profession || "Professional Title"}
                </p>

                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {data.personal_info?.email && (
                    <a
                      href={`mailto:${data.personal_info.email}`}
                      className="flex items-center gap-2 text-slate-600 hover:text-slate-900 text-xs min-w-0"
                    >
                      <Mail size={14} className="text-slate-400 flex-shrink-0" />
                      <span className="break-all">{data.personal_info.email}</span>
                    </a>
                  )}
                  {data.personal_info?.phone && (
                    <a
                      href={`tel:${data.personal_info.phone}`}
                      className="flex items-center gap-2 text-slate-600 hover:text-slate-900 text-xs"
                    >
                      <Phone size={14} className="text-slate-400 flex-shrink-0" />
                      <span>{data.personal_info.phone}</span>
                    </a>
                  )}
                  {data.personal_info?.location && (
                    <span className="flex items-center gap-2 text-slate-600 text-xs">
                      <MapPin size={14} className="text-slate-400 flex-shrink-0" />
                      <span>{data.personal_info.location}</span>
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3">
                  {data.personal_info?.linkedin && (
                    <a
                      href={data.personal_info.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-slate-600 hover:text-slate-900 text-xs min-w-0"
                    >
                      <Linkedin size={14} style={{ color: accentColor }} className="flex-shrink-0" />
                      <span className="underline underline-offset-2 break-all">
                        {shortenUrl(data.personal_info.linkedin)}
                      </span>
                    </a>
                  )}
                  {data.personal_info?.website && (
                    <a
                      href={data.personal_info.website}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-slate-600 hover:text-slate-900 text-xs min-w-0"
                    >
                      <Globe size={14} style={{ color: accentColor }} className="flex-shrink-0" />
                      <span className="underline underline-offset-2 break-all">
                        {shortenUrl(data.personal_info.website)}
                      </span>
                    </a>
                  )}
                </div>
              </div>

              <div className="hidden md:block flex-shrink-0">
                <div
                  className="w-24 h-24 rounded-2xl overflow-hidden border-2 shadow-lg"
                  style={{ borderColor: accentColor }}
                >
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                      <User className="w-10 h-10 text-slate-300" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <div className="px-8 pb-8 space-y-8">
          {summary && (
            <section>
              <SectionTitle title="Professional Summary" icon={User} />
              <div
                className="bg-slate-50 rounded-xl p-5 border-l-4"
                style={{ borderLeftColor: accentColor }}
              >
                <div className="text-sm leading-relaxed text-slate-700">
                  {renderDescription(summary)}
                </div>
              </div>
            </section>
          )}

          {data.experience && data.experience.length > 0 && (
            <section>
              <SectionTitle title="Work Experience" icon={Briefcase} />
              <div className="space-y-6">
                {data.experience.map((exp, index) => (
                  <div
                    key={index}
                    className="relative pl-6 border-l-2"
                    style={{ borderLeftColor: `${accentColor}30` }}
                  >
                    <div
                      className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-white border-2"
                      style={{ borderColor: accentColor }}
                    ></div>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">
                          {exp.position}
                        </h3>
                        <p className="text-sm font-semibold" style={{ color: accentColor }}>
                          {exp.company}
                          {exp.location ? ` | ${exp.location}` : ""}
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full whitespace-nowrap self-start">
                        {formatDate(exp.start_date)} —{" "}
                        {exp.is_current ? "Present" : formatDate(exp.end_date)}
                      </span>
                    </div>
                    <div className="text-sm">{renderDescription(exp.description)}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.skills && data.skills.length > 0 && (
            <section>
              <SectionTitle title="Skills & Expertise" icon={Code} />
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 rounded-full text-xs font-semibold border-2"
                    style={{
                      backgroundColor: `${accentColor}10`,
                      borderColor: `${accentColor}30`,
                      color: accentColor,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {data.projects && data.projects.length > 0 && (
            <section>
              <SectionTitle title="Featured Projects" icon={Award} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.projects.map((pro, index) => (
                  <div
                    key={index}
                    className="bg-slate-50 rounded-xl p-4 border border-slate-100 min-w-0"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-slate-900 text-sm break-words min-w-0">
                        {pro.name}
                      </h3>
                      <div className="flex gap-2 flex-shrink-0">
                        {pro.link && (
                          <a
                            href={pro.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-slate-400 hover:text-slate-600"
                          >
                            <ExternalLink size={14} />
                          </a>
                        )}
                        {pro.code_link && (
                          <a
                            href={pro.code_link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-slate-400 hover:text-slate-600"
                          >
                            <Code size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                    {pro.type && (
                      <p className="text-xs font-semibold mb-2" style={{ color: accentColor }}>
                        {pro.type}
                      </p>
                    )}
                    {pro.link && (
                      <a
                        href={pro.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs block mb-2 break-all hover:underline"
                        style={{ color: accentColor }}
                      >
                        {shortenUrl(pro.link)}
                      </a>
                    )}
                    <div className="text-xs">{renderDescription(pro.description)}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.education && data.education.length > 0 && (
            <section>
              <SectionTitle title="Education" icon={GraduationCap} />
              <div className="space-y-4">
                {data.education.map((edu, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 bg-slate-50 rounded-xl p-4 border border-slate-100"
                  >
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {edu.degree}
                        {edu.field ? ` in ${edu.field}` : ""}
                      </h3>
                      <p className="text-sm text-slate-600">{edu.institute}</p>
                      {(edu.gpa || edu.marks) && (
                        <div className="flex flex-wrap gap-2 mt-1">
                          {edu.gpa && (
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white border border-slate-200">
                              GPA: {edu.gpa}
                            </span>
                          )}
                          {edu.marks && (
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white border border-slate-200">
                              Marks: {edu.marks}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 whitespace-nowrap self-start">
                      {formatDate(edu.graduation_date)}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <footer className="px-8 py-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400">
            Generated with Resume Builder
          </p>
        </footer>
      </div>
    </div>
  );
};

export default ModernCardTemplate;

// Backwards-compat alias: the file was previously named with a typo
// (ModerCardTemplate). Some imports may still reference the old name.
export { ModernCardTemplate as ModerCardTemplate };
