import React from "react";
import {
  Mail,
  Phone,
  Linkedin,
  Briefcase,
  MapPin,
  Globe,
  Users,
  UserSquare,
} from "lucide-react";

function renderBullets(description) {
  const lines = (description || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  if (!lines.length) return null;

  return lines.map((line, i) => {
    const cleaned = line.replace(/^-+\s?/, "");
    return <li key={i}>{cleaned}</li>;
  });
}

export function ResumePreview({ resumeData, templateId = "classic" }) {
  const personal = resumeData?.personal ?? {};
  const experience = resumeData?.experience ?? [];
  const education = resumeData?.education ?? [];
  const skills = resumeData?.skills ?? [];
  const certifications = resumeData?.certifications ?? [];
  const languages = resumeData?.languages ?? [];
  const references = resumeData?.references ?? [];

  const commonPaper =
    "relative w-[210mm] h-[297mm] shadow-2xl transform origin-top-left scale-[.5] sm:scale-55 md:scale-65 lg:scale-80 xl:scale-90 print:scale-100 print:origin-center print:transform-none print:shadow-none";

  const renderContact = (variant = "default") => {
    const base =
      variant === "executive"
        ? "text-white"
        : "text-gray-700";

    const textStrong =
      variant === "executive" ? "text-white/90" : "text-gray-900";

    return (
      <div className={`space-y-3 text-xs ${base}`}>
        {personal.phone ? (
          <p>
            <strong className={textStrong}>Phone</strong>
            <br />
            {personal.phone}
          </p>
        ) : null}
        {personal.email ? (
          <p>
            <strong className={textStrong}>E-mail</strong>
            <br />
            {personal.email}
          </p>
        ) : null}
        {personal.linkedin ? (
          <p>
            <strong className={textStrong}>LinkedIn</strong>
            <br />
            {personal.linkedin}
          </p>
        ) : null}
        {personal.website ? (
          <p>
            <strong className={textStrong}>Website</strong>
            <br />
            {personal.website}
          </p>
        ) : null}
        {personal.location ? (
          <p>
            <strong className={textStrong}>Location</strong>
            <br />
            {personal.location}
          </p>
        ) : null}
      </div>
    );
  };

  const renderEducation = (variant = "default") => {
    const headerBorder =
      variant === "executive" ? "border-white/40" : "border-gray-300";
    const headerText = variant === "executive" ? "text-white" : "text-gray-900";
    const itemText = variant === "executive" ? "text-white/90" : "text-gray-700";

    return (
      <section>
        <h3
          className={`text-sm font-bold uppercase tracking-wider border-b-2 pb-2 mb-3 ${headerBorder} ${headerText}`}
        >
          Education
        </h3>
        <div className="space-y-3">
          {education.map((edu, idx) => (
            <div key={idx} className="text-xs">
              <h4 className={`font-bold text-sm ${itemText}`}>{edu.degree}</h4>
              <p className="font-semibold text-gray-600 dark:text-gray-200 mb-1">
                {edu.school}
              </p>
              {edu.graduationDate ? (
                <p className="text-gray-500">{edu.graduationDate}</p>
              ) : null}
              {edu.gpa ? <p className="text-gray-500">GPA: {edu.gpa}</p> : null}
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderWorkExperience = (variant = "default") => {
    const headerBorder =
      variant === "executive" ? "border-white/40" : "border-gray-300";
    const headerText = variant === "executive" ? "text-white" : "text-gray-800";

    return (
      <section>
        <h3 className={`text-sm font-bold uppercase tracking-wider border-b-2 pb-2 mb-3 ${headerBorder} ${headerText}`}>
          Work Experience
        </h3>
        <div className="space-y-4">
          {experience.map((exp, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-baseline">
                <h4 className={`font-bold text-sm ${variant === "executive" ? "text-white/90" : "text-gray-800"}`}>
                  {exp.title}
                </h4>
                <p className={`text-xs ${variant === "executive" ? "text-white/70" : "text-gray-500"}`}>
                  {exp.startDate} - {exp.endDate}
                </p>
              </div>
              <p
                className={`font-semibold mb-1 text-xs ${
                  variant === "executive" ? "text-white/80" : "text-gray-600"
                }`}
              >
                {exp.company}, {exp.location}
              </p>
              {exp.description ? (
                <ul className={`list-disc list-outside pl-4 space-y-1 text-xs ${variant === "executive" ? "text-white/90" : "text-gray-700"}`}>
                  {renderBullets(exp.description)}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderClassicTemplate = () => (
    <div className={`${commonPaper} bg-white text-gray-900 p-12`}>
      <div className="flex flex-col h-full">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 uppercase">
            {personal.name || "Olivia Wilson"}
          </h1>
          <h2 className="text-lg font-medium text-gray-500 tracking-widest mt-1">
            {personal.title || "Marketing Manager"}
          </h2>
        </header>

        <div className="grid grid-cols-3 gap-10 flex-1">
          <div className="col-span-1 space-y-8">
            {renderContact("default")}
            <div>{renderEducation("default")}</div>

            {skills?.length ? (
              <section>
                <h3 className="text-sm text-gray-900 font-bold uppercase tracking-wider border-b-2 border-gray-300 pb-2 mb-3">
                  Skills
                </h3>
                <div className="space-y-2 text-xs">
                  {skills.map((s, idx) => (
                    <p key={idx}>
                      <span className="font-bold">{s.name}</span>
                      {s.level ? ` - ${s.level}` : ""}
                    </p>
                  ))}
                </div>
              </section>
            ) : null}

            {languages?.length ? (
              <section>
                <h3 className="text-sm text-gray-900 font-bold uppercase tracking-wider border-b-2 border-gray-300 pb-2 mb-3">
                  Languages
                </h3>
                <div className="space-y-2 text-xs">
                  {languages.map((l, idx) => (
                    <p key={idx}>
                      {l.name}
                      {l.level ? ` (${l.level})` : ""}
                    </p>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          <div className="col-span-2 space-y-8">
            {personal.summary ? (
              <section>
                <h3 className="text-sm font-bold uppercase tracking-wider border-b-2 border-gray-300 pb-2 mb-3">
                  Profile Summary
                </h3>
                <p className="text-xs text-gray-700 leading-relaxed">
                  {personal.summary}
                </p>
              </section>
            ) : null}

            {renderWorkExperience("default")}

            {references?.length ? (
              <section>
                <h3 className="text-sm font-bold uppercase tracking-wider border-b-2 border-gray-300 pb-2 mb-3">
                  References
                </h3>
                <div className="space-y-3">
                  {references.map((ref, idx) => (
                    <div key={idx} className="text-xs">
                      <p className="font-bold text-gray-900">{ref.name}</p>
                      {ref.title ? (
                        <p className="text-gray-600">{ref.title}</p>
                      ) : null}
                      {ref.phone ? (
                        <p className="text-gray-500">Phone: {ref.phone}</p>
                      ) : null}
                      {ref.email ? (
                        <p className="text-gray-500">Email: {ref.email}</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSimpleTemplate = () => (
    <div className={`${commonPaper} bg-white text-[#333] p-12`}>
      <header className="mb-6">
        <h1 className="text-4xl font-bold text-gray-900">
          {personal.name || "John Smith"}
        </h1>
        <h2 className="text-lg font-medium text-gray-700">
          {personal.title || "IT Project Manager"}
        </h2>
        <div className="grid grid-cols-2 text-xs mt-3 text-gray-600">
          <div>
            {personal.phone ? (
              <p>
                <strong>Phone</strong> {personal.phone}
              </p>
            ) : null}
            {personal.email ? (
              <p>
                <strong>E-mail</strong> {personal.email}
              </p>
            ) : null}
          </div>
          <div>
            {personal.linkedin ? (
              <p>
                <strong>LinkedIn</strong> {personal.linkedin}
              </p>
            ) : null}
            {personal.website ? (
              <p>
                <strong>Website</strong> {personal.website}
              </p>
            ) : null}
          </div>
        </div>
      </header>

      <p className="text-sm text-gray-700 leading-relaxed mb-6">
        {personal.summary}
      </p>

      <div className="space-y-6 flex-grow">
        {renderWorkExperience("default")}
        {renderEducation("default")}
      </div>
    </div>
  );

  const renderModernTemplate = () => (
    <div className={`${commonPaper} bg-[#fdfaf5] p-0`}>
      <div className="flex h-full">
        <aside className="w-[35%] bg-white p-8 flex flex-col items-center">
          <div className="w-40 h-40 rounded-full overflow-hidden mt-10 border-8 border-[#d6c7b2]">
            <img
              src={personal.photoUrl || "https://placehold.co/192x192.png"}
              alt={personal.name}
              className="w-full h-full object-cover"
              width={192}
              height={192}
            />
          </div>

          <div className="mt-8 space-y-8 w-full text-sm">
            <section className="px-1">
              <h2 className="text-lg font-bold uppercase tracking-wider text-gray-800">
                Contact
              </h2>
              <div className="w-12 h-px bg-gray-300 mt-1 mb-3"></div>
              <div className="space-y-3">
                {personal.phone ? (
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    {personal.phone}
                  </p>
                ) : null}
                {personal.email ? (
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    {personal.email}
                  </p>
                ) : null}
                {(personal.linkedin || personal.website) ? (
                  <p className="flex items-center gap-2">
                    <Linkedin className="w-4 h-4 text-gray-500" />
                    <span>{personal.linkedin || personal.website}</span>
                  </p>
                ) : null}
                {personal.location ? (
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{personal.location}</span>
                  </p>
                ) : null}
              </div>
            </section>

            {skills?.length ? (
              <section className="px-1">
                <h2 className="text-lg font-bold uppercase tracking-wider text-gray-800">
                  Key Skills
                </h2>
                <div className="w-12 h-px bg-gray-300 mt-1 mb-3"></div>
                <ul className="list-disc list-inside space-y-1">
                  {skills.map((s, idx) => (
                    <li key={idx}>{s.name}</li>
                  ))}
                </ul>
              </section>
            ) : null}

            {certifications?.length ? (
              <section className="px-1">
                <h2 className="text-lg font-bold uppercase tracking-wider text-gray-800">
                  Certifications
                </h2>
                <div className="w-12 h-px bg-gray-300 mt-1 mb-3"></div>
                <ul className="list-disc list-inside space-y-1">
                  {certifications.map((c, idx) => (
                    <li key={idx}>
                      {c.name}
                      {c.date ? `, ${c.date}` : ""}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
        </aside>

        <main className="w-[65%] flex flex-col">
          <header className="h-[240px] bg-[#d6c7b2] flex items-center justify-center text-white p-8">
            <div className="text-center">
              <h1 className="text-5xl font-extrabold tracking-wider uppercase">
                {personal.name?.split(" ")[0] || "RACHEL"}
              </h1>
              <h1 className="text-5xl font-extrabold tracking-wider uppercase">
                {personal.name?.split(" ").slice(1).join(" ") || "MATTHEWS"}
              </h1>
              <p className="text-xl tracking-widest mt-2">{personal.title}</p>
            </div>
          </header>

          <div className="p-8 text-gray-700 flex-grow bg-[#fdfaf5]">
            {personal.summary ? (
              <section>
                <h2 className="text-xl font-bold uppercase tracking-wider text-gray-800">
                  About Me
                </h2>
                <div className="w-16 h-px bg-gray-400 mt-2 mb-3"></div>
                <p className="text-sm leading-relaxed">{personal.summary}</p>
              </section>
            ) : null}

            {experience?.length ? (
              <section className="mt-8">
                <h2 className="text-xl font-bold uppercase tracking-wider text-gray-800">
                  Professional Experience
                </h2>
                <div className="w-16 h-px bg-gray-400 mt-2 mb-3"></div>
                <div className="space-y-6">
                  {experience.map((exp, idx) => (
                    <div key={idx} className="text-sm">
                      <h3 className="font-bold text-base">{exp.title}</h3>
                      <p className="font-semibold text-gray-600">
                        {exp.company}, {exp.location} | {exp.startDate} -{" "}
                        {exp.endDate}
                      </p>
                      <ul className="list-disc list-inside text-xs space-y-1 text-gray-600 mt-2">
                        {exp.description ? renderBullets(exp.description) : null}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {education?.length ? (
              <section className="mt-8">
                <h2 className="text-xl font-bold uppercase tracking-wider text-gray-800">
                  Education
                </h2>
                <div className="w-16 h-px bg-gray-400 mt-2 mb-3"></div>
                <div className="space-y-4">
                  {education.map((edu, idx) => (
                    <div key={idx} className="text-sm">
                      <h3 className="font-bold text-base">{edu.degree}</h3>
                      <p className="font-semibold text-gray-600">
                        {edu.school} | {edu.graduationDate}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );

  const renderExecutiveTemplate = () => (
    <div className={`${commonPaper} bg-white`}>
      <div className="flex h-full">
        <aside className="w-[38%] bg-[#0f2c4a] p-8 text-white flex flex-col">
          <div className="mx-auto mt-2">
            <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white">
              <img
                src={personal.photoUrl || "https://placehold.co/160x160.png"}
                alt={personal.name}
                className="w-full h-full object-cover"
                width={160}
                height={160}
              />
            </div>
          </div>

          <div className="mt-8 space-y-8">
            <section>
              <h2 className="text-lg font-semibold uppercase tracking-wider border-b-2 border-white pb-2 mb-4">
                Contact
              </h2>
              <div className="space-y-3 text-sm">
                {personal.phone ? (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4" />
                    <span>{personal.phone}</span>
                  </div>
                ) : null}
                {personal.email ? (
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4" />
                    <span>{personal.email}</span>
                  </div>
                ) : null}
                {personal.location ? (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4" />
                    <span>{personal.location}</span>
                  </div>
                ) : null}
                {personal.website ? (
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4" />
                    <span>{personal.website}</span>
                  </div>
                ) : null}
              </div>
            </section>

            {education?.length ? (
              <section>
                <h2 className="text-lg font-semibold uppercase tracking-wider border-b-2 border-white pb-2 mb-4">
                  Education
                </h2>
                <div className="space-y-4 text-sm">
                  {education.map((edu, idx) => (
                    <div key={idx}>
                      <p className="font-bold">{edu.graduationDate}</p>
                      <p className="font-semibold">
                        {edu.school || "School Name"}
                      </p>
                      <p>{edu.degree || "Degree"}</p>
                      {edu.gpa ? <p>GPA: {edu.gpa}</p> : null}
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {skills?.length ? (
              <section>
                <h2 className="text-lg font-semibold uppercase tracking-wider border-b-2 border-white pb-2 mb-4">
                  Skills
                </h2>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {skills.map((s, idx) => (
                    <li key={idx}>{s.name}</li>
                  ))}
                </ul>
              </section>
            ) : null}

            {languages?.length ? (
              <section>
                <h2 className="text-lg font-semibold uppercase tracking-wider border-b-2 border-white pb-2 mb-4">
                  Languages
                </h2>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {languages.map((l, idx) => (
                    <li key={idx}>
                      {l.name}
                      {l.level ? ` (${l.level})` : ""}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
        </aside>

        <main className="w-[62%] flex flex-col bg-white">
          <header className="p-10">
            <h1 className="text-4xl font-bold text-gray-800 tracking-wide uppercase">
              {personal.name || "Richard Sanchez"}
            </h1>
            <h2 className="text-xl font-light text-gray-600 tracking-wider mt-1">
              {personal.title || "Marketing Manager"}
            </h2>
            <div className="w-20 h-1 bg-[#0f2c4a] mt-2"></div>
          </header>

          <div className="px-10 pb-10 text-gray-700 flex-grow">
            {personal.summary ? (
              <section>
                <h2 className="text-xl font-bold uppercase tracking-wider text-[#0f2c4a]">
                  Profile
                </h2>
                <div className="w-full h-[2px] bg-gray-200 mt-1 mb-3"></div>
                <p className="text-sm leading-relaxed">{personal.summary}</p>
              </section>
            ) : null}

            {experience?.length ? (
              <section className="mt-6">
                <h2 className="text-xl font-bold uppercase tracking-wider text-[#0f2c4a]">
                  Work Experience
                </h2>
                <div className="w-full h-[2px] bg-gray-200 mt-1 mb-3"></div>
                <div className="space-y-5">
                  {experience.map((exp, idx) => (
                    <div key={idx} className="text-sm flex">
                      <div className="w-1/4 text-xs font-semibold text-gray-600">
                        {exp.startDate} - {exp.endDate}
                      </div>
                      <div className="w-3/4">
                        <h3 className="font-bold text-base">
                          {exp.company || "Company Name"}
                        </h3>
                        <p className="font-semibold text-gray-700 mb-1">
                          {exp.title || "Job Title"}
                        </p>
                        {exp.description ? (
                          <ul className="list-disc list-inside text-xs space-y-1 text-gray-600">
                            {renderBullets(exp.description)}
                          </ul>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {references?.length ? (
              <section className="mt-6">
                <h2 className="text-xl font-bold uppercase tracking-wider text-[#0f2c4a]">
                  Reference
                </h2>
                <div className="w-full h-[2px] bg-gray-200 mt-1 mb-3"></div>
                <div className="flex justify-between text-sm">
                  {references.map((ref, idx) => (
                    <div key={idx} className="w-1/2">
                      <h3 className="font-bold">{ref.name}</h3>
                      {ref.title ? (
                        <p className="text-xs text-gray-600">{ref.title}</p>
                      ) : null}
                      {ref.phone ? (
                        <p className="text-xs text-gray-600">Phone: {ref.phone}</p>
                      ) : null}
                      {ref.email ? (
                        <p className="text-xs text-gray-600">
                          Email: {ref.email}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );

  const renderMinimalistTemplate = () => (
    <div className={`${commonPaper} bg-white`}>
      <div className="flex h-full overflow-hidden">
        <aside className="w-[35%] min-w-0 shrink-0 bg-[#e8e5e1] p-8 flex flex-col">
          <div className="mt-8">
            <img
              src={personal.photoUrl || "https://placehold.co/220x220.png"}
              alt={personal.name}
              className="w-full h-auto object-cover"
              width={220}
              height={220}
            />
          </div>

          <div className="mt-8 space-y-4 text-sm text-[#555]">
            {personal.phone ? (
              <p className="flex items-center gap-3">
                <Phone className="w-4 h-4" />
                {personal.phone}
              </p>
            ) : null}
            {personal.email ? (
              <p className="flex items-center gap-3">
                <Mail className="w-4 h-4" />
                {personal.email}
              </p>
            ) : null}
            {personal.website ? (
              <p className="flex items-center gap-3">
                <Globe className="w-4 h-4" />
                {personal.website}
              </p>
            ) : null}
            {personal.location ? (
              <p className="flex items-center gap-3">
                <MapPin className="w-4 h-4" />
                {personal.location}
              </p>
            ) : null}
          </div>

          <div className="mt-10 space-y-6 flex-1">
            {education?.length ? (
              <section>
                <h2 className="text-lg font-bold uppercase text-[#333] pb-2 relative">
                  Education
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-[#d8d1c9]"></span>
                </h2>
                <div className="mt-4 space-y-4">
                  {education.map((edu, idx) => (
                    <div key={idx}>
                      <p className="font-bold text-base text-[#333]">{edu.degree}</p>
                      <p className="font-semibold text-[#555]">{edu.school}</p>
                      <p className="text-xs text-[#777]">{edu.graduationDate}</p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {skills?.length ? (
              <section>
                <h2 className="text-lg font-bold uppercase text-[#333] pb-2 relative">
                  Expertise
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-[#d8d1c9]"></span>
                </h2>
                <div className="mt-4 space-y-2 text-[#555]">
                  {skills.map((s, idx) => (
                    <p key={idx}>{s.name}</p>
                  ))}
                </div>
              </section>
            ) : null}

            {languages?.length ? (
              <section>
                <h2 className="text-lg font-bold uppercase text-[#333] pb-2 relative">
                  Language
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-[#d8d1c9]"></span>
                </h2>
                <div className="mt-4 space-y-2 text-[#555]">
                  {languages.map((l, idx) => (
                    <p key={idx}>{l.name}</p>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </aside>

        <main className="w-[65%] min-w-0 flex-1 p-10 overflow-hidden flex flex-col justify-between print:justify-between">
          <div>
            <header className="mb-6">
              <h1 className="text-5xl font-extrabold tracking-tight text-[#222] uppercase">
                {personal.name || "Olivia Wilson"}
              </h1>
              <h2 className="text-2xl font-light text-gray-500 tracking-wider mt-2">
                {personal.title || "Graphics Designer"}
              </h2>
            </header>

            <section className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <UserSquare className="w-6 h-6 text-gray-600 shrink-0" />
                <h2 className="text-2xl font-bold text-[#333]">Profile</h2>
              </div>
              <p className="text-sm leading-relaxed text-[#555]">
                {personal.summary}
              </p>
            </section>

            <section className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <Briefcase className="w-6 h-6 text-gray-600 shrink-0" />
                <h2 className="text-2xl font-bold text-[#333]">
                  Work Experience
                </h2>
              </div>
              <div className="space-y-4">
                {experience.map((exp, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="text-center w-24 shrink-0 text-xs text-gray-500">
                      <p>{exp.startDate}</p>
                      <p>-</p>
                      <p>{exp.endDate}</p>
                    </div>
                    <div className="border-l-2 border-gray-300 pl-4 min-w-0 flex-1">
                      <h3 className="font-bold text-base text-[#333]">
                        {exp.company}
                      </h3>
                      <p className="font-semibold text-sm text-gray-600 mb-1">
                        {exp.title}
                      </p>
                      {exp.description ? (
                        <ul className="list-disc list-outside pl-4 ml-1 text-xs space-y-1 text-gray-600">
                          {renderBullets(exp.description)}
                        </ul>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {references?.length ? (
            <section>
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-6 h-6 text-gray-600 shrink-0" />
                <h2 className="text-2xl font-bold text-[#333]">References</h2>
              </div>
              <div className="flex justify-between gap-4 text-sm">
                {references.map((ref, idx) => (
                  <div key={idx} className="flex-1 min-w-0">
                    <h3 className="font-bold">{ref.name}</h3>
                    {ref.title ? (
                      <p className="text-xs text-gray-600">{ref.title}</p>
                    ) : null}
                    {ref.phone ? (
                      <p className="text-xs text-gray-600">Phone: {ref.phone}</p>
                    ) : null}
                    {ref.email ? (
                      <p className="text-xs text-gray-600">Email: {ref.email}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </main>
      </div>
    </div>
  );

  const renderCreativeTemplate = () => (
    <div className={`${commonPaper} bg-white`}>
      <div className="flex flex-col h-full p-10">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-800 uppercase">
            {personal.name || "Johnathon Watson"}
          </h1>
          <h2 className="text-lg font-light text-gray-500 tracking-wider mt-1">
            {personal.title || "Sales Executive"}
          </h2>
        </header>

        <div className="grid grid-cols-3 gap-10 text-xs flex-grow">
          <aside className="col-span-1 space-y-6">
            <section>
              <h3 className="font-bold text-sm uppercase tracking-wider text-gray-800 pb-2 border-b-2 border-gray-300">
                Contact
              </h3>
              <div className="mt-3 space-y-2">
                {personal.phone ? (
                  <p>
                    <strong>P:</strong> {personal.phone}
                  </p>
                ) : null}
                {personal.email ? (
                  <p>
                    <strong>E:</strong> {personal.email}
                  </p>
                ) : null}
                {personal.linkedin ? (
                  <p>
                    <strong>L:</strong> {personal.linkedin}
                  </p>
                ) : null}
                {personal.website ? (
                  <p>
                    <strong>W:</strong> {personal.website}
                  </p>
                ) : null}
                {personal.location ? (
                  <p>
                    <strong>Loc:</strong> {personal.location}
                  </p>
                ) : null}
              </div>
            </section>

            <section>
              <h3 className="font-bold text-sm uppercase tracking-wider text-gray-800 pb-2 border-b-2 border-gray-300">
                Education
              </h3>
              <div className="mt-3 space-y-2">
                {education.map((edu, idx) => (
                  <div key={idx}>
                    <p className="font-bold">{edu.degree}</p>
                    <p>{edu.school}</p>
                    <p>{edu.graduationDate}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="font-bold text-sm uppercase tracking-wider text-gray-800 pb-2 border-b-2 border-gray-300">
                Skills
              </h3>
              <ul className="mt-3 space-y-1 list-disc list-inside">
                {skills.map((s, idx) => (
                  <li key={idx}>{s.name}</li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="font-bold text-sm uppercase tracking-wider text-gray-800 pb-2 border-b-2 border-gray-300">
                Interests
              </h3>
              <ul className="mt-3 space-y-1 list-disc list-inside">
                <li>Triathlons</li>
                <li>Reading Sci-fi</li>
                <li>Public Speaking</li>
                <li>Baking</li>
              </ul>
            </section>
          </aside>

          <div className="col-span-2 space-y-6">
            <section>
              <h3 className="font-bold text-sm uppercase tracking-wider text-gray-800 pb-2 border-b-2 border-gray-300">
                Summary
              </h3>
              <p className="mt-3 leading-relaxed">{personal.summary}</p>
            </section>

            {experience?.length ? (
              <section>
                <h3 className="font-bold text-sm uppercase tracking-wider text-gray-800 pb-2 border-b-2 border-gray-300">
                  Professional Experience
                </h3>
                <div className="mt-3 space-y-4">
                  {experience.map((exp, idx) => (
                    <div key={idx}>
                      <h4 className="font-bold text-sm">
                        {exp.title} | {exp.company} | {exp.startDate} -{" "}
                        {exp.endDate}
                      </h4>
                      {exp.description ? (
                        <ul className="mt-1 space-y-1 list-disc list-inside">
                          {renderBullets(exp.description)}
                        </ul>
                      ) : null}
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {languages?.length ? (
              <section>
                <h3 className="font-bold text-sm uppercase tracking-wider text-gray-800 pb-2 border-b-2 border-gray-300">
                  Languages
                </h3>
                <ul className="mt-3 space-y-1 list-disc list-inside">
                  {languages.map((l, idx) => (
                    <li key={idx}>
                      {l.name}
                      {l.level ? ` (${l.level})` : ""}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );

  const renderTemplate = () => {
    switch (templateId) {
      case "simple":
        return renderSimpleTemplate();
      case "modern":
        return renderModernTemplate();
      case "executive":
        return renderExecutiveTemplate();
      case "minimalist":
        return renderMinimalistTemplate();
      case "creative":
        return renderCreativeTemplate();
      case "classic":
      default:
        return renderClassicTemplate();
    }
  };

  return <div className="resume-preview print-fit">{renderTemplate()}</div>;
}

