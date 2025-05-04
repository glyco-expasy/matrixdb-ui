import React, { useEffect, useRef } from "react";
import * as d3 from 'd3';
import HumanIcon from '../../assets/images/species/human_bullet.svg';
import MouseIcon from '../../assets/images/species/mouse_bullet.svg';
import BovinIcon from '../../assets/images/species/bovine_bullet.svg';
import SheepIcon from '../../assets/images/species/sheep_bullet.svg';
import GuinePigIcon from '../../assets/images/species/guineapig_bullet.svg';
import ChickenIcon from '../../assets/images/species/chicken_bullet.svg';
import BacteriumIcon from '../../assets/images/species/flavobacterium_bullet.svg';
import DogIcon from '../../assets/images/species/dog_bullet.svg';
import ZebraIcon from '../../assets/images/species/fish_bullet.svg';
import RatIcon from '../../assets/images/species/rat_bullet.svg';
import PigIcon from '../../assets/images/species/pig_bullet.svg';
import RabbitIcon from '../../assets/images/species/rabbit_bullet.svg';
import HIVIcon from '../../assets/images/species/hiv_bullet.svg';


interface DataPoint {
    group: string;
    [key: string]: number | string;
}


const BiomoleculeBySpeciesComponent:  React.FC<any> = (props) => {
    const svgRef = useRef<HTMLDivElement>(null);
    const {biomoleculeStatistics} = props;

    useEffect(() => {
        if(biomoleculeStatistics.length === 0) return;
        if (svgRef.current) {
            // Arrange data
            let groups = ["Protein", "Multimer", "PFRAG"];
            let subgroups : string[] = [];
            let data: DataPoint[] = [];
            biomoleculeStatistics.forEach((biomoleculeStats: any) => {
                if(biomoleculeStats.type === 'Protein'
                    || biomoleculeStats.type === 'Multimer'
                    || biomoleculeStats.type === 'PFRAG') {
                    let dataValue: DataPoint = {
                        group: biomoleculeStats.type
                    };
                    Object.keys(biomoleculeStats.bySpecies).forEach((speciesId: string) => {
                        if(speciesId !== '984' && speciesId !== '10144') {
                            dataValue[speciesId] = Math.log10(biomoleculeStats.bySpecies[speciesId].count);
                        }
                    });
                    data.push(dataValue);
                    subgroups.unshift(...Object.keys(biomoleculeStats.bySpecies));
                }
            });
            subgroups = [...new Set(subgroups)];

            const margin = { top: 20, right: 30, bottom: 100, left: 100 };
            const width = 400 - margin.left - margin.right;
            const height = 200 - margin.top - margin.bottom;

            const svg = d3.select(svgRef.current)
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)

            // Y scale
            const y = d3.scaleBand()
                .domain(groups)
                .range([0, height]);

            // X scale
            const x = d3.scaleLinear()
                .domain([0, d3.max(data, d => d3.sum(subgroups.map(key => +d[key]))) || 60])
                .range([0, width]);

            // Color palette
            const legendData = [
                { index: 0, label: 'Human', color: '#e41a1c', icon: HumanIcon },
                { index: 1, label: 'Mouse', color: '#377eb8', icon: MouseIcon },
                { index: 2, label: 'Bovine', color: '#4daf4a', icon: BovinIcon },
                { index: 3, label: 'Sheep', color: '#984ea3', icon: SheepIcon },
                { index: 4, label: 'Guinea Pig', color: '#ff7f00', icon: GuinePigIcon },
                { index: 5, label: 'Chicken', color: '#ffff33', icon: ChickenIcon },
                { index: 6, label: 'Dog', color: '#a65628', icon: DogIcon },
                { index: 7, label: 'Zebra Fish', color: '#999999', icon: ZebraIcon },
                { index: 8, label: 'Rat', color: '#66c2a5', icon: RatIcon },
                { index: 9, label: 'Pig', color: '#8da0cb', icon: PigIcon },
                { index: 10, label: 'Rabit', color: '#8da0cb', icon: RabbitIcon }
            ];
            const speciesNameMapping = {
                7955 : 'Zebra Fish',
                9606 : 'Human',
                9615 : 'Dog',
                9823 : 'Pig',
                9913 : 'Bovine',
                9940 : 'Sheep',
                9031 : 'Chicken',
                9986: 'Rabbit',
                10090 : 'Mouse',
                10116 : 'Rat',
                44689: 'Dictyostelium discoideum'
            }
            const color = d3.scaleOrdinal()
                .domain(legendData.map((legend: any) => legend.label))
                .range(legendData.map((legend: any) => legend.color));

            const legendTooltip = d3.select(svgRef.current)
                .append("div")
                .style("opacity", 0)
                .attr("class", "tooltip")
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "2px")
                .style("border-radius", "5px")
                .style("padding", "5px");

            // Stack the data
            const stackedData = d3.stack<DataPoint, string>()
                .keys(subgroups)
                .order(d3.stackOrderNone)
                .offset(d3.stackOffsetNone)
                (data);

            svg.append("g")
                .attr("transform", `translate(${margin.left-30},${margin.top -20})`)
                .selectAll("g")
                .data(stackedData)
                .enter()
                .append("g")
                    .attr("fill", d => color(d.key) as string)
                    .on("mouseover", function(event, d) {
                        legendTooltip
                            .style("opacity", 1);
                    })
                    .on("mousemove", function(event, d) {
                        /*let sum = Object.keys(d.data).map((sid: any) => {
                            if(sid !== 'group' && d.data[sid]) {
                                return Number(d.data[sid]);
                            } else {
                                return 0;
                            }
                        }).reduce((a: number, b: number) => a + b, 0);
                        let percentage = Math.ceil(((d[1]-d[0])/sum) * 100);
                        let subgroup = 'Human';*/
                        legendTooltip
                            .html( '<span>'+"subgroup" +' : '+"percentage"+'%</span>')
                            .style("left", (event.pageX + 20) + "px")
                            .style("top", (event.pageY) + "px");
                    })
                    .on("mouseout", function(event, d) {
                        legendTooltip
                            .style("opacity", 0);
                    })
                    .selectAll("rect")
                    .data(d => d)
                    .enter()
                        .append("rect")
                            .attr("y", d => y(d.data.group)  || 0)
                            .attr("x", d => x(d[0]))
                            .attr("dy", ".35em")
                            .attr("height", y.bandwidth() * 0.95)
                            .attr("width", d => x(d[1]) - x(d[0]))

            let legend = svg.append("g")

            legend.selectAll("g")
                .attr("transform", `translate(${margin.left},${margin.top})`)
                .data(legendData)
                .enter()
                .append("rect")
                .attr("x", d => d.index * 30 + 60)
                .attr("y", 100)
                .attr("width", 30)
                .attr("height", 30)
                .style("fill", d => color(d.label) as string)
                .on("mouseover", function(event, d) {
                    legendTooltip
                        .style("opacity", 1);
                })
                .on("mousemove", function(event, d) {
                    legendTooltip
                        .html( d.label)
                        .style("left", (event.pageX + 20) + "px")
                        .style("top", (event.pageY) + "px");
                })
                .on("mouseout", function(event, d) {
                    legendTooltip
                        .style("opacity", 0);
                });


            legend.selectAll("g")
                .attr("transform", `translate(${margin.left},${margin.top})`)
                .data(legendData)
                .enter()
                .append("image")
                .attr("x", d => d.index * 20 + 60)
                .attr("y", 105)
                .attr("xlink:href", d => d.icon)
                .attr("width", 40)
                .attr("height", 40)

            svg.selectAll(".label")
                .attr("transform", `translate(${margin.left},${margin.top})`)
                .data(groups)
                .enter()
                .append("text")
                .attr("class", "label")
                .attr("x", d => 40)
                .attr("y", d => y(d)! + y.bandwidth() / 2)
                .attr("dy", ".35em")
                .attr("text-anchor", "end")
                .attr("alignment-baseline", "middle")
                .text(d => d)
                .style("font-size", "10px")
                .style("font-family", "Arial");

            svg.selectAll("path,line").remove();
            svg.selectAll("g.tick").remove();

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
            paddingTop: '40px'
        }}>
            <div ref={svgRef}></div>
        </div>
    );
}

export default BiomoleculeBySpeciesComponent;
