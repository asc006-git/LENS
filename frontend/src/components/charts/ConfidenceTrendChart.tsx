import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ConfidenceData {
  time: string;
  value: number;
}

interface ConfidenceTrendChartProps {
  data: ConfidenceData[];
}

export default function ConfidenceTrendChart({ data }: ConfidenceTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
        <XAxis dataKey="time" tick={{ fontSize: 12, fill: '#94A3B8' }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#94A3B8' }} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#0F172A',
            border: 'none',
            borderRadius: '12px',
            color: '#F8FAFC',
            fontSize: '12px',
          }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#3B82F6"
          strokeWidth={2}
          dot={{ fill: '#3B82F6', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
