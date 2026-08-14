import React from 'react';
import { Link } from 'react-router-dom';

const variants = {
  primary: 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-slate-950 hover:shadow-2xl hover:from-cyan-400 hover:to-cyan-500 hover:scale-105',
  secondary: 'border-2 border-current/40 bg-transparent hover:bg-current/10 hover:border-current/70 backdrop-blur-sm'
};

export default function SiteButton({ to, href, children, variant = 'primary', className = '', ...props }) {
  const classes = `inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-sm sm:text-base transition-all duration-300 ${variants[variant]} ${className}`;
  if (to) return <Link to={to} className={classes} {...props}>{children}</Link>;
  return <a href={href} className={classes} {...props}>{children}</a>;
}
