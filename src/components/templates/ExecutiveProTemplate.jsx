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

const ExecutiveProTemplate = ({ data, accentColor = "#1e40af" }) => {
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
            className="flex items-start gap-2 text-xs leading-relaxed text-slate-600"
          >
            <span
              className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
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

  const summary = data?.professionalSummary || data?.professional_summary;

  return (
    <div className="w-full bg-slate-100 font-sans antialiased p-2 sm:p-4">
      <div className="max-w-[210mm] mx-auto">
        <div className="flex flex-col md:flex-row shadow-2xl rounded-2xl overflow-hidden bg-white">
          {/* LEFT SIDEBAR */}
          <aside
            className="w-full md:w-64 lg:w-72 flex-shrink-0 p-4 sm:p-6 text-white"
            style={{ backgroundColor: accentColor }}
          >
            {/* Profile: side-by-side on mobile, stacked on md+ */}
            <div className="flex flex-row md:flex-col items-center md:items-stretch gap-4 md:gap-0 mb-4 md:mb-6">
              <div className="flex-shrink-0 md:mb-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 md:mx-auto rounded-2xl overflow-hidden border-4 border-white/20 shadow-xl">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/10 flex items-center justify-center">
                      <User className="w-10 h-10 md:w-14 md:h-14 text-white/40" />
                    </div>
                  )}
                </div>
              </div>

              <div className="text-left md:text-center md:mb-6 min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-bold mb-1 break-words">
                  {data.personal_info?.full_name || "Your Name"}
                </h1>
                <p className="text-xs sm:text-sm text-white/80 font-semibold break-words">
                  {data.personal_info?.profession || "Professional Title"}
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-4 mb-6">
              <div className="border-t border-white/20 pt-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white/60 mb-3">
                  Contact
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-y-2.5 gap-x-3">
                  {data.personal_info?.email && (
                    <a
                      href={`mailto:${data.personal_info.email}`}
                      className="flex items-start gap-2 text-xs text-white/90 hover:text-white min-w-0"
                    >
                      <Mail className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                      <span className="break-all">{data.personal_info.email}</span>
                    </a>
                  )}
                  {data.personal_info?.phone && (
                    <a
                      href={`tel:${data.personal_info.phone}`}
                      className="flex items-center gap-2 text-xs text-white/90 hover:text-white min-w-0"
                    >
                      <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{data.personal_info.phone}</span>
                    </a>
                  )}
                  {data.personal_info?.location && (
                    <span className="flex items-center gap-2 text-xs text-white/90 min-w-0">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{data.personal_info.location}</span>
                    </span>
                  )}
                  {data.personal_info?.linkedin && (
                    <a
                      href={data.personal_info.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-xs text-white/90 hover:text-white min-w-0"
                    >
                      <Linkedin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{shortenUrl(data.personal_info.linkedin)}</span>
                    </a>
                  )}
                  {data.personal_info?.website && (
                    <a
                      href={data.personal_info.website}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-xs text-white/90 hover:text-white min-w-0"
                    >
                      <Globe className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{shortenUrl(data.personal_info.website)}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
              <div className="mb-6">
                <div className="border-t border-white/20 pt-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white/60 mb-3 flex items-center gap-2">
                    <Code className="w-3.5 h-3.5" />
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-1.5 md:hidden">
                    {data.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="text-xs text-white/90 bg-white/10 px-2 py-0.5 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="hidden md:flex flex-col space-y-2">
                    {data.skills.map((skill, index) => (
                      <div key={index} className="flex items-center gap-2 min-w-0">
                        <div className="w-2 h-2 rounded-full bg-white/40 flex-shrink-0"></div>
                        <span className="text-xs text-white/90 break-words">
                          {skill}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
              <div>
                <div className="border-t border-white/20 pt-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white/60 mb-3 flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5" />
                    Education
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-3">
                    {data.education.map((edu, index) => (
                      <div key={index} className="min-w-0">
                        <p className="text-xs font-bold text-white/90 break-words">
                          {edu.degree}
                          {edu.field ? ` in ${edu.field}` : ""}
                        </p>
                        <p className="text-xs text-white/60 break-words">
                          {edu.institute}
                        </p>
                        <p className="text-xs text-white/50 mt-0.5">
                          {formatDate(edu.graduation_date)}
                        </p>
                        {edu.gpa && (
                          <p className="text-xs text-white/50">GPA: {edu.gpa}</p>
                        )}
                        {edu.marks && (
                          <p className="text-xs text-white/50">Marks: {edu.marks}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-white/20 hidden md:block">
              <p className="text-xs text-center text-white/40">
                Generated with Resume Builder
              </p>
            </div>
          </aside>

          {/* RIGHT CONTENT */}
          <main className="flex-1 p-4 sm:p-6 bg-white min-w-0">
            {summary && (
              <section className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="p-2 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: `${accentColor}15` }}
                  >
                    <User className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: accentColor }} />
                  </div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-800 uppercase tracking-wider">
                    Professional Summary
                  </h2>
                </div>
                <div
                  className="bg-slate-50 rounded-xl p-3 sm:p-4 border-l-4 ml-8 sm:ml-9"
                  style={{ borderLeftColor: accentColor }}
                >
                  {renderDescription(summary)}
                </div>
              </section>
            )}

            {data.experience && data.experience.length > 0 && (
              <section className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="p-2 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: `${accentColor}15` }}
                  >
                    <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: accentColor }} />
                  </div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-800 uppercase tracking-wider">
                    Work Experience
                  </h2>
                </div>
                <div className="ml-8 sm:ml-9 space-y-4 sm:space-y-5">
                  {data.experience.map((exp, index) => (
                    <div key={index} className="relative">
                      <div
                        className="absolute -left-[22px] top-1.5 w-3 h-3 rounded-full border-2 bg-white"
                        style={{ borderColor: accentColor }}
                      ></div>

                      <div className="bg-slate-50 rounded-xl p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1.5 sm:gap-2 mb-2">
                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-bold text-slate-900 break-words">
                              {exp.position}
                            </h3>
                            <p
                              className="text-xs font-semibold"
                              style={{ color: accentColor }}
                            >
                              {exp.company}
                              {exp.location ? ` | ${exp.location}` : ""}
                            </p>
                          </div>
                          <span className="self-start text-xs font-semibold px-2 py-1 rounded-full bg-white border border-slate-200 text-slate-600 whitespace-nowrap">
                            {formatDate(exp.start_date)} —{" "}
                            {exp.is_current ? "Present" : formatDate(exp.end_date)}
                          </span>
                        </div>
                        {exp.description && (
                          <div className="mt-2 sm:mt-3">
                            {renderDescription(exp.description)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {data.projects && data.projects.length > 0 && (
              <section className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="p-2 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: `${accentColor}15` }}
                  >
                    <Award className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: accentColor }} />
                  </div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-800 uppercase tracking-wider">
                    Featured Projects
                  </h2>
                </div>
                <div className="ml-8 sm:ml-9 grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0">
                  {data.projects.map((pro, index) => (
                    <div
                      key={index}
                      className="bg-slate-50 rounded-xl p-3 sm:p-4 border border-slate-100 min-w-0"
                    >
                      <div className="flex items-start justify-between mb-2 gap-2 min-w-0">
                        <h3 className="text-sm font-bold text-slate-900 min-w-0 break-words flex-1">
                          {pro.name}
                        </h3>
                        <div className="flex gap-1.5 flex-shrink-0">
                          {pro.link && (
                            <a
                              href={pro.link}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-400 hover:text-slate-600"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                          {pro.code_link && (
                            <a
                              href={pro.code_link}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-400 hover:text-slate-600"
                            >
                              <Code className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                      {pro.type && (
                        <p
                          className="text-xs font-semibold mb-2"
                          style={{ color: accentColor }}
                        >
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
                      {pro.description && (
                        <div className="text-xs text-slate-600">
                          {renderDescription(pro.description)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveProTemplate;
