import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  const socialLinks = [
    { 
      icon: Github, 
      href: "https://github.com/Shindawn", 
      label: "GitHub" 
    },
    { 
      icon: Linkedin, 
      href: "https://www.linkedin.com/in/lescy-g-caadlawon2004", 
      label: "LinkedIn" 
    },
    { 
      icon: Mail, 
      href: "mailto:caadlawony@gmail.com", 
      label: "Email" 
    },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="py-8 text-center"
    >
      <div className="flex justify-center gap-4 mb-4">
        {socialLinks.map((link, index) => (
          <motion.a
            key={link.label}
            href={link.href}
            target={link.label !== "Email" ? "_blank" : undefined}
            rel={link.label !== "Email" ? "noopener noreferrer" : undefined}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.1 }}
            className="p-2 rounded-full bg-secondary hover:bg-accent transition-colors"
            aria-label={link.label}
          >
            <link.icon className="w-5 h-5 text-foreground" />
          </motion.a>
        ))}
      </div>
      
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="text-sm text-muted-foreground flex items-center justify-center gap-1"
      >
        © {new Date().getFullYear()} Lescy G. Caadlawon - All rights reserved.
      </motion.p>
    </motion.footer>
  );
};

export default Footer;