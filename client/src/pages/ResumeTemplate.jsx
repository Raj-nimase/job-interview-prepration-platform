import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// import template1 from "@/template/creative.png";

const templates = [
  {
    id: 'modern',
    name: 'MODERN',
    thumbnail: '/public/photo/Modern.png',
    dataAiHint: 'modern resume',
  },
  {
    id: 'minimalist',
    name: 'MINIMALIST',
    thumbnail: '/public/photo/minimalist.png',
    dataAiHint: 'minimalist resume',
  },
  {
    id: 'executive',
    name: 'EXECUTIVE',
    thumbnail: '/public/photo/executive.png',
    dataAiHint: 'executive resume',
  },
  {
    id: 'creative',
    name: 'CREATIVE',
    thumbnail: '/public/photo/creative.png',
    dataAiHint: 'creative resume',
  },
  {
    id: 'classic',
    name: 'CLASSIC',
    thumbnail: '/public/photo/classic.png',
    dataAiHint: 'classic resume',
  },
  {
    id: 'simple',
    name: 'SIMPLE',
    thumbnail: '/public/photo/simple.png',
    dataAiHint: 'simple resume',
  },
];

export default function ResumeTemplate() {
  const navigate = useNavigate();

  const handleSelectTemplate = (templateId) => {
    navigate(`/editor?template=${templateId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col ">
      <main className="container mx-auto py-16 md:py-24 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Choose Your Resume Template</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template,i) => (
            <Card key={template.id} className="bg-white/10 rounded-2xl overflow-hidden transform transition hover:scale-105 hover:shadow-2xl " onClick={() => handleSelectTemplate(template.id)}
            style={{
                animation: `fadeInUp 0.6s ease ${0.1 * i}s forwards`,
                opacity: 10,
              }}
            >
              <CardContent className="p-4">
                <div className="aspect-[3/3] rounded-lg overflow-hidden mb-4">
                   <img
                    src={template.thumbnail}
                    alt={template.name}
                    width={400}
                    height={800}
                    className="max-h-full max-w-full object-contain"
                    data-ai-hint={template.dataAiHint}
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-lg text-white font-semibold">{template.name}</h3>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                   <Button
                    variant="default"
                    className="bg-emerald-400 text-slate-900 px-6 py-2 mt-4 rounded-full font-semibold transition hover:bg-emerald-500"
                    onClick={(e) => { e.stopPropagation(); handleSelectTemplate(template.id); }}
                  >
                    Use Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
