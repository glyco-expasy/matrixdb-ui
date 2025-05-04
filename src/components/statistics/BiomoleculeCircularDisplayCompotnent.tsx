import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import Paper from '@mui/material/Paper';

const BiomoleculeCircularDisplayComponent: React.FC<any> = (props) => {
    const {width, height} = props;
    const svgRef = useRef<HTMLDivElement>(null);
    const {biomoleculeStatistics} = props;

    useEffect(() => {
        if(biomoleculeStatistics.length === 0) return;
        if (svgRef.current) {
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
                'Protein': '#f89406',
                'PFRAG': '#f5e214',
                'Multimer': '#6a09c5',
                'GAG': '#018FD5',
                'SmallMolecules': 'lightBlue',
                'CAT': 'black',
                'LIPID': 'lightpink',
                'SPEP': '#d3b486'
            };

            const color = d3.scaleOrdinal()
                .domain(Object.keys(typeColors))
                .range(Object.values(typeColors));

            let size = d3.scaleLog()
                .domain([1,75000])
                .range([1,50]);

            let circles = svg.append("g")
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
                .style("stroke-width", 1);

            let simulation = d3.forceSimulation<Data>(data)
                .force("center", d3.forceCenter().x(width / 2).y(height / 2))
                .force("charge", d3.forceManyBody<Data>().strength(.1))
                .force("collide", d3.forceCollide<Data>().strength(.2)
                    .radius((d) => size(d.value) + 3).iterations(1));

            let ToolTip = svg.append("g")
                .selectAll("text")
                .data(data)
                .enter()
                .append("text")
                .attr("class", "tooltip")
                .style("opacity", 1) // Make visible only for Protein
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "2px")
                .style("border-radius", "5px")
                .style("padding", "5px")
                .style("pointer-events", "none");

            let circleDetails = {
                protein: {
                    value: 0,
                    x: 0,
                    y: 0
                },
                gag: {
                    value: 0,
                    x: 0,
                    y: 0
                },
                pfrag: {
                    value: 0,
                    x: 0,
                    y: 0
                },
                smallmolecule: {
                    value: 0,
                    x: 0,
                    y: 0
                }
            }
            const getDisplayName = (name: string) => {
                if(name === 'LIPID') {
                    return 'Lipid';
                } else if(name === 'SmallMolecules') {
                    return 'SmallMolecule'
                } else {
                    return name;
                }
            }

            simulation.on("tick", () => {
                if (!svgRef) return;
                circles
                    .attr("cx", (d) => {
                        let x = d.x || 0;
                        return x;
                    })
                    .attr("cy", (d) => {
                        let y = d.y ? d.y + 5 : d.y || 0;
                        return y;
                    });

                circles.each(function (d) {
                    const circle = d3.select(this);
                    const x = parseFloat(circle.attr("cx"));
                    const y = parseFloat(circle.attr("cy"));
                    circleDetails.protein = {
                        value: d.value,
                        x: x,
                        y: y
                    }

                    ToolTip
                        .text(d => getDisplayName(d.type) + ` : ${d.value}`)
                            .attr("x", (d) => {
                                if(d.type === "SPEP") {
                                    return (d.x || 0) + size(d.value) - 70;
                                } else if(d.type === "SmallMolecules") {
                                    return (d.x || 0) + size(d.value) - 130;
                                } else if(d.type === "GAG") {
                                    return (d.x || 0) + size(d.value) - 95;
                                } else if(d.type === "LIPID") {
                                    return (d.x || 0) + size(d.value) - 60;
                                } else {
                                    return (d.x || 0) + size(d.value) + 5;
                                }
                            })
                            .attr("y", (d) => {
                                if(d.type === "LIPID") {
                                    return (d.y || 0) + 15;
                                } else {
                                    return (d.y || 0) + 5;
                                }
                            })
                            .attr("font-size", "12px")
                            .attr("font-weight", "bold");
                });

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
