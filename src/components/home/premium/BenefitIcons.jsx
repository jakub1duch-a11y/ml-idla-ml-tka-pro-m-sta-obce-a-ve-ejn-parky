import React from 'react';
import { motion } from 'framer-motion';

const iconProps = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round' };

export function NoPumpIcon() {
  return <svg viewBox="0 0 74 74" className="h-30 w-30"><motion.g initial={{ opacity: 0, y: -6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}><path {...iconProps} d="M14 47V27c0-9 7-16 16-16s16 7 16 16v20" /><motion.path {...iconProps} d="M32 28c0 4-3 7-3 10a3 3 0 0 0 6 0c0-3-3-6-3-10Z" fill="currentColor" stroke="none" animate={{ y: [0, 10, 10], opacity: [0, 1, 0] }} transition={{ delay: 1.4, duration: 1.5, repeat: Infinity, repeatDelay: 2.4 }} /></motion.g></svg>;
}

export function TemperatureDropIcon() {
  return <svg viewBox="0 0 64 64" className="h-30 w-30"><motion.g initial={{ opacity: 0, y: -6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}><path {...iconProps} d="M27 14v24a10 10 0 1 0 10 0V14a5 5 0 0 0-10 0Z" /><path {...iconProps} d="M32 25v18" /><circle cx="32" cy="47" r="4" fill="currentColor" /><text x="42" y="23" fontSize="10" fontWeight="700" fill="currentColor">30°</text><motion.text x="42" y="39" fontSize="10" fontWeight="700" fill="currentColor" animate={{ opacity: [0.25, 1, 0.25] }} transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 1.8 }}>24°</motion.text><motion.path {...iconProps} d="M50 27v13m0 0-4-4m4 4 4-4" animate={{ opacity: [0.25, 1, 0.25] }} transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 1.8 }} /></motion.g></svg>;
}

export function MistMotionIcon() {
  return <svg viewBox="0 0 64 64" className="h-24 w-1"><motion.g initial={{ opacity: 0, y: -6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}><path {...iconProps} d="M12 24c8-8 17 8 28 0 4-3 8-3 12 0" /><path {...iconProps} d="M8 34c8-8 17 8 30 0 5-3 10-3 16 0" /><path {...iconProps} d="M14 44c8-7 16 7 27 0 4-3 8-3 11 0" /><motion.circle cx="22" cy="16" r="3" fill="currentColor" animate={{ y: [0, 20, 20], opacity: [0, 1, 0] }} transition={{ delay: 1.2, duration: 1.4, repeat: Infinity, repeatDelay: 2.6 }} /></motion.g></svg>;
}

export function GroundScrewIcon() {
  return <svg viewBox="0 0 64 64" className="h-30 w-30"><motion.g initial={{ opacity: 0, y: -6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}><path {...iconProps} d="M20 15h24M32 15v34m-12-15h24M24 49l8 9 8-9" /><motion.path {...iconProps} d="M25 22h14" animate={{ opacity: [0.35, 1, 0.35] }} transition={{ duration: 1.8, repeat: Infinity }} /></motion.g></svg>;
}

export function AtmosphereIcon() {
  return <svg viewBox="0 0 64 64" className="h-30 w-30"><motion.g initial={{ opacity: 0, scale: 0.7 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}><path {...iconProps} d="m32 9 3 15 15 3-15 3-3 15-3-15-15-3 15-3 3-15Z" /><motion.circle cx="51" cy="15" r="2" fill="currentColor" animate={{ opacity: [0.25, 1, 0.25] }} transition={{ duration: 1.6, repeat: Infinity }} /><circle cx="14" cy="48" r="2" fill="currentColor" /></motion.g></svg>;
}

export function SmartAutomationIcon() {
  return <svg viewBox="0 0 64 64" className="h-30 w-30"><motion.g initial={{ opacity: 0, scale: 0.7 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}><circle {...iconProps} cx="32" cy="32" r="18" /><path {...iconProps} d="M32 20v12l8 5M12 24c3-6 8-10 14-11M52 24c-3-6-8-10-14-11" /><motion.circle cx="48" cy="18" r="4" fill="currentColor" animate={{ opacity: [0.35, 1, 0.35], scale: [0.8, 1.1, 0.8] }} transition={{ duration: 1.8, repeat: Infinity }} /></motion.g></svg>;
}