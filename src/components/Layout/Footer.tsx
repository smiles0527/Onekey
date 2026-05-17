import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="relative py-12 overflow-hidden bg-stone-950">
      {/* Subtle decorative orbs */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-earth-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-sage-500/10 rounded-full blur-3xl"></div>
      
      {/* Subtle top border */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-earth-400/30 to-transparent"></div>
      
      <div className="container relative z-10 grid grid-cols-1 gap-8 mx-auto mb-10 md:grid-cols-4">
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-white font-display">text</span>
          </div>
          <p className="max-w-xs text-xs font-light leading-relaxed text-stone-300/90">
            text
          </p>
          <div className="flex space-x-3">
            <motion.a
              href="#"
              className="p-1.5 transition-all duration-300 rounded-lg bg-white/5 text-stone-400 hover:bg-earth-500/20 hover:text-earth-300 backdrop-blur-sm border border-white/10 hover:border-earth-400/30"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Instagram size={16} />
            </motion.a>
            <motion.a
              href="mailto:on3keymusic@gmail.com"
              className="p-1.5 transition-all duration-300 rounded-lg bg-white/5 text-stone-400 hover:bg-earth-500/20 hover:text-earth-300 backdrop-blur-sm border border-white/10 hover:border-earth-400/30"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Mail size={16} />
            </motion.a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="mb-4 text-base font-medium tracking-wide text-white/90 font-display">text</h4>
          <ul className="space-y-2 text-xs font-light">
            <li><motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}><Link to="/about" className="transition-all duration-300 text-stone-300/80 hover:text-earth-300 inline-block">text</Link></motion.div></li>
            <li><motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}><Link to="/team" className="transition-all duration-300 text-stone-300/80 hover:text-earth-300 inline-block">text</Link></motion.div></li>
            <li><motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}><Link to="/timeline" className="transition-all duration-300 text-stone-300/80 hover:text-earth-300 inline-block">text</Link></motion.div></li>
            <li><motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}><Link to="/admin" className="transition-all duration-300 text-stone-300/80 hover:text-earth-300 inline-block">text</Link></motion.div></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="mb-4 text-base font-medium tracking-wide text-white/90 font-display">text</h4>
          <ul className="space-y-3 text-xs font-light">
            <li className="flex items-start space-x-2 group">
              <div className="p-1.5 rounded-lg bg-earth-500/10 border border-earth-400/20">
                <MapPin size={12} className="text-earth-300 shrink-0" />
              </div>
              <span className="text-stone-300/80 group-hover:text-stone-200 transition-colors">4799 Vanguard Road, Unit 301<br />Richmond, BC</span>
            </li>
            <li className="flex items-center space-x-2 group">
              <div className="p-1.5 rounded-lg bg-earth-500/10 border border-earth-400/20">
                <Mail size={12} className="text-earth-300 shrink-0" />
              </div>
              <span className="text-stone-300/80 group-hover:text-stone-200 transition-colors">on3keymusic@gmail.com</span>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="mb-4 text-base font-medium tracking-wide text-white/90 font-display">text</h4>
          <p className="mb-3 text-xs font-light text-stone-300/80">text</p>
          <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
            <div className="relative">
              <input 
                type="email" 
                placeholder="text" 
                className="w-full px-3 py-2 text-xs font-light text-white transition-all bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm focus:outline-none focus:border-primary-400/50 focus:bg-white/10 placeholder-surface-500"
              />
            </div>
            <motion.button
              type="submit"
              className="w-full px-3 py-2 text-xs font-medium tracking-wider uppercase transition-all duration-300 bg-earth-500/20 border border-earth-400/30 rounded-lg text-earth-300 hover:bg-earth-500/30 hover:border-earth-400/50 hover:shadow-lg hover:shadow-earth-500/20 backdrop-blur-sm group"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              text
            </motion.button>
          </form>
        </div>
      </div>

      {/* Bottom bar with glassmorphic separator */}
      <div className="container relative z-10 mx-auto">
        <div className="h-px mb-4 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="flex flex-col items-center justify-between text-xs font-light text-center text-stone-400/80 md:flex-row">
          <p>text</p>
          <Link to="/admin" className="mt-2 transition-all duration-300 cursor-pointer text-stone-500/60 hover:text-earth-400 md:mt-0">
            text
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;