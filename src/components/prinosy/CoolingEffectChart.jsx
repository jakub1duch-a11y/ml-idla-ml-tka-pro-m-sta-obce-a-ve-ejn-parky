import React from 'react';
import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function CoolingEffectChart({ temperature, humidity }) {
  const multiplier = humidity === 30 ? 0.5 : 0.35;
  const data = Array.from({ length: 16 }, (_, index) => {
    const ambient = index + 25;
    return { ambient, perceived: Number((ambient - ((ambient - 15) * multiplier)).toFixed(1)) };
  });
  return <div className="h-72"><ResponsiveContainer width="100%" height="100%"><LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 15 }}><CartesianGrid stroke="#e2e8f0" vertical={false} /><XAxis dataKey="ambient" label={{ value: 'Okolní teplota (°C)', position: 'insideBottom', offset: -5 }} tickLine={false} axisLine={false} /><YAxis label={{ value: 'Pocitová teplota (°C)', angle: -90, position: 'insideLeft' }} tickLine={false} axisLine={false} domain={[15, 30]} /><Tooltip formatter={(value) => [`${value} °C`, 'Pocitová teplota']} labelFormatter={(value) => `Okolní teplota: ${value} °C`} /><ReferenceLine x={temperature} stroke="#334155" strokeDasharray="4 4" /><Line type="monotone" dataKey="perceived" stroke="#0070F3" strokeWidth={3} dot={false} activeDot={{ r: 5 }} /></LineChart></ResponsiveContainer></div>;
}