import {
  User,
  Mail,
  Phone,
  Linkedin,
  Briefcase,
  GraduationCap,
  Star,
  MapPin,
  Award,
  Globe,
  Building,
  Server,
  Languages,
  Users,
  UserSquare,
} from "lucide-react";
import React from "react";

export function ResumePreview({ resumeData, templateId = "classic" }) {
  const {
    personal,
    experience,
    education,
    skills,
    certifications,
    languages,
    references,
  } = resumeData;

  const renderClassicTemplate = () => (
    <div
      className="
      relative w-[210mm] h-[297mm] bg-white text-white p-12 shadow-2xl font-sans
      transform origin-top-left scale-[.45] sm:scale-50 md:scale-60 lg:scale-75
      print:scale-100 print:transform-none
    "
    >
      <div className="flex flex-col h-full">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-white uppercase">
            {personal.name || "Olivia Wilson"}
          </h1>
          <h2 className="text-lg font-medium text-gray-500 tracking-widest mt-1">
            {personal.title || "Marketing Manager"}
          </h2>
        </header>

        <div className="grid grid-cols-3 gap-10">
          <div className="col-span-1 space-y-8">
            <section>
              <h3 className="text-sm text-white font-bold uppercase tracking-wider border-b-2 border-gray-300 pb-2 mb-3">
                Contact
              </h3>
              <div className="space-y-2 text-xs">
                {personal.phone && (
                  <p>
                    <strong>Phone</strong>
                    <br />
                    {personal.phone}
                  </p>
                )}
                {personal.email && (
                  <p>
                    <strong>E-mail</strong>
                    <br />
                    {personal.email}
                  </p>
                )}
                {personal.linkedin && (
                  <p>
                    <strong>LinkedIn</strong>
                    <br />
                    {personal.linkedin}
                  </p>
                )}
                {personal.website && (
                  <p>
                    <strong>Website</strong>
                    <br />
                    {personal.website}
                  </p>
                )}
              </div>
            </section>
            <section>
              <h3 className="text-sm font-bold uppercase tracking-wider border-b-2 border-gray-300 pb-2 mb-3">
                Education
              </h3>
              {education.map((edu, index) => (
                <div key={index} className="text-xs mb-3">
                  <h4 className="font-bold text-sm text-gray-800">
                    {edu.degree}
                  </h4>
                  <p className="font-semibold text-gray-600 mb-1">
                    {edu.school}
                  </p>
                  <p className="text-gray-500">{edu.graduationDate}</p>
                </div>
              ))}
            </section>
          </div>
          <div className="col-span-2 space-y-8">
            <section>
              <h3 className="text-sm font-bold uppercase tracking-wider border-b-2 border-gray-300 pb-2 mb-3">
                Profile Summary
              </h3>
              <p className="text-xs text-gray-700 leading-relaxed">
                {personal.summary}
              </p>
            </section>
            <section>
              <h3 className="text-sm font-bold uppercase tracking-wider border-b-2 border-gray-300 pb-2 mb-3">
                Work Experience
              </h3>
              <div className="space-y-4">
                {experience.map((exp, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-bold text-sm text-gray-800">
                        {exp.title}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {exp.startDate} - {exp.endDate}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-600 mb-1 text-xs">
                      {exp.company}, {exp.location}
                    </p>
                    <ul className="list-disc list-outside pl-4 space-y-1 text-gray-700 text-xs">
                      {exp.description
                        .split("\n")
                        .filter((line) => line.trim() !== "")
                        .map((line, i) => (
                          <li key={i}>{line.replace("- ", "")}</li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSimpleTemplate = () => (
    <div
      className="relative w-[210mm] h-[297mm] bg-white p-12 shadow-2xl 
    transform origin-top-left scale-[.45] sm:scale-50 md:scale-60 lg:scale-75 font-sans
    print:scale-100 print:origin-center print:transform-none 
    print:w-[210mm] print:h-[297mm] print:shadow-none print:text-black"
    >
      <div className="flex flex-col h-full text-sm">
        <header className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900">
            {personal.name || "John Smith"}
          </h1>
          <h2 className="text-lg font-medium text-gray-700">
            {personal.title || "IT Project Manager"}
          </h2>

          <div className="grid grid-cols-2 text-xs mt-3 text-gray-600">
            <div>
              {personal.phone && (
                <p>
                  <strong>Phone</strong> {personal.phone}
                </p>
              )}
              {personal.email && (
                <p>
                  <strong>E-mail</strong> {personal.email}
                </p>
              )}
            </div>
            <div>
              {personal.linkedin && (
                <p>
                  <strong>LinkedIn</strong> {personal.linkedin}
                </p>
              )}
              {personal.website && (
                <p>
                  <strong>Twitter</strong> {personal.website}
                </p>
              )}
            </div>
          </div>
        </header>

        <p className="text-sm text-gray-700 leading-relaxed mb-6">
          {personal.summary}
        </p>

        <div className="flex-grow space-y-6">
          <section>
            <h3 className="text-lg font-bold text-gray-800 border-b-2 border-gray-300 pb-1 mb-3">
              Experience
            </h3>
            <div className="space-y-4">
              {experience.map((exp, index) => (
                <div key={index} className="flex">
                  <div className="w-1/4 text-xs text-gray-600 font-medium pt-1">
                    {exp.startDate} - {exp.endDate}
                  </div>
                  <div className="w-3/4">
                    <h4 className="font-bold text-base text-gray-800">
                      {exp.title}
                    </h4>
                    <p className="font-semibold text-gray-600 mb-1">
                      {exp.company}, {exp.location}
                    </p>
                    <ul className="list-disc list-outside pl-4 space-y-1 text-gray-700 text-xs">
                      {exp.description
                        .split("\n")
                        .filter((line) => line.trim() !== "")
                        .map((line, i) => (
                          <li key={i}>{line.replace("- ", "")}</li>
                        ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-gray-800 border-b-2 border-gray-300 pb-1 mb-3">
              Education
            </h3>
            {education.map((edu, index) => (
              <div key={index} className="flex">
                <div className="w-1/4 text-xs text-gray-600 font-medium pt-1">
                  {edu.graduationDate}
                </div>
                <div className="w-3/4">
                  <h4 className="font-bold text-base text-gray-800">
                    {edu.degree}
                  </h4>
                  <p className="font-semibold text-gray-600 mb-1">
                    {edu.school}
                  </p>
                  {edu.gpa && (
                    <ul className="list-disc list-outside pl-4 space-y-1 text-gray-700 text-xs">
                      {edu.gpa
                        .split("\n")
                        .filter((line) => line.trim() !== "")
                        .map((line, i) => (
                          <li key={i}>{line.replace("- ", "")}</li>
                        ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </section>

          {skills.length > 0 && (
            <section>
              <h3 className="text-lg font-bold text-gray-800 border-b-2 border-gray-300 pb-1 mb-3">
                Skills
              </h3>
              <div className="space-y-2">
                {skills.map((skill, index) => (
                  <div key={index}>
                    <p>
                      <span className="font-bold">{skill.name}</span> -{" "}
                      {skill.level}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );

  const renderModernTemplate = () => (
    <div className="relative w-[210mm] h-[297mm] bg-[#fdfaf5] text-gray-700 shadow-2xl flex 
    transform origin-top-left scale-[.45] sm:scale-50 md:scale-60 lg:scale-75 font-sans
    print:scale-100 print:origin-center print:transform-none 
    print:w-[210mm] print:h-[297mm] print:shadow-none">

      <aside className="w-[35%] bg-white p-8 flex flex-col items-center">
        <div className="w-48 h-48 rounded-full overflow-hidden mt-8 border-8 border-[#d6c7b2]">
          <img
            src={personal.photoUrl || "https://placehold.co/192x192.png"}
            alt={personal.name}
            width={192}
            height={192}
            className="w-full h-full object-cover"
            data-ai-hint="professional headshot"
          />
        </div>

        <div className="mt-8 space-y-8 w-full text-sm">
          <section>
            <h2 className="text-lg font-bold uppercase tracking-wider text-gray-800">
              Contact
            </h2>
            <div className="w-12 h-px bg-gray-300 mt-1 mb-3"></div>
            <div className="space-y-3">
              {personal.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-500" />{" "}
                  <span>{personal.phone}</span>
                </div>
              )}
              {personal.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-500" />{" "}
                  <span>{personal.email}</span>
                </div>
              )}
              {(personal.linkedin || personal.website) && (
                <div className="flex items-center gap-3">
                  <Linkedin className="w-4 h-4 text-gray-500" />{" "}
                  <span>{personal.linkedin || personal.website}</span>
                </div>
              )}
              {personal.location && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-500" />{" "}
                  <span>{personal.location}</span>
                </div>
              )}
            </div>
          </section>

          {skills.length > 0 && (
            <section>
              <h2 className="text-lg font-bold uppercase tracking-wider text-gray-800">
                Key Skills
              </h2>
              <div className="w-12 h-px bg-gray-300 mt-1 mb-3"></div>
              <ul className="list-disc list-inside space-y-1">
                {skills.map((skill, index) => (
                  <li key={index}>{skill.name}</li>
                ))}
              </ul>
            </section>
          )}

          {certifications.length > 0 && (
            <section>
              <h2 className="text-lg font-bold uppercase tracking-wider text-gray-800">
                Certifications
              </h2>
              <div className="w-12 h-px bg-gray-300 mt-1 mb-3"></div>
              <ul className="list-disc list-inside space-y-1">
                {certifications.map((cert, index) => (
                  <li key={index}>
                    {cert.name}, {cert.date}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </aside>

      <main className="w-[65%] flex flex-col">
        <header className="h-[240px] bg-[#d6c7b2] flex items-center justify-center text-white p-8">
          <div className="text-center">
            <h1 className="text-5xl font-extrabold tracking-wider uppercase">
              {personal.name.split(" ")[0] || "RACHEL"}
            </h1>
            <h1 className="text-5xl font-extrabold tracking-wider uppercase">
              {personal.name.split(" ").slice(1).join(" ") || "MATTHEWS"}
            </h1>
            <p className="text-xl tracking-widest mt-2">{personal.title}</p>
          </div>
        </header>

        <div className="p-8 text-gray-700 flex-grow bg-[#fdfaf5]">
          <section>
            <h2 className="text-xl font-bold uppercase tracking-wider text-gray-800">
              About Me
            </h2>
            <div className="w-16 h-px bg-gray-400 mt-2 mb-3"></div>
            <p className="text-sm leading-relaxed">{personal.summary}</p>
          </section>

          {experience.length > 0 && (
            <section className="mt-8">
              <h2 className="text-xl font-bold uppercase tracking-wider text-gray-800">
                Professional Experience
              </h2>
              <div className="w-16 h-px bg-gray-400 mt-2 mb-3"></div>
              <div className="space-y-6">
                {experience.map((exp, index) => (
                  <div key={index} className="text-sm">
                    <h3 className="font-bold text-base">
                      {exp.title || "Server"}
                    </h3>
                    <p className="font-semibold text-gray-600">
                      {exp.company}, {exp.location} | {exp.startDate} -{" "}
                      {exp.endDate}
                    </p>
                    <ul className="list-disc list-inside text-xs space-y-1 text-gray-600 mt-2">
                      {exp.description
                        .split("\n")
                        .filter((line) => line.trim() !== "")
                        .map((line, i) => (
                          <li key={i}>{line}</li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {education.length > 0 && (
            <section className="mt-8">
              <h2 className="text-xl font-bold uppercase tracking-wider text-gray-800">
                Education
              </h2>
              <div className="w-16 h-px bg-gray-400 mt-2 mb-3"></div>
              <div className="space-y-4">
                {education.map((edu, index) => (
                  <div key={index} className="text-sm">
                    <h3 className="font-bold text-base">
                      {edu.degree || "High School Diploma"}
                    </h3>
                    <p className="font-semibold text-gray-600">
                      {edu.school || "Chicago High School, Chicago, IL"} |{" "}
                      {edu.graduationDate}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );

  const renderExecutiveTemplate = () => (
    <div className="relative w-[210mm] h-[297mm] bg-white text-gray-800 shadow-2xl flex 
    transform origin-top-left scale-[.45] sm:scale-50 md:scale-60 lg:scale-75 font-sans
    print:scale-100 print:origin-center print:transform-none 
    print:w-[210mm] print:h-[297mm] print:shadow-none">

      <aside className="w-[38%] bg-[#0f2c4a] p-8 text-white flex flex-col font-light">
        <div className="mx-auto mt-2">
          <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white">
            <img
              src={personal.photoUrl || "https://placehold.co/160x160.png"}
              alt={personal.name}
              width={160}
              height={160}
              className="w-full h-full object-cover"
              data-ai-hint="professional headshot"
            />
          </div>
        </div>

        <div className="mt-8 space-y-8">
          <section>
            <h2 className="text-lg font-semibold uppercase tracking-wider border-b-2 border-white pb-2 mb-4">
              Contact
            </h2>
            <div className="space-y-3 text-sm">
              {personal.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4" /> <span>{personal.phone}</span>
                </div>
              )}
              {personal.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4" /> <span>{personal.email}</span>
                </div>
              )}
              {personal.location && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4" />{" "}
                  <span>{personal.location}</span>
                </div>
              )}
              {personal.website && (
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4" /> <span>{personal.website}</span>
                </div>
              )}
            </div>
          </section>

          {education.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold uppercase tracking-wider border-b-2 border-white pb-2 mb-4">
                Education
              </h2>
              <div className="space-y-4 text-sm">
                {education.map((edu, index) => (
                  <div key={index}>
                    <p className="font-bold">{edu.graduationDate}</p>
                    <p className="font-semibold">
                      {edu.school || "School Name"}
                    </p>
                    <p>{edu.degree || "Degree"}</p>
                    {edu.gpa && <p>GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {skills.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold uppercase tracking-wider border-b-2 border-white pb-2 mb-4">
                Skills
              </h2>
              <ul className="list-disc list-inside text-sm space-y-1">
                {skills.map((skill, index) => (
                  <li key={index}>{skill.name}</li>
                ))}
              </ul>
            </section>
          )}

          {languages.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold uppercase tracking-wider border-b-2 border-white pb-2 mb-4">
                Languages
              </h2>
              <ul className="list-disc list-inside text-sm space-y-1">
                {languages.map((lang, index) => (
                  <li key={index}>
                    {lang.name} ({lang.level})
                  </li>
                ))}
              </ul>
            </section>
          )}
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
          {personal.summary && (
            <section>
              <h2 className="text-xl font-bold uppercase tracking-wider text-[#0f2c4a]">
                Profile
              </h2>
              <div className="w-full h-[2px] bg-gray-200 mt-1 mb-3"></div>
              <p className="text-sm leading-relaxed">{personal.summary}</p>
            </section>
          )}

          {experience.length > 0 && (
            <section className="mt-6">
              <h2 className="text-xl font-bold uppercase tracking-wider text-[#0f2c4a]">
                Work Experience
              </h2>
              <div className="w-full h-[2px] bg-gray-200 mt-1 mb-3"></div>
              <div className="space-y-5">
                {experience.map((exp, index) => (
                  <div key={index} className="text-sm flex">
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
                      <ul className="list-disc list-inside text-xs space-y-1 text-gray-600">
                        {exp.description
                          .split("\n")
                          .filter((line) => line.trim() !== "")
                          .map((line, i) => (
                            <li key={i}>{line.substring(2)}</li>
                          ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {references.length > 0 && (
            <section className="mt-6">
              <h2 className="text-xl font-bold uppercase tracking-wider text-[#0f2c4a]">
                Reference
              </h2>
              <div className="w-full h-[2px] bg-gray-200 mt-1 mb-3"></div>
              <div className="flex justify-between text-sm">
                {references.map((ref, index) => (
                  <div key={index} className="w-1/2">
                    <h3 className="font-bold">{ref.name}</h3>
                    <p className="text-xs text-gray-600">{ref.title}</p>
                    <p className="text-xs text-gray-600">Phone: {ref.phone}</p>
                    <p className="text-xs text-gray-600">Email: {ref.email}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );

  const renderMinimalistTemplate = () => (
    <div className="relative w-[210mm] h-[297mm] bg-white text-[#333] shadow-2xl flex 
    transform origin-top-left scale-[.45] sm:scale-50 md:scale-60 lg:scale-75 font-sans
    print:scale-100 print:origin-center print:transform-none 
    print:w-[210mm] print:h-[297mm] print:shadow-none">

      <aside className="w-[35%] bg-[#e8e5e1] p-8 flex flex-col">
        <div className="mt-8">
          <img
            src={personal.photoUrl || "https://placehold.co/220x220.png"}
            alt={personal.name}
            width={220}
            height={220}
            className="w-full h-auto object-cover"
            data-ai-hint="professional headshot"
          />
        </div>
        <div className="mt-8 space-y-4 text-sm text-[#555]">
          {personal.phone && (
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4" /> <span>{personal.phone}</span>
            </div>
          )}
          {personal.email && (
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4" /> <span>{personal.email}</span>
            </div>
          )}
          {personal.website && (
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4" /> <span>{personal.website}</span>
            </div>
          )}
          {personal.location && (
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4" /> <span>{personal.location}</span>
            </div>
          )}
        </div>

        <div className="mt-10 space-y-8 text-sm">
          {education.length > 0 && (
            <section>
              <h2 className="text-lg font-bold uppercase text-[#333] pb-2 relative">
                Education
                <span className="absolute bottom-0 left-0 w-full h-1 bg-[#d8d1c9]"></span>
              </h2>
              <div className="mt-4 space-y-4">
                {education.map((edu, index) => (
                  <div key={index}>
                    <p className="font-bold text-base text-[#333]">
                      {edu.degree}
                    </p>
                    <p className="font-semibold text-[#555]">{edu.school}</p>
                    <p className="text-xs text-[#777]">{edu.graduationDate}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {skills.length > 0 && (
            <section>
              <h2 className="text-lg font-bold uppercase text-[#333] pb-2 relative">
                Expertise
                <span className="absolute bottom-0 left-0 w-full h-1 bg-[#d8d1c9]"></span>
              </h2>
              <div className="mt-4 space-y-2 text-[#555]">
                {skills.map((skill, index) => (
                  <p key={index}>{skill.name}</p>
                ))}
              </div>
            </section>
          )}

          {languages.length > 0 && (
            <section>
              <h2 className="text-lg font-bold uppercase text-[#333] pb-2 relative">
                Language
                <span className="absolute bottom-0 left-0 w-full h-1 bg-[#d8d1c9]"></span>
              </h2>
              <div className="mt-4 space-y-2 text-[#555]">
                {languages.map((lang, index) => (
                  <p key={index}>{lang.name}</p>
                ))}
              </div>
            </section>
          )}
        </div>
      </aside>

      <main className="w-[65%] p-10">
        <header className="mb-8">
          <h1 className="text-5xl font-extrabold tracking-tight text-[#222] uppercase">
            {personal.name || "Olivia Wilson"}
          </h1>
          <h2 className="text-2xl font-light text-gray-500 tracking-wider mt-2">
            {personal.title || "Graphics Designer"}
          </h2>
        </header>

        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <UserSquare className="w-6 h-6 text-gray-600" />
            <h2 className="text-2xl font-bold text-[#333]">Profile</h2>
          </div>
          <p className="text-sm leading-relaxed text-[#555]">
            {personal.summary}
          </p>
        </section>

        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Briefcase className="w-6 h-6 text-gray-600" />
            <h2 className="text-2xl font-bold text-[#333]">Work Experience</h2>
          </div>
          <div className="space-y-6">
            {experience.map((exp, index) => (
              <div key={index} className="flex gap-4">
                <div className="text-center w-24 text-xs text-gray-500">
                  <p>{exp.startDate}</p>
                  <p>-</p>
                  <p>{exp.endDate}</p>
                </div>
                <div className="border-l-2 border-gray-300 pl-4 flex-1">
                  <h3 className="font-bold text-base text-[#333]">
                    {exp.company}
                  </h3>
                  <p className="font-semibold text-sm text-gray-600 mb-1">
                    {exp.title}
                  </p>
                  <ul className="list-disc list-inside text-xs space-y-1 text-gray-600">
                    {exp.description
                      .split("\n")
                      .filter((line) => line.trim() !== "")
                      .map((line, i) => (
                        <li key={i}>{line.replace("- ", "")}</li>
                      ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {references.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-gray-600" />
              <h2 className="text-2xl font-bold text-[#333]">References</h2>
            </div>
            <div className="flex justify-between text-sm">
              {references.map((ref, index) => (
                <div key={index} className="w-[48%]">
                  <h3 className="font-bold">{ref.name}</h3>
                  <p className="text-xs text-gray-600">{ref.title}</p>
                  <p className="text-xs text-gray-600">Phone: {ref.phone}</p>
                  <p className="text-xs text-gray-600">Email: {ref.email}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );

  const renderCreativeTemplate = () => (
   <div className="relative w-[210mm] h-[297mm] bg-white text-gray-700 shadow-2xl flex
    transform origin-top-left scale-[.45] sm:scale-50 md:scale-60 lg:scale-75 font-sans
    print:scale-100 print:origin-center print:transform-none 
    print:w-[210mm] print:h-[297mm] print:shadow-none">

      <main className="w-full flex flex-col p-10">
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
                {personal.phone && (
                  <p>
                    <strong>P:</strong> {personal.phone}
                  </p>
                )}
                {personal.email && (
                  <p>
                    <strong>E:</strong> {personal.email}
                  </p>
                )}
                {personal.linkedin && (
                  <p>
                    <strong>L:</strong> {personal.linkedin}
                  </p>
                )}
                {personal.website && (
                  <p>
                    <strong>W:</strong> {personal.website}
                  </p>
                )}
              </div>
            </section>
            <section>
              <h3 className="font-bold text-sm uppercase tracking-wider text-gray-800 pb-2 border-b-2 border-gray-300">
                Education
              </h3>
              <div className="mt-3 space-y-2">
                {education.map((edu, index) => (
                  <div key={index}>
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
                {skills.map((skill, index) => (
                  <li key={index}>{skill.name}</li>
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
                Sales Executive Summary
              </h3>
              <p className="mt-3 leading-relaxed">{personal.summary}</p>
            </section>
            <section>
              <h3 className="font-bold text-sm uppercase tracking-wider text-gray-800 pb-2 border-b-2 border-gray-300">
                Professional Experience
              </h3>
              <div className="mt-3 space-y-4">
                {experience.map((exp, index) => (
                  <div key={index}>
                    <h4 className="font-bold text-sm">
                      {exp.title} | {exp.company} | {exp.startDate} -{" "}
                      {exp.endDate}
                    </h4>
                    <ul className="mt-1 space-y-1 list-disc list-inside">
                      {exp.description
                        .split("\n")
                        .filter((line) => line.trim() !== "")
                        .map((line, i) => (
                          <li key={i}>{line.substring(2)}</li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );

  const renderTemplate = () => {
    switch (templateId) {
      case "modern":
        return renderModernTemplate();
      case "executive":
        return renderExecutiveTemplate();
      case "minimalist":
        return renderMinimalistTemplate();
      case "creative":
        return renderCreativeTemplate();
      case "simple":
        return renderSimpleTemplate();
      case "classic":
      default:
        return renderClassicTemplate();
    }
  };

  return <div id="resume-preview">{renderTemplate()}</div>;
}
