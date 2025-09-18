import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Trash2, PlusCircle, User, Briefcase, GraduationCap, Star, Award, Upload, Languages, Users, Camera, Linkedin, MoreVertical, ChevronUp, ChevronDown } from 'lucide-react';
import React from 'react';
import { Separator } from '@/components/ui/separator.jsx';

export function ResumeForm({ resumeData, setResumeData }) {
  const fileInputRef = React.useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResumeData((prev) => ({
      ...prev,
      personal: { ...prev.personal, [name]: value },
    }));
  };
  
  const handleNameChange = (e) => {
    const { name, value } = e.target;
    const currentName = resumeData.personal.name || '';
    const nameParts = currentName.split(' ');
    let newName;
    if (name === 'givenName') {
      newName = `${value} ${nameParts.slice(1).join(' ')}`;
    } else { // familyName
      nameParts[1] = value;
      newName = `${nameParts[0]} ${nameParts.slice(1).join(' ')}`;
    }
    setResumeData((prev) => ({
      ...prev,
      personal: { ...prev.personal, name: newName.trim() },
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setResumeData((prev) => ({
          ...prev,
          personal: { ...prev.personal, photoUrl: reader.result },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleArrayChange = (
    section,
    index,
    e
  ) => {
    const { name, value } = e.target;
    const list = [...resumeData[section]];
    list[index] = { ...list[index], [name]: value };
    setResumeData((prev) => ({ ...prev, [section]: list }));
  };

  const addArrayItem = (section, newItem) => {
    const list = [...resumeData[section]];
    setResumeData((prev) => ({ ...prev, [section]: [...list, newItem] }));
  };

  const removeArrayItem = (section, index) => {
    const list = [...resumeData[section]];
    list.splice(index, 1);
    setResumeData((prev) => ({ ...prev, [section]: list }));
  };

  const nameParts = resumeData.personal.name.split(' ');
  const givenName = nameParts[0] || '';
  const familyName = nameParts.slice(1).join(' ') || '';

  return (
    <div className="space-y-8 text-white bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Untitled resume</h2>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">Personal details</h3>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon"><MoreVertical /></Button>
                <Button variant="ghost" size="icon"><ChevronUp /></Button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
            <div className="md:col-span-1">
                <Label>Photo</Label>
                 <div 
                    className="mt-2 w-full aspect-square bg-muted rounded-lg flex items-center justify-center cursor-pointer hover:bg-muted/80"
                    onClick={() => fileInputRef.current?.click()}
                  >
                   {resumeData.personal.photoUrl ? (
                      <img src={resumeData.personal.photoUrl} alt="User photo" className="w-full h-full object-cover rounded-lg" />
                   ) : (
                      <Camera className="w-8 h-8 text-muted-foreground" />
                   )}
                </div>
                <Input id="photoUrl" name="photoUrl" type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" ref={fileInputRef} />
            </div>
            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><Label htmlFor="givenName">Given Name</Label><Input id="givenName" name="givenName" value={givenName} onChange={handleNameChange} /></div>
                <div><Label htmlFor="familyName">Family Name</Label><Input id="familyName" name="familyName" value={familyName} onChange={handleNameChange} /></div>
                <div className="col-span-2"><Label htmlFor="title">Desired job position</Label><Input id="title" name="title" value={resumeData.personal.title} onChange={handleChange} /></div>
            </div>
             <div className="md:col-span-2"><Label htmlFor="email">Email address</Label><Input id="email" name="email" type="email" value={resumeData.personal.email} onChange={handleChange} /></div>
             <div className="md:col-span-2"><Label htmlFor="phone">Phone number</Label><Input id="phone" name="phone" value={resumeData.personal.phone} onChange={handleChange} /></div>
             <div className="md:col-span-4"><Label htmlFor="location">Address</Label><Input id="location" name="location" value={resumeData.personal.location} onChange={handleChange} /></div>
             <div><Label htmlFor="linkedin">LinkedIn</Label><Input id="linkedin" name="linkedin" value={resumeData.personal.linkedin} onChange={handleChange} /></div>
             <div><Label htmlFor="website">Website</Label><Input id="website" name="website" value={resumeData.personal.website} onChange={handleChange} /></div>
        </div>
      </div>
      
      <Separator/>

      <Accordion type="multiple" defaultValue={['experience', 'education', 'skills', 'certifications', 'languages', 'references']} className="w-full space-y-4">
         <div><Label htmlFor="summary">Summary</Label><Textarea id="summary" name="summary" value={resumeData.personal.summary} onChange={handleChange} /></div>

        {/* Work Experience */}
        <AccordionItem value="experience">
          <AccordionTrigger>
             <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5" />
              <h3 className="font-semibold text-lg">Work Experience</h3>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="space-y-3 p-4 border rounded-md relative">
                <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeArrayItem('experience', index)}><Trash2 className="w-4 h-4" /></Button>
                <div><Label>Job Title</Label><Input name="title" value={exp.title} onChange={(e) => handleArrayChange('experience', index, e)} /></div>
                <div><Label>Company</Label><Input name="company" value={exp.company} onChange={(e) => handleArrayChange('experience', index, e)} /></div>
                <div><Label>Location</Label><Input name="location" value={exp.location} onChange={(e) => handleArrayChange('experience', index, e)} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Start Date</Label><Input name="startDate" value={exp.startDate} onChange={(e) => handleArrayChange('experience', index, e)} /></div>
                  <div><Label>End Date</Label><Input name="endDate" value={exp.endDate} onChange={(e) => handleArrayChange('experience', index, e)} /></div>
                </div>
                <div><Label>Description</Label><Textarea name="description" value={exp.description} onChange={(e) => handleArrayChange('experience', index, e)} rows={4} /></div>
              </div>
            ))}
            <Button variant="outline" onClick={() => addArrayItem('experience', { title: '', company: '', location: '', startDate: '', endDate: '', description: '' })}><PlusCircle className="mr-2 h-4 w-4" /> Add Experience</Button>
          </AccordionContent>
        </AccordionItem>

        {/* Education */}
        <AccordionItem value="education">
          <AccordionTrigger>
             <div className="flex items-center gap-3">
              <GraduationCap className="w-5 h-5" />
              <h3 className="font-semibold text-lg">Education</h3>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            {resumeData.education.map((edu, index) => (
              <div key={index} className="space-y-3 p-4 border rounded-md relative">
                <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeArrayItem('education', index)}><Trash2 className="w-4 h-4" /></Button>
                <div><Label>Degree</Label><Input name="degree" value={edu.degree} onChange={(e) => handleArrayChange('education', index, e)} /></div>
                <div><Label>School</Label><Input name="school" value={edu.school} onChange={(e) => handleArrayChange('education', index, e)} /></div>
                <div><Label>Graduation Date</Label><Input name="graduationDate" value={edu.graduationDate} onChange={(e) => handleArrayChange('education', index, e)} /></div>
                <div><Label>GPA</Label><Input name="gpa" value={edu.gpa} onChange={(e) => handleArrayChange('education', index, e)} /></div>
              </div>
            ))}
            <Button variant="outline" onClick={() => addArrayItem('education', { degree: '', school: '', graduationDate: '', gpa: '' })}><PlusCircle className="mr-2 h-4 w-4" /> Add Education</Button>
          </AccordionContent>
        </AccordionItem>

        {/* Skills */}
        <AccordionItem value="skills">
          <AccordionTrigger>
             <div className="flex items-center gap-3">
              <Star className="w-5 h-5" />
              <h3 className="font-semibold text-lg">Skills</h3>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            {resumeData.skills.map((skill, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input name="name" value={skill.name} onChange={(e) => handleArrayChange('skills', index, e)} />
                <Button variant="ghost" size="icon" onClick={() => removeArrayItem('skills', index)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            ))}
            <Button variant="outline" onClick={() => addArrayItem('skills', { name: '' })}><PlusCircle className="mr-2 h-4 w-4" /> Add Skill</Button>
          </AccordionContent>
        </AccordionItem>
        
        {/* Certifications */}
        <AccordionItem value="certifications">
          <AccordionTrigger>
             <div className="flex items-center gap-3">
              <Award className="w-5 h-5" />
              <h3 className="font-semibold text-lg">Certifications</h3>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            {resumeData.certifications.map((cert, index) => (
              <div key={index} className="space-y-3 p-4 border rounded-md relative">
                <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeArrayItem('certifications', index)}><Trash2 className="w-4 h-4" /></Button>
                <div><Label>Certification Name</Label><Input name="name" value={cert.name} onChange={(e) => handleArrayChange('certifications', index, e)} /></div>
                <div><Label>Date</Label><Input name="date" value={cert.date} onChange={(e) => handleArrayChange('certifications', index, e)} /></div>
              </div>
            ))}
            <Button variant="outline" onClick={() => addArrayItem('certifications', { name: '', date: '' })}><PlusCircle className="mr-2 h-4 w-4" /> Add Certification</Button>
          </AccordionContent>
        </AccordionItem>

        {/* Languages */}
        <AccordionItem value="languages">
          <AccordionTrigger>
             <div className="flex items-center gap-3">
              <Languages className="w-5 h-5" />
              <h3 className="font-semibold text-lg">Languages</h3>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            {resumeData.languages.map((lang, index) => (
              <div key={index} className="space-y-3 p-4 border rounded-md relative">
                 <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeArrayItem('languages', index)}><Trash2 className="w-4 h-4" /></Button>
                <div className="grid grid-cols-2 gap-4">
                    <div><Label>Language</Label><Input name="name" value={lang.name} onChange={(e) => handleArrayChange('languages', index, e)} /></div>
                    <div><Label>Level</Label><Input name="level" value={lang.level} onChange={(e) => handleArrayChange('languages', index, e)} /></div>
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={() => addArrayItem('languages', { name: '', level: '' })}><PlusCircle className="mr-2 h-4 w-4" /> Add Language</Button>
          </AccordionContent>
        </AccordionItem>

        {/* References */}
        <AccordionItem value="references">
          <AccordionTrigger>
             <div className="flex items-center gap-3">
              <Users className="w-5 h-5" />
              <h3 className="font-semibold text-lg">References</h3>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            {resumeData.references.map((ref, index) => (
              <div key={index} className="space-y-3 p-4 border rounded-md relative">
                <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeArrayItem('references', index)}><Trash2 className="w-4 h-4" /></Button>
                <div><Label>Full Name</Label><Input name="name" value={ref.name} onChange={(e) => handleArrayChange('references', index, e)} /></div>
                <div><Label>Title</Label><Input name="title" value={ref.title} onChange={(e) => handleArrayChange('references', index, e)} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Phone</Label><Input name="phone" value={ref.phone} onChange={(e) => handleArrayChange('references', index, e)} /></div>
                  <div><Label>Email</Label><Input name="email" value={ref.email} onChange={(e) => handleArrayChange('references', index, e)} /></div>
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={() => addArrayItem('references', { name: '', title: '', phone: '', email: '' })}><PlusCircle className="mr-2 h-4 w-4" /> Add Reference</Button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
