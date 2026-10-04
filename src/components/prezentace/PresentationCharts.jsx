import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const NAVY = '#153863';
const CYAN = '#22D3EE';
const MIST = '#91A6B5';
const STEEL = '#466279';

const temperatureData = [
  { name: 'Ráno', bez_mlzeni: 24, s_mlzenim: 22 },
  { name: 'Poledne', bez_mlzeni: 33, s_mlzenim: 26 },
  { name: 'Odpoledne', bez_mlzeni: 35, s_mlzenim: 27 },
  { name: 'Večer', bez_mlzeni: 28, s_mlzenim: 24 },
];

const satisfactionData = [
  { name: 'Velmi spokojeni', value: 68, color: CYAN },
  { name: 'Spokojeni', value: 22, color: NAVY },
  { name: 'Neutrální', value: 7, color: MIST },
  { name: 'Nespokojeni', value: 3, color: STEEL },
];

export function TemperatureChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={temperatureData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(70,98,121,.15)" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#5A6B78' }} axisLine={{ stroke: '#D3E2E8' }} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: '#5A6B78' }} axisLine={false} tickLine={false} unit="°C" />
        <Tooltip cursor={{ fill: 'rgba(34,211,238,.05)' }} contentStyle={{ border: '1px solid #D3E2E8', borderRadius: 0, fontSize: 13, fontFamily: 'var(--font-mono)' }} />
        <Legend wrapperStyle={{ fontSize: 12, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '.05em' }} />
        <Bar dataKey="bez_mlzeni" name="Bez mlžení" fill={STEEL} radius={[2, 2, 0, 0]} barSize={32} />
        <Bar dataKey="s_mlzenim" name="S mlžením" fill={CYAN} radius={[2, 2, 0, 0]} barSize={32} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function SatisfactionChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={satisfactionData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={110} paddingAngle={2}>
          {satisfactionData.map((entry) => (
            <Cell key={entry.name} fill={entry.color} stroke="#fff" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ border: '1px solid #D3E2E8', borderRadius: 0, fontSize: 13, fontFamily: 'var(--font-mono)' }} formatter={(v) => `${v}%`} />
        <Legend wrapperStyle={{ fontSize: 12, fontFamily: 'var(--font-mono)' }} />
      </PieChart>
    </ResponsiveContainer>
  );
}