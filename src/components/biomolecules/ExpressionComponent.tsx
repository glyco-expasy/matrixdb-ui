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
        background: 'rgba(255, 255, 255, 0.9)',
        boxShadow: '3px 3px 8px rgba(0, 0, 0, 0.3)',
        padding: '16px',
        height: '550px',
        width: '100%',
        borderRadius: 0
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
                if(biomolecule.molecular_details && biomolecule.molecular_details.component) {
                    biomoleculeIds = Array.isArray(biomolecule.molecular_details.component) ?
                        biomolecule.molecular_details.component :
                        [biomolecule.molecular_details.component];
                }
            }

            http.post("/biomolecules/proteins/expressions/", biomoleculeIds)
                .then((expressionDataResponse) => {
                    let geneExpressionData = new Array<any>;

                    // Extract all tissue data
                    let maxTPM = 0;
                    let uberonTissuesNameSet = new Set<string>();
                    let uberonTissueIdSet = new Set<string>();
                    Object.keys(expressionDataResponse.data).forEach((protein: string) => {
                        interface ExpressionData {
                            expressions: { [key: string]: number };
                            protein: string;
                            gene: string;
                            maxTPM: number
                        }

                        let expressionData: ExpressionData = {
                            expressions: {},
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
                        Object.keys(parsedProteomicsExpressionData)
                            .map((key: string) => parsedProteomicsExpressionData[key].length)
                            .reduce((shouldDisplay: boolean, isEmpty: boolean) => shouldDisplay && isEmpty, true)) {
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
    }

    const ColorLegend: React.FC<ColorLegendProps> = ({ maxScore }) => {
        const gradientColors: string[] = [];

        // Generate gradient colors based on score calculation
        for (let score = 0; score <= maxScore; score++) {
            const color = `rgb(${Math.floor(175 + (-175 / maxScore) * score)}, ${Math.floor(208 + (-208 / maxScore) * score)}, ${Math.floor((145 / maxScore) * score + 95 * maxScore)})`;
            gradientColors.push(color);
        }

        const gradient = `linear-gradient(to right, rgb(220, 220, 220), ${gradientColors.join(', ')})`;

        return (
            <div style={{ position: 'relative', width: '300px' }}>
                <div style={{ fontSize: '14px', position: 'absolute', top: 0, left: 0 }}>0</div>
                <div style={{ fontSize: '14px', position: 'absolute', top: 0, right: 0 }}>{Math.round(maxScore)}</div>
                <div className="color-legend" style={{ height: '15px', background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '10px', color: 'black' }}>TPM</span>
                </div>
            </div>
        );
    };

    const ExpressionBox: React.FC<{ unit: string, tissue: string; protein: string; gene: string; score: number, maxScore: number }> =
        ({ unit, tissue, protein, gene, score, maxScore }) => {
        const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
        const [hidePopOver, setHidePopOver] = useState<boolean>(true);

        const backgroundColor = score === 0
            ? 'rgb(220, 220, 220)'
            : `rgb(${Math.floor(175+(-175/maxScore)*score)},${Math.floor(208+(-208/maxScore)*score)},${Math.floor((145/maxScore)*score + 95*maxScore)})`

        const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
            setAnchorEl(event.currentTarget);
            setHidePopOver(false);
        };

        const handleMouseLeave = () => {
            setAnchorEl(null);
            setHidePopOver(true);
        };

        return (
            <Box
                key={tissue}
                sx={{ position: 'relative', paddingRight: '7px' }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <Box
                    component="div"
                    sx={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: {backgroundColor},
                        cursor: 'pointer',
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
                            <Typography variant={'body2'}>{sample}</Typography>
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: 'row',
                            paddingBottom: '2px'
                        }}>
                            {tissues && tissues.map((tissue: string, innerIndex: number) => (
                                    <>
                                        <ExpressionBox
                                            unit={unit}
                                            key={innerIndex}
                                            tissue={tissue}
                                            protein={protein}
                                            gene={gene}
                                            score={expressionSamples[sample][tissue] ? expressionSamples[sample][tissue] : 0 }
                                            maxScore={maxScore}
                                        />
                                    </>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const GeneExpressionComponent: React.FC<any> = () => {
        return(
            <div style={{ display: 'flex' }}>
                <div style={{ width: '200px', paddingTop: '20px'}}>
                    <Anatomogram
                        species={'homo_sapiens'}
                        atlasUrl={'/'}
                        showIds={uberonTissueIds} />
                </div>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <div style={{ flex: 1 , paddingTop: '150px', paddingLeft: '150px', maxHeight: '60px'}}>
                        <>
                            {
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    {
                                        uberonTissues &&
                                        uberonTissues.map((tissue: string) => {
                                        return (
                                            <div
                                                key={tissue}
                                                style={{ position: 'relative', paddingRight: '7px' }}
                                            >
                                                <div
                                                    style={{
                                                        width: '20px',
                                                        height: '40px',
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
                                                      {tissue}
                                                    </span>
                                                </div>
                                            </div>
                                    )
                                })
                                    }
                                </div>
                            }
                            {
                                geneExpressionData.map((data: any) => {
                                    const protein = data.protein;
                                    const gene = data.gene;
                                    const maxTPM = data.maxTPM;
                                    return(
                                        <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '5px' }}>

                                        {
                                            Object.keys(data.expressions).map((key: string) => {
                                                let value : number;
                                                if(key in data.expressions) {
                                                    value = data.expressions[key];
                                                } else {
                                                    value = 0;
                                                }
                                                return (
                                                    <ExpressionBox
                                                        unit="TPM"
                                                        tissue={key}
                                                        protein={protein}
                                                        gene={gene}
                                                        score={value}
                                                        maxScore={maxTPM}
                                                    />
                                                );
                                            })
                                        }
                                        </div>
                                    )
                                })
                            }
                            {geneExpressionData && geneExpressionData[0].maxTPM &&
                                <div style={{
                                    justifyContent: 'end',
                                    paddingBottom: '5px',
                                    paddingTop: '60px'
                                }}>
                                    <ColorLegend maxScore={geneExpressionData[0].maxTPM}/>
                                </div>
                            }
                        </>
                    </div>
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
                                <div style={{ display: 'flex', alignItems: 'center', background: '#e1ebfc' }}>
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
                        <div style={{ display: 'flex', alignItems: 'center', background: '#e1ebfc' }}>
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