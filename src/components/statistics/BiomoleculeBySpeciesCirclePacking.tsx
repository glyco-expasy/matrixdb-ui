import React, {useRef, useEffect, useState} from 'react';
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

// Define the type for the data
type DataNode = {
    name: string;
    children?: DataNode[];
    value?: number;
    percentage?: number;
    icon?: string;
};

const getSpeciesIcon = (speciesName: string) => {
    const speciesIcons: { [key: string]: string } = {
        'Homo sapiens': HumanIcon,
        'Mus musculus': MouseIcon,
        'Rattus norvegicus': RatIcon,
        'Bos taurus': BovinIcon,
        'Canis lupus familiaris': DogIcon,
        'Sus scrofa': PigIcon,
        'Oryctolagus cuniculus (Rabbit)': RabbitIcon,
        'Ovis aries': SheepIcon,
        'Dictyostelium discoideum': BacteriumIcon,
        'Danio rerio': ZebraIcon,
        'Cavia cutleri': GuinePigIcon,
        'Pedobacter heparinus': 'bacterium_icon',
        'Gallus gallus': ChickenIcon,
        'Human immunodeficiency virus 1': HIVIcon
    };

    return speciesIcons[speciesName] || 'default_icon';
};

const CirclePacking: React.FC<any> = (props: any) => {

    const [data, setData] =  useState<DataNode | null>( null);
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        let data : DataNode = {
            name: 'root',
            children: []
        };
        props.biomoleculeStatistics.forEach((statisticBySpecies: any) => {
            if(statisticBySpecies.type === 'Protein' || statisticBySpecies.type === 'PFRAG' || statisticBySpecies.type === 'Multimer') {
                let statisticData: DataNode = {
                    name: statisticBySpecies.type,
                    children: []
                }
                let value = 0;
                Object.keys(statisticBySpecies.bySpecies).forEach((speciesId: any) => {
                    let statistic = statisticBySpecies.bySpecies[speciesId];
                    let count = statistic.count;
                    value += count;
                });
                Object.keys(statisticBySpecies.bySpecies).forEach((speciesId: any) => {
                    let statistic = statisticBySpecies.bySpecies[speciesId];
                    let speciesName = statistic.name;
                    let count = statistic.count;
                    if(count > 2 && speciesName !== 'Dictyostelium discoideum') {
                        statisticData.children?.push({
                            name: speciesName,
                            value: Math.log10((count/value) * 100),
                            percentage: Math.ceil((count/value) * 100),
                            icon: getSpeciesIcon(speciesName),
                        });
                    }
                });
                statisticData.value = value;
                data.children?.push(statisticData)
            }
        });
        setData(data);
        console.log(props.biomoleculeStatistics)
    }, [props.biomoleculeStatistics]);

    useEffect(() => {
        if (!svgRef.current) return;

        const width = 932;
        const height = width;

        if(!data) return;
        const pack = (data: DataNode) => d3.pack<DataNode>()
            .size([width, height])
            .padding(3)(
                d3.hierarchy(data)
                    .sum(d => d.value || 0)
                    .sort((a, b) => (b.value || 0) - (a.value || 0))
            );

        const root = pack(data);
        let focus = root;
        let view: [number, number, number] = [root.x, root.y, root.r * 2];

        const svg = d3.select(svgRef.current)
            .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
            .style("display", "block")
            .style("margin", "0 -14px")
            .style("cursor", "pointer")
            .on("click", (event) => zoom(event, root));

        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")
            .style("visibility", "hidden");

        const node = svg.append("g")
            .selectAll("circle")
            .data(root.descendants())
            .join("circle")
            .attr("fill", d => {
                if (d.depth === 0) return "none";
                if (d.depth === 2) {
                    const parentName = d.parent?.data.name;
                    if (parentName === 'Protein') return "#FFA07A";
                    if (parentName === 'PFRAG') return "lightyellow";
                    if (parentName === 'Multimer') return "#DDA0DD";
                }
                if (d.depth === 1) {
                    const parentName = d.data.name;
                    if (parentName === 'Protein') return "#f89406";
                    if (parentName === 'PFRAG') return "#f5e214";
                    if (parentName === 'Multimer') return "#6a09c5";
                }
                return "#1f77b4";
            })
            .attr("stroke", d => "black")
            .on("mouseover", function(event, d) {
                if(d && d.depth !== 2) return;
                d3.select(this).select("circle").attr("stroke", "#000");

                    tooltip.style("visibility", "visible")
                        .text(`${d.data.name} : ${d.data.percentage} %`);

            })
            .on("mousemove", function(event) {
                tooltip.style("top", (event.pageY - 10) + "px")
                    .style("left", (event.pageX + 10) + "px");
            })
            .on("mouseout", function() {
                d3.select(this).select("circle").attr("stroke", null);
                tooltip.style("visibility", "hidden");
            })
            .on("click", (event, d) => {
                if (focus !== d) {
                    zoom(event, d);
                    event.stopPropagation();
                }
            });

        const icon = svg.append("g")
            .selectAll("foreignObject")
            .data(root.descendants().filter(d => d.depth === 2))
            .join("foreignObject")
            .attr("width", 40)
            .attr("height", 60)
            .attr("x", d => d.x - 50)
            .attr("y", d => d.y - 80)
            .html(d => {
                return `<div xmlns="http://www.w3.org/1999/xhtml">
                            <img src=${d.data.icon} />
                        </div>`;
            });

        const label = svg.append("g")
            .style("font-size", "30px") // Adjust font size here
            .style("font-family", "sans-serif")
            .style("font-weight", "bold")
            .attr("pointer-events", "none")
            .attr("text-anchor", "middle")
            .selectAll("text")
            .data(root.descendants())
            .join("text")
            //.style("fill-opacity", d => d.depth === 2 ? 1 : 0)
            .style("display", d => "none")
            .text(d => d.data.name);

        zoomTo([root.x, root.y, root.r * 2], null);

        function zoomTo(v: [number, number, number], d: d3.HierarchyCircularNode<DataNode> | null) {
            const k = width / v[2];
            view = v;

            if(d && d.depth === 2) {
                label
                    .attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k - 20})`)
                    .style("fill-opacity", 1);
            } else {
                label
                    .attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k - 20})`)
                    .style("fill-opacity", 0);
            }

            node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
            node.attr("r", d => d.r * k);

            icon.attr("x", d => (d.x - v[0]) * k - 10)
                .attr("y", d => (d.y - v[1]) * k - 10);
        }

        function zoom(event: any, d: d3.HierarchyCircularNode<DataNode>) {
            focus = d;
            const transition = svg.transition()
                .duration(event.altKey ? 7500 : 750)
                .tween("zoom", () => {
                    const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
                    return (t: number) => zoomTo(i(t), d);
                });

            label
                .filter(function(d) { return d.parent === focus })
                .transition(transition as any) // Add 'as any' here to avoid type errors
                .style("fill-opacity", d => d.depth === 2 ? 1 : 0)
                .on("start", function(d) { if (d.parent === focus) (this as SVGTextElement).style.display = "inline"; })
                .on("end", function(d) { if (d.parent !== focus) (this as SVGTextElement).style.display = "none"; });
        }
    }, [data]);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: '10px'
        }}>
            <svg ref={svgRef} width="400" height="260"></svg>
        </div>
    );
};

export default CirclePacking;
