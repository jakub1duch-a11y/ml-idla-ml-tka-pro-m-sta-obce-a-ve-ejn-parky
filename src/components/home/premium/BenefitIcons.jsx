import React from 'react';
import { motion } from 'framer-motion';

const iconProps = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round' };

export function NoPumpIcon() {
  return <svg viewBox="0 0 64 64" className="h-16 w-16"><path {...iconProps} d="M14 47V27c0-9 7-16 16-16s16 7 16 16v20" /><motion.path {...iconProps} d="M27 48c0-5 2.5-9 5-13 2.5 4 5 8 5 13a5 5 0 0 1-10 0Z" animate={{ y: [0, -3, 0] }} transition={{ duration: 2, repeat: Infinity }} /></svg>;
}

export function TemperatureDropIcon() {
  return <svg viewBox="0 0 64 64" className="h-16 w-16"><path {...iconProps} d="M27 14v24a10 10 0 1 0 10 0V14a5 5 0 0 0-10 0Z" /><path {...iconProps} d="M32 25v18" /><motion.path {...iconProps} d="M47 17v16m0 0-5-5m5 5 5-5" animate={{ y: [0, 5, 0] }} transition={{ duration: 1.7, repeat: Infinity }} /><motion.circle cx="32" cy="47" r="4" fill="currentColor" animate={{ opacity: [0.45, 1, 0.45] }} transition={{ duration: 1.7, repeat: Infinity }} /></svg>;
}

export function MistMotionIcon() {
  return <svg viewBox="0 0 64 64" className="h-16 w-16"><motion.path {...iconProps} d="M12 24c8-8 17 8 28 0 4-3 8-3 12 0" animate={{ x: [-4, 4, -4] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} /><motion.path {...iconProps} d="M8 34c8-8 17 8 30 0 5-3 10-3 16 0" animate={{ x: [4, -4, 4] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }} /><motion.path {...iconProps} d="M14 44c8-7 16 7 27 0 4-3 8-3 11 0" animate={{ x: [-3, 3, -3] }} transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }} /></svg>;
}

export function GroundScrewIcon() {
  return <svg viewBox="0 0 64 64" className="h-16 w-16"><path {...iconProps} d="M20 15h24M32 15v34m-12-15h24M24 49l8 9 8-9" /><motion.path {...iconProps} d="M25 22h14" animate={{ rotate: [0, 360] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} style={{ transformOrigin: '32px 22px' }} /></svg>;
}

export function AtmosphereIcon() {
  return <svg viewBox="0 0 64 64" className="h-16 w-16"><motion.path {...iconProps} d="m32 9 3 15 15 3-15 3-3 15-3-15-15-3 15-3 3-15Z" animate={{ scale: [0.82, 1.08, 0.82], rotate: [0, 8, 0] }} transition={{ duration: 2.8, repeat: Infinity }} style={{ transformOrigin: '32px 32px' }} /><circle cx="51" cy="15" r="2" fill="currentColor" /><circle cx="14" cy="48" r="2" fill="currentColor" /></svg>;
}

export function SmartAutomationIcon() {
  return <svg viewBox="0 0 64 64" className="h-16 w-16"><circle {...iconProps} cx="32" cy="32" r="18" /><path {...iconProps} d="M32 20v12l8 5M12 24c3-6 8-10 14-11M52 24c-3-6-8-10-14-11" /><motion.circle cx="48" cy="18" r="4" fill="currentColor" animate={{ opacity: [0.35, 1, 0.35], scale: [0.8, 1.1, 0.8] }} transition={{ duration: 1.8, repeat: Infinity }} /></svg>;
}