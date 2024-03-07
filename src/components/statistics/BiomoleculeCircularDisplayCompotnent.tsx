import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import Paper from '@mui/material/Paper';

const BiomoleculeCircularDisplayComponent: React.FC<any> = (props) => {
    const svgRef = useRef<HTMLDivElement>(null);
    const {biomoleculeStatistics} = props;

    useEffect(() => {
        if(biomoleculeStatistics.length === 0) return;
        if (svgRef.current) {
            const width = 200;
            const height = 200;

            const svg = d3.select(svgRef.current)
                .append("svg")
                .attr("width", width)
                .attr("height", height);
            interface Data extends d3.SimulationNodeDatum {
                type: string;
                value: number;
            }
            let data : Data[] = biomoleculeStatistics;

            let typeDomain = biomoleculeStatistics.map((stat: any) => stat.type);
            let valueDomain = biomoleculeStatistics.map((stat: any) => stat.value);

            const typeColors: { [key: string]: string } = {
                'Protein': 'blue',
                'PFRAG': 'lightBlue',
                'Multimer': 'orange',
                'GAG': 'green'
            };

            const color = d3.scaleOrdinal()
                .domain(Object.keys(typeColors))
                .range(Object.values(typeColors));

            // Size scale for countries
            var size = d3.scaleLog()
                .domain([1,75000])
                .range([1,50]);

            var Tooltip = d3.select(svgRef.current)
                .append("div")
                .style("opacity", 0)
                .attr("class", "tooltip")
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "2px")
                .style("border-radius", "5px")
                .style("padding", "5px")

            var mouseover = function(d: Data) {
                Tooltip
                    .style("opacity", 1)
            }
            var mousemove = function(event: MouseEvent, d: Data) {
                Tooltip
                    .html('<u>' + d.type + '</u>' + "<br>" + `Value: ${d.value}`)
                    .style("left", (event.pageX + 20) + "px")
                    .style("top", (event.pageY) + "px");
            }
            var mouseleave = function(d: Data) {
                Tooltip
                    .style("opacity", 0)
            }

            var circles = svg.append("g")
                .selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .attr("class", "node")
                .attr("r", function (d) {
                    return size(d.value);
                })
                .attr("cx", width / 2)
                .attr("cy", height / 2)
                .style("fill", function (d) : string {
                    return color(d.type) as string;
                })
                .style("fill-opacity", 0.8)
                .attr("stroke", "black")
                .style("stroke-width", 1)
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave)


            var simulation = d3.forceSimulation<Data>(data)
                .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
                .force("charge", d3.forceManyBody<Data>().strength(.1)) // Nodes are attracted to each other if the value is > 0
                .force("collide", d3.forceCollide<Data>().strength(.2).radius((d) => size(d.value) + 3).iterations(1));

            simulation.on("tick", () => {
                circles
                    .attr("cx", (d) => d.x || 0)
                    .attr("cy", (d) => d.y || 0);
            });

            return () => {
                svg.remove();
            };
        }
    }, [biomoleculeStatistics]);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: '10px'
        }}>
            <div ref={svgRef}></div>
        </div>
    );
};

export default BiomoleculeCircularDisplayComponent;
