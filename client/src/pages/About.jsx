import { motion } from "framer-motion";
import { Users, Target, Rocket, Lightbulb } from "lucide-react";
import Footer from "@/components/Footer";

const teamMembers = [
  {
    name: "Alex Johnson",
    role: "Founder & CEO",
    imageUrl: "https://plus.unsplash.com/premium_photo-1669782051654-f8805ea71993?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2luZ2xlJTIwcGVyc29ufGVufDB8fDB8fHww",
    hint: "man portrait"
  },
  {
    name: "Samantha Lee",
    role: "Lead Developer",
    imageUrl: "https://media.gettyimages.com/id/1483869287/photo/happy-businesswoman-working-at-the-office-and-holding-a-tablet.jpg?s=612x612&w=0&k=20&c=IKOGiS8I963FxyAtop4tg-NbZM0rBsk06x59m5vNSCY=",
    hint: "woman portrait"
  },
  {
    name: "Michael Chen",
    role: "UX/UI Designer",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-PvRRmVq7vALXCCF2myKBrCvRnSuvQMOWtQ&s",
    hint: "man portrait smiling"
  },
  {
    name: "Jessica Brown",
    role: "Marketing Head",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxc38Cs0KMB38pMdruukuG9K9vq8JdmlMdbg&s",
    hint: "woman portrait smiling"
  },
];

const values = [
  {
    icon: <Rocket size={32} className="text-cyan-400" />,
    title: "Our Mission",
    description: "To empower every job seeker with the tools, knowledge, and confidence needed to succeed in their career journey and land their dream job.",
  },
  {
    icon: <Target size={32} className="text-purple-400" />,
    title: "Our Vision",
    description: "To become the most trusted and effective platform for interview preparation, creating a world where talent and opportunity are perfectly aligned.",
  },
  {
    icon: <Lightbulb size={32} className="text-amber-400" />,
    title: "Our Values",
    description: "We believe in integrity, continuous improvement, and a user-first approach. We are committed to creating a supportive and inclusive community.",
  },
];

const AboutPage = () => {
  return (
    <div className="bg-background min-h-screen">
      <main>
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="py-20 sm:py-24 md:py-32 text-center bg-muted/30"
        >
          <div className="container mx-auto px-4 sm:px-6">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 text-foreground"
            >
              About <span className="text-emerald-500">HireReady</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto"
            >
              We are a passionate team dedicated to helping you bridge the gap
              between your skills and your career aspirations.
            </motion.p>
          </div>
        </motion.section>

        {/* Values Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="py-20"
        >
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="bg-card p-6 sm:p-8 rounded-2xl border border-border shadow-lg shadow-black/5 dark:shadow-black/20"
                >
                  <div className="flex justify-center mb-4">{value.icon}</div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 text-foreground">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Team Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="py-16 sm:py-20 bg-muted/30"
        >
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Meet Our <span className="text-emerald-500">Team</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The minds behind the mission, working together to build the
                future of interview prep.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="text-center bg-card p-6 rounded-2xl border border-border shadow-lg shadow-black/5 dark:shadow-black/20 group hover:border-emerald-500/30 transition-all duration-300"
                >
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    data-ai-hint={member.hint}
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-full mx-auto mb-4 border-4 border-border group-hover:border-emerald-500 transition-colors duration-300 object-cover"
                  />
                  <h4 className="text-lg sm:text-xl font-semibold text-foreground">
                    {member.name}
                  </h4>
                  <p className="text-emerald-500">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
