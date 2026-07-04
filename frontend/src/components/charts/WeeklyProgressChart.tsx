import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WeeklyData {
  week: string;
  sessions: number;
  authenticity: number;
}

interface WeeklyProgressChartProps {
  data: WeeklyData[];
}

export default function WeeklyProgressChart({ data }: WeeklyProgressChartProps) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
        <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#94A3B8' }} />
        <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#0F172A',
            border: 'none',
            borderRadius: '12px',
            color: '#F8FAFC',
            fontSize: '12px',
          }}
        />
        <Bar dataKey="sessions" fill="#22C55E" radius={[4, 4, 0, 0]} />
        <Bar dataKey="authenticity" fill="#3B82F6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
