import React from "react";

/**
 * ATS-CLASSIC TEMPLATE
 * ────────────────────────────────────────────────────────────────
 * Highest compatibility ATS resume. Used by Fortune 500, banks,
 * government portals. The format looks plain on purpose:
 *
 *  • SINGLE COLUMN — ATS parsers read top-to-bottom. Two-column
 *    layouts cause field-mixing (e.g. phone gets attached to the
 *    wrong job).
 *  • NO TABLES, NO GRIDS, NO ICONS — these become garbage or get
 *    dropped during PDF parsing.
 *  • PLAIN SYSTEM FONT — Arial / Helvetica renders identically
 *    everywhere, so the file the recruiter sees matches the file
 *    the ATS sees.
 *  • STANDARD HEADINGS — "Professional Summary", "Work Experience",
 *    "Education", "Skills". These are the exact keywords the major
 *    ATS (Workday, Taleo, Greenhouse, Lever) look for.
 *  • NO HEADER / FOOTER REGIONS — content there is routinely
 *    dropped. Everything lives in the body.
 *  • SIMPLE BULLETS (•) — Unicode bullets, no custom markers.
 *  • BLACK-AND-WHITE SAFE — print-friendly and photocopier-friendly.
 */

const ATSClassicTemplate = ({ data, accentColor = "#000000" }) => {
  // Format YYYY-MM → "Jan 2024" (US standard resume date format).
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const parts = String(dateStr).split("-");
    if (parts.length < 2) return dateStr;
    const [year, month] = parts;
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const m = parseInt(month, 10);
    if (Number.isNaN(m)) return year;
    return `${monthNames[m - 1]} ${year}`;
  };

  // Convert newline-separated text into clean bullets. Strip any
  // bullet characters the user might have typed so we don't end
  // up with "• • did the thing".
  const renderDescription = (content) => {
    if (!content) return null;
    const items = String(content)
      .split("\n")
      .map((line) => line.replace(/^[•\-\*]\s*/, "").trim())
      .filter((line) => line.length > 0);
    if (items.length === 0) return null;

    return (
      <ul className="list-disc pl-5 mt-1 space-y-1">
        {items.map((item, index) => (
          <li key={index} className="text-sm leading-relaxed text-gray-800">
            {item}
          </li>
        ))}
      </ul>
    );
  };

  const personal = data?.personal_info || {};
  const fullName = personal.full_name || personal.name || "Your Name";
  const profession = personal.profession || "";
  const summary =
    data?.professionalSummary || data?.professional_summary || "";
  const experience = Array.isArray(data?.experience) ? data.experience : [];
  const education = Array.isArray(data?.education) ? data.education : [];
  const projects = Array.isArray(data?.projects) ? data.projects : [];
  const skills = Array.isArray(data?.skills) ? data.skills : [];
  const certifications = Array.isArray(data?.certifications)
    ? data.certifications
    : [];

  // Build contact row pieces. We use plain text only — no icons, no
  // mailto: links, no fancy separators that can confuse parsers.
  const contactParts = [];
  if (personal.phone) contactParts.push(personal.phone);
  if (personal.email) contactParts.push(personal.email);
  if (personal.location) contactParts.push(personal.location);
  if (personal.linkedin) contactParts.push(personal.linkedin);
  if (personal.website) contactParts.push(personal.website);

  return (
    <div
      className="resume-ats-classic max-w-[8.5in] mx-auto bg-white"
      style={{
        fontFamily:
          "Arial, Helvetica, 'Liberation Sans', sans-serif",
        color: "#111",
        lineHeight: 1.45,
        fontSize: "11pt",
      }}
    >
      {/* ===== HEADER ===== */}
      <div className="px-10 pt-10 pb-3 text-center">
        <h1 className="text-[22pt] font-bold tracking-wide text-black leading-tight">
          {fullName}
        </h1>
        {profession && (
          <p className="text-[11pt] font-semibold mt-1 text-gray-800">
            {profession}
          </p>
        )}
        {contactParts.length > 0 && (
          <p className="text-[10pt] text-gray-700 mt-1.5">
            {contactParts.join(" | ")}
          </p>
        )}
      </div>

      <div className="px-10 pb-10 space-y-4">
        {/* ===== PROFESSIONAL SUMMARY ===== */}
        {summary && (
          <section>
            <h2 className="text-[11pt] font-bold uppercase tracking-wider border-b border-gray-500 pb-0.5 mb-2">
              Professional Summary
            </h2>
            <div className="text-[10.5pt] text-gray-800 leading-relaxed">
              {renderDescription(summary)}
            </div>
          </section>
        )}

        {/* ===== WORK EXPERIENCE ===== */}
        {experience.length > 0 && (
          <section>
            <h2 className="text-[11pt] font-bold uppercase tracking-wider border-b border-gray-500 pb-0.5 mb-2">
              Work Experience
            </h2>
            <div className="space-y-3.5">
              {experience.map((exp, index) => {
                const start = formatDate(exp.start_date);
                const end = exp.is_current
                  ? "Present"
                  : formatDate(exp.end_date);
                const dateRange =
                  start && end ? `${start} - ${end}` : start || end;
                return (
                  <div key={index}>
                    <div className="flex flex-wrap justify-between items-baseline">
                      <h3 className="font-bold text-[11pt] text-black">
                        {exp.position || "Position"}
                        {exp.company ? (
                          <span className="font-normal text-gray-700">
                            {" "}
                            — {exp.company}
                          </span>
                        ) : null}
                      </h3>
                      <span className="text-[10pt] text-gray-700">
                        {dateRange}
                      </span>
                    </div>
                    {exp.location && (
                      <p className="text-[10pt] italic text-gray-600">
                        {exp.location}
                      </p>
                    )}
                    {exp.description && renderDescription(exp.description)}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ===== EDUCATION ===== */}
        {education.length > 0 && (
          <section>
            <h2 className="text-[11pt] font-bold uppercase tracking-wider border-b border-gray-500 pb-0.5 mb-2">
              Education
            </h2>
            <div className="space-y-2.5">
              {education.map((edu, index) => {
                const grad = formatDate(edu.graduation_date);
                return (
                  <div
                    key={index}
                    className="flex flex-wrap justify-between items-baseline"
                  >
                    <div>
                      <h3 className="font-bold text-[11pt] text-black">
                        {edu.degree}
                        {edu.field ? ` in ${edu.field}` : ""}
                      </h3>
                      <p className="text-[10.5pt] text-gray-700">
                        {edu.institute}
                      </p>
                      {edu.gpa && (
                        <p className="text-[10pt] text-gray-600">
                          GPA: {edu.gpa}
                        </p>
                      )}
                    </div>
                    <span className="text-[10pt] text-gray-700">{grad}</span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ===== SKILLS ===== */}
        {skills.length > 0 && (
          <section>
            <h2 className="text-[11pt] font-bold uppercase tracking-wider border-b border-gray-500 pb-0.5 mb-2">
              Skills
            </h2>
            <p className="text-[10.5pt] text-gray-800 leading-relaxed">
              {skills.join(" | ")}
            </p>
          </section>
        )}

        {/* ===== PROJECTS ===== */}
        {projects.length > 0 && (
          <section>
            <h2 className="text-[11pt] font-bold uppercase tracking-wider border-b border-gray-500 pb-0.5 mb-2">
              Projects
            </h2>
            <div className="space-y-2.5">
              {projects.map((project, index) => (
                <div key={index}>
                  <div className="flex flex-wrap justify-between items-baseline">
                    <h3 className="font-bold text-[11pt] text-black">
                      {project.name}
                      {project.technologies ? (
                        <span className="font-normal text-gray-700">
                          {" "}
                          | {project.technologies}
                        </span>
                      ) : null}
                    </h3>
                    {project.link && (
                      <span className="text-[10pt] text-gray-700">
                        {project.link}
                      </span>
                    )}
                  </div>
                  {project.description &&
                    renderDescription(project.description)}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ===== CERTIFICATIONS ===== */}
        {certifications.length > 0 && (
          <section>
            <h2 className="text-[11pt] font-bold uppercase tracking-wider border-b border-gray-500 pb-0.5 mb-2">
              Certifications
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              {certifications.map((cert, index) => (
                <li
                  key={index}
                  className="text-[10.5pt] text-gray-800"
                >
                  <span className="font-semibold">
                    {cert.name || cert.title}
                  </span>
                  {cert.issuer ? ` — ${cert.issuer}` : ""}
                  {cert.date ? ` (${formatDate(cert.date)})` : ""}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
};

export default ATSClassicTemplate;
