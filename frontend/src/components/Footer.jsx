import React from 'react';
import { Mail, Phone, Linkedin, Github, GraduationCap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <div className="p-2 bg-gradient-to-tr from-accent to-emerald-400 rounded-xl text-white">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="tracking-tight">EduLoan Navigator</span>
            </div>
            <p className="text-sm text-slate-400 max-w-xs">
              Empowering students and parents to evaluate education loans, simulate repayment structures, and optimize pre-payments.
            </p>
          </div>

          {/* Quick Info & Developer Credits */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase">Developed By</h3>
            <div className="space-y-1">
              <p className="text-md font-bold text-slate-100">PODUGU MUKESH</p>
              <p className="text-xs text-slate-400">Fintech Software Architect & Full-Stack Developer</p>
            </div>
            <div className="flex gap-4">
              <a 
                href="https://www.linkedin.com/in/podugu-mukesh-1575a32b4/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="https://github.com/mukeshpodugu" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase">Contact Details</h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-accent" />
                <a href="mailto:mukeshpodugu123@gmail.com" className="hover:text-white transition-colors">
                  mukeshpodugu123@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-accent" />
                <a href="tel:+918143999463" className="hover:text-white transition-colors">
                  +91 8143999463
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} EduLoan Navigator. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
