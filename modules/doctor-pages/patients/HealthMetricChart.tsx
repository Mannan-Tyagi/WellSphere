import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface HealthMetricData {
  date: string;
  value: number;
}

interface HealthMetricProps {
  name: string;
  data: HealthMetricData[];
  color?: string;
}

const HealthMetricChart: React.FC<HealthMetricProps> = ({ name, data, color = "#006D77" }) => {
  return (
    <div className="h-full">
      <h4 className="text-sm font-medium mb-2">{name} Trend</h4>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HealthMetricChart;