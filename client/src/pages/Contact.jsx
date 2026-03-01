import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";
import Footer from "@/components/Footer";

const ContactPage = () => {
  return (
    <div className="bg-background min-h-screen">
      <main className="py-20 sm:py-24 md:py-32">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 text-foreground">
              Get In <span className="text-emerald-500">Touch</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              We’d love to hear from you! Whether you have a question, feedback,
              or just want to say hello, feel free to reach out.
            </p>
          </motion.div>

          {/* Contact Form and Info */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-lg shadow-black/5 dark:shadow-black/20"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
                Contact Information
              </h3>
              <div className="space-y-4 text-muted-foreground">
                <div className="flex items-center gap-4">
                  <Mail className="w-6 h-6 text-cyan-400" />
                  <span>support@HireReady.com</span>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="w-6 h-6 text-cyan-400" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin className="w-6 h-6 text-cyan-400" />
                  <span>123 Tech Avenue, Silicon Valley, CA</span>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-lg shadow-black/5 dark:shadow-black/20"
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
                className="space-y-6"
              >
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Full Name
                  </label>
                  <Input id="name" name="name" type="text" placeholder="Your Name" required className="bg-muted/50 border-border"/>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <Input id="email" name="email" type="email" placeholder="you@example.com" required className="bg-muted/50 border-border"/>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    Message
                  </label>
                  <Textarea id="message" name="message" rows={5} placeholder="Your message here..." required className="bg-muted/50 border-border"/>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity focus-visible:ring-2 focus-visible:ring-emerald-400"
                >
                  Send Message
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
