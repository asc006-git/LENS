import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';

interface ConceptData {
  concept: string;
  mastery: number;
  confidence: number;
}

interface ConceptMasteryChartProps {
  data: ConceptData[];
}

export default function ConceptMasteryChart({ data }: ConceptMasteryChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data}>
        <PolarGrid stroke="#E2E8F0" />
        <PolarAngleAxis dataKey="concept" tick={{ fontSize: 12, fill: '#64748B' }} />
        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10, fill: '#94A3B8' }} />
        <Radar name="Mastery" dataKey="mastery" stroke="#22C55E" fill="#22C55E" fillOpacity={0.2} />
        <Radar name="Confidence" dataKey="confidence" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#0F172A',
            border: 'none',
            borderRadius: '12px',
            color: '#F8FAFC',
            fontSize: '12px',
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
