import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { PieArcDatum } from 'd3-shape';

interface PieChartProps {
    data: { title: string; value: number }[];
    width: number;
    height: number;
}

const ExperimentPieChartComponent: React.FC<PieChartProps> = ({ data, width, height }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (!svgRef.current) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove(); // Clear previous content
        const radius = Math.min(width, height) / 2;

        const pie = d3.pie<{ title: string; value: number }>().value((d) => d.value);
        const arc = d3.arc<PieArcDatum<{ title: string; value: number }>>()
            .innerRadius(0)
            .outerRadius(radius);
        const pieGroup = svg.append('g')
            .attr('transform', `translate(${width / 2},${height / 2})`);
        const arcs = pie(data);

        const totalValue = d3.sum(data, (d) => d.value);

        const Tooltip = d3.select('body')
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px");

        /*var mouseover = function () {
            Tooltip.style("opacity", 1);
        };

        var mousemove = function (event: MouseEvent, d: any) {
            Tooltip
                .html('<u>' + d.data.title + '</u>' + "<br>" + `${d.data.value}`)
                .style("left", (event.pageX + 20) + "px")
                .style("top", (event.pageY) + "px");
        };*/

        var mouseleave = function () {
            Tooltip.style("opacity", 0);
        };

        // Create and append the path elements
        pieGroup
            .selectAll('path')
            .data(arcs)
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', (d) => d.data.title.toLowerCase() === 'experimental' ? 'black' : 'rgb(179, 40, 40)')
            //.on("mouseover", mouseover)
            //.on("mousemove", mousemove)
            .on("mouseleave", mouseleave);

        // Add labels to the arcs
        pieGroup
            .selectAll('text')
            .data(arcs)
            .enter()
            .append('text')
            .attr('transform', (d) => `translate(${arc.centroid(d)})`)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr('fill', 'white') // Set label color to white
            .selectAll('tspan')
            .data((d) => {
                const percentage = ((d.data.value / totalValue) * 100).toFixed(1);
                return [
                    d.data.title,
                    `${d.data.value} (${percentage}%)`
                ];
            })
            .enter()
            .append('tspan')
            .attr('x', 0)
            .attr('dy', (d, i) => i === 0 ? 0 : '1.2em') // Position the second line below the first
            .text((d) => d);

    }, [data, width, height]);

    return (
        <div style={{
            paddingTop: '20px'
        }}>
            <svg ref={svgRef} width={width} height={height}></svg>
        </div>
    );
};

export default ExperimentPieChartComponent;
