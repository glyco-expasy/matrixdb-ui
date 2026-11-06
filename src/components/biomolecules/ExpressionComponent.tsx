import React, {useEffect, useRef} from 'react';
import {
    Box, CircularProgress, IconButton,
    Paper,
    Popover,
    Tab,
    Tabs,
    Typography
} from "@mui/material";
import {useState} from "react";
import Anatomogram from "@ebi-gene-expression-group/anatomogram";

import * as d3 from 'd3';
import http from "../../commons/http-commons";
import SelectableList from "../commons/lists/SelectableList";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import HelpDrawerComponent from "../help/HelpDrawerComponent";

interface BarChartData {
    group: string,
    subgroup: {
        [key: string]:  number
    },
    subgroupDetails: string[]
}

interface BarChartProps {
    data: BarChartData[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        // Define the dimensions of the SVG container
        const width = 400;
        const height = 320;
        const margin = {
            top: 20,
            right: 20,
            bottom: 40,
            left: 60
        };

        // Create the SVG container
        const svg = d3.select(svgRef.current)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Find the maximum value in the data for scaling the Y-axis
        const max = Math.max(...data.map((d) => {
            let key = Object.keys(d.subgroup)[0];
            return d.subgroup[key];
        }));
        let subgroups = data.map((d: any) => Object.keys(d.subgroup)[0]);

        // List of groups = species here = value of the first column called group -> I show them on the X axis
        let groups = data.map((d: any) => d.group);

        // Add X axis
        let x = d3.scaleBand()
            .domain(groups)
            .range([0, width])
            .padding(0.2)
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickSize(0));

        // Add Y axis
        let y = d3.scaleLinear()
            .domain([0, max])
            .range([ height, 0 ]);

        svg.append("g")
            .call(d3.axisLeft(y));

        // Another scale for subgroup position?
        let xSubgroup = d3.scaleBand()
            .domain(subgroups)
            .range([0, x.bandwidth()])
            .padding(0.05)

        // color palette = one color per subgroup
        let color = d3.scaleOrdinal()
            .domain(subgroups)
            .range(['#e41a1c','#377eb8','#4daf4a'])

        // Show the bars
        svg.selectAll()
            .data(data)
            .enter()
            .append("g")
            .attr("transform", function(d) {
                return "translate(" + x(d.group) + ",0)";
            })
            .selectAll("rect")
            .data(function(d) {
                return subgroups.map(function(key) {
                    return {
                        key: key,
                        value: d.subgroup[key],
                    };
                });
            })
            .enter()
            .append("rect")
            .attr("x", function(d) {
                return xSubgroup(d.key) as number; // Use xSubgroup to position the bars within each group
            })
            .attr("y", function(d) {
                return y(d.value);
            })
            .attr("width", xSubgroup.bandwidth())
            .attr("height", function(d) {
                return height - y(d.value);
            })
            .attr("fill", function(d) {
                return color(d.key) as string;
            });

    }, [data]);

    return (
        <svg ref={svgRef}></svg>
    );
};


// One colour scale for the tiles, the legend and the anatomogram: light to dark blue on a log scale, so a few very high
// values do not wash out the rest. 0 or missing is grey.
const BLUES = [[222, 235, 247], [158, 202, 225], [66, 146, 198], [8, 81, 156], [8, 48, 107]];
const NO_VALUE_COLOR = 'rgb(220, 220, 220)';

const expressionColor = (score: number, max: number): string => {
    if (!score || score <= 0 || !max || max <= 0) {
        return NO_VALUE_COLOR;
    }
    const t = Math.min(1, Math.log10(1 + score) / Math.log10(1 + max));
    const pos = t * (BLUES.length - 1);
    const i = Math.min(BLUES.length - 2, Math.floor(pos));
    const f = pos - i;
    const c = BLUES[i].map((v, k) => Math.round(v + (BLUES[i + 1][k] - v) * f));
    return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
};

// The anatomogram library paints each organ with inline styles and repaints them on mouse-out, so an organ is tagged with
// its id here and coloured by a stylesheet rule (!important) that those inline styles cannot override.
const resolveOrganElement = (svg: SVGElement, id: string): Element | undefined => {
    const layer = Array.from(svg.getElementsByTagName('g')).find((g) => g.id === 'LAYER_EFO');
    const find = (wanted: string): Element | undefined => {
        const child = layer && Array.from(layer.children).find((c) => c.id === wanted);
        if (!child) {
            return undefined;
        }
        const href = child.attributes.getNamedItem('xlink:href');
        return href ? find(href.value.substring(1)) : child;
    };
    return find(id);
};

interface AnatomogramViewProps {
    ids: string[];
    onTagged: (tagged: string[]) => void;
    onOrganOver: (ids: string[]) => void;
    onOrganOut: () => void;
    onOrganClick: (ids: string[]) => void;
}

// Memoised: the page re-renders on every hover, and re-rendering the library would re-inject the SVG.
const AnatomogramView = React.memo(({ ids, onTagged, onOrganOver, onOrganOut, onOrganClick }: AnatomogramViewProps) => (
    <Anatomogram
        species={'homo_sapiens'}
        atlasUrl={'/'}
        showIds={ids}
        showColour={'#9ecae1'}
        showOpacity={0.9}
        highlightOpacity={0.9}
        onInjected={(error: any, svg: SVGElement) => {
            if (error || !svg) {
                return;
            }
            const tagged: string[] = [];
            ids.forEach((id) => {
                const el = resolveOrganElement(svg, id);
                if (el) {
                    el.setAttribute('data-organ', id);
                    tagged.push(id);
                }
            });
            onTagged(tagged);
        }}
        onMouseOver={onOrganOver}
        onMouseOut={onOrganOut}
        onClick={onOrganClick}
    />
));

function ExpressionComponent(props: any) {

    const {biomolecule, onExpressionLoad} = props;
    const [protein, setProtein] = useState<string>("");
    const [gene, setGene] = useState<string>("");
    const [uberonTissues, setUberonTissues] = useState<Array<string> | []>([]);
    const [uberonTissueIds, setUberonTissueIds] = useState<Array<string> | []>([]);
    const [geneExpressionData, setGeneExpressionData] = useState<any>([]);
    const [proteomicsExpressionData, setProteomicsExpressionData] = useState<any>({});
    const [expressionTypes, setExpressionTypes] = useState<string[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [selectedProtemicsSampleIndex, setSelectedProteomicsSampleIndex] = useState<number | null>(null);
    const [openHelp, setOpenHelp] = useState(false);

    const paperStyle = {
        background: 'var(--mdb-surface)',
        boxShadow: 'var(--mdb-shadow)',
        padding: '16px',
        minHeight: '300px',
        width: '100%',
        borderRadius: 'var(--mdb-radius)'
    };

    useEffect(() => {
        if(biomolecule) {
            // For proteins
            let biomoleculeId = null;
            let biomoleculeIds = []
            if(biomolecule.type === 'protein') {
                 biomoleculeId = biomolecule.id;
                 biomoleculeIds.push(biomoleculeId)
            }

            if(biomolecule.type === 'pfrag') {
                if(biomolecule.relations) {
                    if(Array.isArray(biomolecule.relations.belongs_to)) {
                        biomoleculeId = biomolecule.relations.belongs_to[0];
                        biomoleculeIds.push(biomoleculeId)
                    } else {
                        biomoleculeId = biomolecule.relations.belongs_to;
                        biomoleculeIds.push(biomoleculeId)
                    }
                }
            }

            if(biomolecule.type == 'multimer') {
                const details = biomolecule.molecular_details;
                if(details && details.component) {
                    biomoleculeIds = Array.isArray(details.component) ? details.component : [details.component];
                } else if(details && Array.isArray(details.stochiometry)) {
                    // Multimers list their components as stochiometry [{id, min, max}]; `component` exists on only a few of them.
                    biomoleculeIds = Array.from(new Set<string>(details.stochiometry.map((c: any) => c.id)));
                }
            }

            http.post("/biomolecules/proteins/expressions/", biomoleculeIds)
                .then((expressionDataResponse) => {
                    let geneExpressionData = new Array<any>;

                    // Extract all tissue data
                    let uberonTissuesNameSet = new Set<string>();
                    let uberonTissueIdSet = new Set<string>();
                    Object.keys(expressionDataResponse.data).forEach((protein: string) => {
                        interface ExpressionData {
                            expressions: { [key: string]: number };
                            ids: { [key: string]: string };
                            protein: string;
                            gene: string;
                            maxTPM: number
                        }

                        // the maximum is per protein: it used to be shared, so a protein's scale included the previous ones
                        let maxTPM = 0;
                        let expressionData: ExpressionData = {
                            expressions: {},
                            ids: {},
                            protein: "",
                            gene: "",
                            maxTPM: 0
                        };
                        if(expressionDataResponse.data[protein].geneExpression && expressionDataResponse.data[protein].geneExpression.length > 0) {
                            expressionDataResponse.data[protein].geneExpression.forEach((e:any)=> {
                                let tissueName : string = e.tissue;
                                let tissueId: string = e.tissueId;
                                let tpm = parseFloat(e.tpm);
                                expressionData.expressions[tissueName] = tpm;
                                expressionData.ids[tissueName] = tissueId.replace(':','_');
                                uberonTissuesNameSet.add(tissueName);
                                uberonTissueIdSet.add(tissueId.replace(':','_'));
                                if(maxTPM < tpm) {
                                    maxTPM = tpm;
                                }
                            });
                            expressionData.protein = protein;
                            expressionData.gene = expressionDataResponse.data[protein].gene;
                            expressionData.maxTPM = maxTPM;
                            geneExpressionData.push(expressionData);
                        }
                    })

                    // Sort tissue data
                    let uberonTissues = new Array<string>();
                    uberonTissuesNameSet.forEach((tissue: string) => uberonTissues.push(tissue));
                    uberonTissues = uberonTissues.sort((a: string, b: string) => a.localeCompare(b));
                    setUberonTissues(uberonTissues);
                    setUberonTissueIds(Array.from(uberonTissueIdSet));
                    setGeneExpressionData(geneExpressionData);

                    // Prepare bar chart data
                    let parsedProteomicsExpressionData : {
                        [key:string] : any
                    } = {};
                    Object.keys(expressionDataResponse.data).forEach((protein: string) => {
                        let proteomicsExpressionData = expressionDataResponse.data[protein].proteomicsExpression;
                        let proteomicsExpressionValues: any[] = [];
                        proteomicsExpressionData.forEach((expression: any) => {
                            proteomicsExpressionValues.push({
                                tissue: expression.tissue,
                                score: parseFloat(expression.score),
                                sampleName: expression.sampleName
                            });
                        });
                        parsedProteomicsExpressionData[protein] = proteomicsExpressionValues;
                    });
                    setProteomicsExpressionData(parsedProteomicsExpressionData);
                    setProtein(protein);
                    setGene(gene);

                    let expressionTypes : string[] = [];
                    if(geneExpressionData && geneExpressionData.length > 0) {
                        expressionTypes.push('geneExpression');
                    }

                    if(parsedProteomicsExpressionData && Object.keys(parsedProteomicsExpressionData).length > 0 &&
                        // any component with data (it required every component of a multimer to have some)
                        Object.keys(parsedProteomicsExpressionData).some((key: string) => parsedProteomicsExpressionData[key].length > 0)) {
                        expressionTypes.push('proteomicsExpression');
                    }
                    setExpressionTypes(expressionTypes);
                    setLoaded(true);
                    if(expressionTypes.length !== 0) {
                        onExpressionLoad();
                    }
                });
        }

    }, [biomolecule]);

    interface TabPanelProps {
        children?: React.ReactNode;
        index: number;
        value: number;
    }

    const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
        return (
            <div role="tabpanel" hidden={value !== index}>
                {value === index && <Box p={3}>{children}</Box>}
            </div>
        );
    };

    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const onSampleSelect = (index: number) => {
        setSelectedProteomicsSampleIndex(index);
    };

    interface ExpressionData {
        protein: string;
        gene: string;
        tissue: string;
        score: number;
    }

    interface ColorLegendProps {
        maxScore: number;
        unit?: string;
    }

    const ColorLegend: React.FC<ColorLegendProps> = ({ maxScore, unit = 'TPM' }) => {
        const position = (v: number) => (Math.log10(1 + v) / Math.log10(1 + maxScore)) * 100;
        const stops = Array.from({ length: 12 }, (_, i) => expressionColor(Math.pow(1 + maxScore, i / 11) - 1, maxScore));
        const ticks = [0, 1, 10, 100, 1000, 10000].filter((v) => v < maxScore * 0.92);

        return (
            <div style={{ width: '300px' }}>
                <div style={{ fontSize: '12px', marginBottom: '4px' }}>
                    {unit === 'TPM' ? 'TPM, log scale (highest sample per tissue)' : `${unit}, log scale`}
                </div>
                <div style={{ height: '12px', background: `linear-gradient(to right, ${stops.join(', ')})`, border: '1px solid #bbb' }}/>
                <div style={{ position: 'relative', height: '16px', fontSize: '11px' }}>
                    {ticks.map((v) => (
                        <span key={v} style={{ position: 'absolute', left: `${position(v)}%`, transform: 'translateX(-50%)' }}>{v}</span>
                    ))}
                    <span style={{ position: 'absolute', right: 0 }}>{Math.round(maxScore)}</span>
                </div>
                <div style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ display: 'inline-block', width: '10px', height: '10px', background: NO_VALUE_COLOR, border: '1px solid #bbb' }}/>
                    no expression
                </div>
            </div>
        );
    };

    const ExpressionBox: React.FC<{ unit: string, tissue: string; protein: string; gene: string; score: number, maxScore: number,
        focused?: boolean, fluid?: boolean, onFocus?: (tissue: string | null) => void }> =
        ({ unit, tissue, protein, gene, score, maxScore, focused, fluid, onFocus }) => {
        const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
        const [hidePopOver, setHidePopOver] = useState<boolean>(true);

        const backgroundColor = expressionColor(score, maxScore);

        const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
            setAnchorEl(event.currentTarget);
            setHidePopOver(false);
            onFocus && onFocus(tissue);
        };

        const handleMouseLeave = () => {
            setAnchorEl(null);
            setHidePopOver(true);
            onFocus && onFocus(null);
        };

        return (
            <Box
                key={tissue}
                sx={{ position: 'relative', paddingRight: fluid ? 0 : '7px' }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <Box
                    component="div"
                    sx={{
                        width: fluid ? '100%' : '20px',
                        height: '20px',
                        backgroundColor,
                        cursor: 'pointer',
                        outline: focused ? '2px solid #000' : 'none',
                        outlineOffset: '1px',
                    }}
                />
                {
                    !hidePopOver &&
                    <ExpressionPopOver
                        unit={unit}
                        anchorEl={anchorEl}
                        expressionData={{ protein, gene, tissue, score }}
                        handleMouseLeave={handleMouseLeave}
                    />
                }
            </Box>
        );
    };

    const ExpressionPopOver: React.FC<{
        unit: string,
        anchorEl: HTMLElement | null;
        expressionData: ExpressionData;
        handleMouseLeave: () => void
    }> = ({ unit, anchorEl, expressionData, handleMouseLeave }) => {
        const open = Boolean(anchorEl);

        return (
            <Popover
                id="simple-popover"
                open={open}
                anchorEl={anchorEl}
                onClose={handleMouseLeave}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                onMouseLeave={handleMouseLeave}
            >
                <Paper sx={{ padding: '10px' }}>
                    <Typography>
                        Protein: {expressionData.protein}
                    </Typography>
                    {expressionData.gene && <Typography>
                        Gene: {expressionData.gene}
                    </Typography>}
                    <Typography>
                        Tissue: {expressionData.tissue}
                    </Typography>
                    { unit &&
                        <Typography>
                            {unit}: {expressionData.score.toFixed(2)}
                        </Typography>
                    }
                </Paper>
            </Popover>
        );
    };

    const ExpressionTissueHeader: React.FC<any> = ({ tissueNames }) => {

        return(
            <div style={{
                display: 'flex',
            }}>
                <div style={{
                    width: '40%',
                    marginRight: '30px'
                }}/>
                {tissueNames.map((tissueName: string) => {
              return(
                  <div
                      key={tissueName}
                      style={{
                          position: 'relative',
                          paddingRight: '25px',
                          paddingBottom: '5px',
                          flexDirection: 'row'
                  }}
                  >
                      <span
                          style={{
                              fontSize: '12px',
                              position: 'absolute',
                              top: '-10px',
                              left: '9px',
                              transform: 'rotate(-45deg)',
                              transformOrigin: 'left bottom',
                              width: '200px'
                          }}
                      >
                        {tissueName}
                      </span>
                  </div>
              )
            })}
            </div>
        )
    };

    interface ExpressionSamples {
        [key: string] : {
            [key:string] : number
        }
    }

    const groupBy = (list: any[], property: string) => {
        return list.reduce((acc, obj) => {
            const key = obj[property];
            if (!acc[key]) {
                acc[key] = {};
            }
            acc[key][obj['tissue']] = obj['score'];
            return acc;
        }, {});
    }

    interface ExpressionTrackProps {
        protein: string,
        unit: string,
        tissues: string[],
        expressionSamples: ExpressionSamples
    }
    const ExpressionTrackComponent: React.FC<ExpressionTrackProps> = ( props ) => {

        const { protein, unit, tissues, expressionSamples} = props;
        const [maxScore, setMaxScore] = useState<number>(0);

        useEffect(() => {
            if(expressionSamples) {
                let maxScore = 0;
                Object.keys(expressionSamples).forEach((sample: string) => {
                    for(let tissue of Object.keys(expressionSamples[sample])){
                        let score = expressionSamples[sample][tissue];
                        if(score > maxScore) maxScore = score;
                    }
                })
                setMaxScore(maxScore);
            }
        }, [expressionSamples]);

        return (
            <>
            {maxScore > 0 && <div style={{ padding: '4px 0 10px 0' }}><ColorLegend maxScore={maxScore} unit="NSAF"/></div>}
            <div style={{ maxHeight: '300px', overflowY: 'auto'}}>
                {expressionSamples && Object.keys(expressionSamples).map((sample:string, index: number) => (
                    <div key={index}
                        style={{
                            maxHeight: '60px',
                            display: 'flex',
                            flexDirection: 'row'
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                width: '40%',
                                marginRight: '20px',
                                maxHeight: '300px',
                                overflowY: "auto",
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                position: 'relative',
                            }}
                            title={sample}
                        >
                            <Typography variant={'body2'} noWrap sx={{ minWidth: 0, flex: 1 }}>{sample}</Typography>
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: 'row',
                            paddingBottom: '2px'
                        }}>
                            {tissues && tissues.map((tissue: string, innerIndex: number) => (
                                <ExpressionBox
                                    unit={unit}
                                    key={innerIndex}
                                    tissue={tissue}
                                    protein={protein}
                                    gene={gene}
                                    score={expressionSamples[sample][tissue] ? expressionSamples[sample][tissue] : 0 }
                                    maxScore={maxScore}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            </>
        );
    };

    const GeneExpressionComponent: React.FC<any> = () => {
        const [activeIndex, setActiveIndex] = useState<number>(0);
        const [hovered, setHovered] = useState<string | null>(null);
        const [pinned, setPinned] = useState<string | null>(null);
        const [taggedOrgans, setTaggedOrgans] = useState<string[]>([]);

        const data: any = geneExpressionData[Math.min(activeIndex, geneExpressionData.length - 1)];
        const focus = hovered !== null ? hovered : pinned;

        // organ id <-> tissue name for the shown protein
        const organIds: string[] = Object.keys(data.ids).map((tissue: string) => data.ids[tissue]);
        const tissueByOrgan: { [organ: string]: string } = {};
        Object.keys(data.ids).forEach((tissue: string) => { tissueByOrgan[data.ids[tissue]] = tissue; });

        const organRules = Object.keys(data.expressions).map((tissue: string) =>
            `.anatomogram-host [data-organ="${data.ids[tissue]}"] { fill: ${expressionColor(data.expressions[tissue], data.maxTPM)} !important; fill-opacity: 0.95 !important; }`
        ).join('\n');
        const focusedOrgan = focus ? data.ids[focus] : null;
        const focusRule = focusedOrgan
            ? `.anatomogram-host [data-organ="${focusedOrgan}"] { stroke: #111 !important; stroke-width: 1.2px !important; }`
            : '';

        // stable handlers, so the memoised anatomogram is not re-rendered on every hover
        const organNameRef = useRef<{ [organ: string]: string }>({});
        organNameRef.current = tissueByOrgan;
        const onOrganOver = React.useCallback((ids: string[]) => {
            const name = ids.map((id) => organNameRef.current[id]).find((n) => n);
            setHovered(name ? name : null);
        }, []);
        const onOrganOut = React.useCallback(() => setHovered(null), []);
        const onOrganClick = React.useCallback((ids: string[]) => {
            const name = ids.map((id) => organNameRef.current[id]).find((n) => n);
            setPinned((current) => (name && current !== name ? name : null));
        }, []);
        const idsKey = organIds.join(',');
        const memoIds = React.useMemo(() => organIds, [idsKey]);

        const value = focus ? data.expressions[focus] : undefined;
        const missingOrgans = Object.keys(data.ids).filter((t: string) => taggedOrgans.length > 0 && !taggedOrgans.includes(data.ids[t]));

        return (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'flex-start' }}>
                <div className="anatomogram-host" style={{ flex: '0 0 300px', width: '300px' }}>
                    <style>{organRules + '\n' + focusRule}</style>
                    <AnatomogramView
                        ids={memoIds}
                        onTagged={setTaggedOrgans}
                        onOrganOver={onOrganOver}
                        onOrganOut={onOrganOut}
                        onOrganClick={onOrganClick}
                    />
                    <div style={{ minHeight: '46px', padding: '6px 8px', background: '#f3f6fb', border: '1px solid #d6dfef', fontSize: '13px' }}>
                        {focus
                            ? <><b>{focus}</b><br/>{value !== undefined ? `${value.toFixed(2)} TPM` : 'no data'}{data.gene ? ` (${data.gene})` : ''}</>
                            : 'Hover or click an organ or a tile to see its value.'}
                    </div>
                </div>

                <div style={{ flex: '1 1 520px', minWidth: 0 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'flex-end', paddingBottom: '8px' }}>
                        {data.maxTPM > 0 && <ColorLegend maxScore={data.maxTPM}/>}
                        {geneExpressionData.length > 1 &&
                            <div style={{ fontSize: '13px' }}>
                                Protein:&nbsp;
                                {geneExpressionData.map((d: any, i: number) => (
                                    <span
                                        key={d.protein}
                                        onClick={() => setActiveIndex(i)}
                                        style={{
                                            cursor: 'pointer', marginRight: '6px', padding: '2px 8px', borderRadius: '10px',
                                            border: '1px solid #9aa9c7', background: i === activeIndex ? 'var(--mdb-section-bg)' : 'white'
                                        }}
                                    >{d.protein}</span>
                                ))}
                            </div>}
                    </div>

                    <div style={{ overflowX: 'auto', paddingTop: '150px', paddingRight: '90px' }}>
                        <div style={{ minWidth: `${uberonTissues.length * 20}px` }}>
                            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${uberonTissues.length}, minmax(18px, 1fr))`, columnGap: '4px', position: 'relative', height: '0px' }}>
                                {uberonTissues.map((tissue: string) => (
                                    <div key={tissue} style={{ position: 'relative' }}>
                                        <span
                                            style={{
                                                fontSize: '12px', position: 'absolute', bottom: '8px', left: '6px', whiteSpace: 'nowrap',
                                                transform: 'rotate(-45deg)', transformOrigin: 'left bottom',
                                                fontWeight: focus === tissue ? 700 : 400
                                            }}
                                        >{tissue}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${uberonTissues.length}, minmax(18px, 1fr))`, columnGap: '4px', paddingTop: '10px' }}>
                                {uberonTissues.map((tissue: string) => (
                                    <ExpressionBox
                                        key={tissue}
                                        unit="TPM"
                                        tissue={tissue}
                                        protein={data.protein}
                                        gene={data.gene}
                                        score={data.expressions[tissue] ? data.expressions[tissue] : 0}
                                        maxScore={data.maxTPM}
                                        focused={focus === tissue}
                                        fluid
                                        onFocus={setHovered}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    {missingOrgans.length > 0 &&
                        <div style={{ fontSize: '11px', color: '#666', paddingTop: '10px' }} title={missingOrgans.join(', ')}>
                            {missingOrgans.length} of {uberonTissues.length} tissues have no region on the body map; they are shown by the tiles only.
                        </div>}
                </div>
            </div>
        )
    };

    const ProteomicsExpressionComponent: React.FC<any> = ({ proteomicsExpressionData }) => {

        const [expressionSamplesByProtein, setExpressionSamplesByProtein] = useState<any>({});
        const [selectedProtein, setSelectedProtein] = useState<string>();
        const [tissueNames, setTissueNames] = useState<string[]>([]);

        useEffect(() => {
            if(proteomicsExpressionData) {
                let expressionSamplesByProtein: any = {};
                let tissueSet = new Set<string>();

                Object.keys(proteomicsExpressionData).forEach((protein: string) => {
                    // Collects the tissue name set
                    proteomicsExpressionData[protein].forEach((expressionValue: any) => {
                        tissueSet.add(expressionValue.tissue);
                    })
                });
                let tissues = Array.from(tissueSet).sort((t1: string, t2: string) => t1.localeCompare(t2));

                Object.keys(proteomicsExpressionData).forEach((protein: string) => {
                    // Builds expression samples
                    let groupedExpression = groupBy(proteomicsExpressionData[protein], 'sampleName');

                    expressionSamplesByProtein[protein] = groupedExpression;
                });

                setTissueNames(Array.from(tissueSet));
                setSelectedProtein(Object.keys(proteomicsExpressionData)[0]);
                setExpressionSamplesByProtein(expressionSamplesByProtein);
            }
        },[proteomicsExpressionData]);

        const onProteinChange = (protein: string) => {
            setSelectedProtein(protein);
        }

        return(
            <>
            {
                proteomicsExpressionData && selectedProtein &&
                    (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            paddingTop: '50px'
                        }}>
                            <div style={{
                                display: 'flex',
                                width: '10%',
                                marginRight: '20px'
                            }}>
                                <SelectableList
                                    selectedItem={selectedProtein}
                                    itemIds={Object.keys(proteomicsExpressionData)}
                                    onItemChange={onProteinChange}
                                    itemURL='/biomolecule/'
                                />
                            </div>
                            <div style={{
                                display: 'flex',
                                width: '70%',
                                marginRight: '20px',
                                flexDirection: 'column'
                            }}>
                                <ExpressionTissueHeader
                                    tissueNames={tissueNames}
                                />
                                <ExpressionTrackComponent
                                    protein={selectedProtein}
                                    unit={"Normalized Spectral Abundance Factor (NSAF)"}
                                    tissues={tissueNames}
                                    expressionSamples={expressionSamplesByProtein[selectedProtein]}
                                />
                            </div>
                        </div>
                    )
            }
            </>
        )
    }

    return (
        <>
            <>

                {
                    (expressionTypes.includes('geneExpression') || expressionTypes.includes('proteomicsExpression')) &&
                    <div>
                        <Paper style={paperStyle}>
                            <>
                                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--mdb-section-bg)' }}>
                                    <span style={{paddingLeft: '10px'}}>
                                        <h3>Expression Data</h3>
                                    </span>
                                    <div style={{
                                        display: "flex",
                                        width: "5%",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginLeft: 'auto'
                                    }}>
                                        <IconButton
                                            onClick={() => setOpenHelp(true)}
                                            size={'small'}
                                        >
                                            <HelpOutlineIcon/>
                                        </IconButton>
                                        <HelpDrawerComponent
                                            helpType="BIOMOLECULE"
                                            open={openHelp}
                                            onClose={() => setOpenHelp(false)}
                                        />
                                    </div>
                                </div>

                                <Tabs value={tabValue} onChange={handleTabChange} centered>
                                    {
                                        expressionTypes.includes('geneExpression') &&
                                        <Tab label="Transcriptomic Data"/>
                                    }
                                    {
                                        expressionTypes.includes('proteomicsExpression') &&
                                        <Tab label="Proteomic Data" />
                                    }
                                </Tabs>
                                {
                                    expressionTypes.map((type: string, index: number) => {
                                        return(
                                            <>
                                                {
                                                    type === 'geneExpression' && expressionTypes.includes('geneExpression')  &&
                                                    <TabPanel value={tabValue} index={index}>
                                                        <GeneExpressionComponent/>
                                                    </TabPanel>
                                                }
                                                {
                                                    type === 'proteomicsExpression' && expressionTypes.includes('proteomicsExpression') &&
                                                    <TabPanel value={tabValue} index={index}>
                                                        <ProteomicsExpressionComponent
                                                            proteomicsExpressionData={proteomicsExpressionData}
                                                        />
                                                    </TabPanel>
                                                }
                                            </>
                                        )
                                    })
                                }
                            </>
                        </Paper>
                    </div>
                }
                {
                    (!expressionTypes.includes('geneExpression') && !expressionTypes.includes('proteomicsExpression')) &&
                    <>
                    </>
                }
                {
                    !loaded &&
                    <Paper style={paperStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--mdb-section-bg)' }}>
                            <div style={{
                                paddingLeft: '20px',
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                <h3 style={{
                                    paddingRight: '5px'
                                }}>
                                    Transcriptomic & Proteomic Data
                                </h3>
                                <CircularProgress
                                    size={25}
                                />
                            </div>
                        </div>
                    </Paper>
                }
            </>
        </>
    );
}

export default ExpressionComponent;