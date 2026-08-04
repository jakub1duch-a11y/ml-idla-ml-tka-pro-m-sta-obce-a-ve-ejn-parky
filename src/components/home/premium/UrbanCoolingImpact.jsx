import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, Heart, ShoppingBag, UsersRound, Wind } from 'lucide-react';
import WindMistOverlay from '@/components/home/premium/WindMistOverlay';

const BENEFITS = [
{ Icon: Heart, text: 'Vraťte život na náměstí i zahrádky' },
{ Icon: UsersRound, text: 'Zábava pro děti, rodiče i návštěvníky' },
{ Icon: Wind, text: 'Čistší a příjemnější vzduch v úmorných vedrech' },
{ Icon: Building2, text: 'Vyšší komfort pro obyvatele i zvířata' },
{ Icon: ShoppingBag, text: 'Delší návštěvy a větší podpora prodeje' }];


export default function UrbanCoolingImpact() {
  const [temperature, setTemperature] = useState(34);
  useEffect(() => {const timer = setInterval(() => setTemperature((value) => value > 24 ? value - 1 : value), 480);return () => clearInterval(timer);}, []);
  return null;
}