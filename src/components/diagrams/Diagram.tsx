"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface TagData {
  count: number;
  value: string;
  fill?: string;
}

const generateChartConfig = (data?: TagData[]) => {
  const config: Record<string, { label: string; color?: string }> = {};
  data?.forEach((item, index) => {
    config[item.value] = {
      label: item.value,
      color: item.fill || `hsl(var(--chart-${index + 1}))`,
    };
  });
  return config;
};

function Diagram({ data, text }: { data?: TagData[], text?: string }) {
  React.useEffect(() => {
    // console.log("Received text:", text);
  }, [text]);

  const totalVisitors = React.useMemo(() => {
    return data?.reduce((acc, curr) => acc + curr.count, 0)
  }, [data])

  const chartConfig = React.useMemo(() => generateChartConfig(data), [data]);

  return (
    <div className="!max-h-[400px] scrollth my-2 overflow-y-scroll shadow-sm rounded-xl">
      <Card>
        <CardHeader className="items-center pb-0">
          <CardTitle>{text}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={data}
                dataKey="count"
                nameKey="value"
                innerRadius={60}
                strokeWidth={Math.max(5, 10 / (data?.length || 1))}
                paddingAngle={1}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {data?.length}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-1 items-start justify-center">
          {
            data?.map((item, idx) => (
              <div style={{ backgroundColor: item.fill }} className="text-white py-1 px-5 text-sm rounded-full" key={idx}>
                {item.value} - {item.count}
              </div>
            ))
          }


        </CardFooter>
      </Card>
    </div>
  )
}

export default Diagram