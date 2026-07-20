import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const EXCLUDED = ['Zemní vrut – rychlá mobilní instalace', 'SMART řízení mlžítek', 'Filtrační a jiné Moduly', 'Trysky HT-LT', 'senzory'];

export default function Collection2026Section() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    base44.entities.Product.list().
    then((items) => setProducts((items || []).filter((p) => p.image_url && !EXCLUDED.includes(p.name)))).
    catch(() => setProducts([])).
    finally(() => setLoading(false));
  }, []);

  const scrollBy = (amount) => scrollRef.current?.scrollBy({ left: amount, behavior: 'smooth' });

  return null;



















































}