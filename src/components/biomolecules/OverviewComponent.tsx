import React, {useEffect, useState} from 'react';
import {
    Avatar,
    Box, Chip,
    CircularProgress,
    Divider, Grid,
    IconButton,
    Paper, Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow, Tabs,
    Typography
} from "@mui/material";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import XrefListComponent from "./overview/XrefListComponent";
import SpeciesIcon from "../commons/icons/SpeciesIcon";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import HelpDrawerComponent from "../help/HelpDrawerComponent";

interface BiomoleculeToDisplay {
    id: string,
    type: string,
    name: string,
    recommendedName: string,
    image: string | undefined,
    species: string,
    otherNames?: Array<string> | [],
    description: string | undefined,
    structure?: string | undefined,
    location?: string | undefined,
    crossRefs?: any | undefined,
    biologicalProcessing: Array<string>,
    gene: string | undefined,
    molecularDetails: any | undefined,
    interpro: Array<string> | [],
    subcellularLocation: string,
    function?: any,
    relations?: any,
    ecmness?: any,
    ecm?: boolean
}


function OverviewComponent(props: any) {

    const {biomolecule, biomoleculeId} = props;
    const [biomoleculeToDisplay, setBiomoleculeToDisplay] = useState<BiomoleculeToDisplay>();
    const [tabConfig, setTabConfig] = useState<any[]>([]);
    const [isExpanded, setIsExpanded] = useState(true);
    const [openHelp, setOpenHelp] = useState(false);

    useEffect(() => {
        if(!biomolecule) return;

        let biomoleculeToDisplay: BiomoleculeToDisplay = {
            id: "",
            type: "",
            name: "",
            recommendedName: "",
            image: undefined,
            species: "",
            otherNames: [],
            description: undefined,
            location: undefined,
            crossRefs: {},
            biologicalProcessing: [],
            gene: undefined,
            molecularDetails: undefined,
            interpro: [],
            subcellularLocation: ""
        };
        biomoleculeToDisplay.id = biomolecule.id;
        biomoleculeToDisplay.type = biomolecule.type;
        biomoleculeToDisplay.name = biomolecule.names?.name;
        if(biomolecule.names && Array.isArray(biomolecule.names.other_name)) {
            biomoleculeToDisplay.otherNames = biomolecule.names?.other_name;
        } else {
            if(biomolecule.names?.other_name) {
                biomoleculeToDisplay.otherNames = [biomolecule.names?.other_name];
            }
        }
        biomoleculeToDisplay.recommendedName = biomolecule.names?.recommended_name;
        biomoleculeToDisplay.species = biomolecule?.species?.id;
        if(biomolecule.relations) {
            if(Array.isArray(biomolecule.relations.gene_name)) {
                biomoleculeToDisplay.gene = biomolecule.relations.gene_name[0];
            } else {
                biomoleculeToDisplay.gene = biomolecule.relations.gene_name;
            }
        }

        biomoleculeToDisplay.molecularDetails= biomolecule.molecular_details;

        biomoleculeToDisplay.function = biomolecule.annotations?.function;
        biomoleculeToDisplay.relations = biomolecule.relations;
        if(biomolecule.relations?.belongs_to) {
            if(!Array.isArray(biomolecule.relations.belongs_to)) {
                biomolecule.relations.belongs_to = [biomolecule.relations.belongs_to];
            }
        }
        biomoleculeToDisplay.subcellularLocation = biomolecule.annotations?.subcellular_location?.join(",") || biomolecule.annotations?.location;
        biomoleculeToDisplay.structure = biomoleculeToDisplay.molecularDetails?.structure;
        biomoleculeToDisplay.crossRefs = biomolecule.xrefs;
        biomoleculeToDisplay.description = biomolecule.description;

        if(biomolecule.xrefs && biomolecule.xrefs.interpro) {
            biomoleculeToDisplay.interpro = biomolecule.xrefs.interpro;
        }
        if(biomolecule.ecmness) {
            biomoleculeToDisplay.ecmness = biomolecule.ecmness;
        }
        if(biomolecule.ecm) {
            biomoleculeToDisplay.ecm = biomolecule.ecm;
        }

        setBiomoleculeToDisplay(biomoleculeToDisplay);

        // Define the tabs
        let tabConfig = [];

        if(biomoleculeToDisplay && biomoleculeToDisplay.relations && biomoleculeToDisplay.relations.belongs_to) {
            if(biomoleculeToDisplay.type === 'pfrag') {
                tabConfig.push({
                    label: 'Processed From',
                    renderContent: () => {
                        return biomoleculeToDisplay.relations.belongs_to.map((element: string, index: number) => (
                            <div>
                                <a key={index} href={`/biomolecule/${element}`}>
                                    {element}
                                </a>
                            </div>
                        ));
                    }
                });
            }
        }

        if(biomoleculeToDisplay && biomoleculeToDisplay.description) {
            tabConfig.push({label: 'Description', renderContent: () => biomoleculeToDisplay.description })
        }

        if(biomoleculeToDisplay && biomoleculeToDisplay.structure) {
            if(biomoleculeToDisplay.type === 'gag') {
                tabConfig.push({label: 'GAG Sequence', renderContent: () => biomoleculeToDisplay.structure });
            }
        }


        if(biomoleculeToDisplay && biomoleculeToDisplay.subcellularLocation) {
            tabConfig.push({label: 'Cellular Location', renderContent: () => biomoleculeToDisplay.subcellularLocation.replaceAll(',', ', ') });
        }

        if(biomoleculeToDisplay && biomoleculeToDisplay.function) {
            tabConfig.push({
                label: 'Biological Function',
                renderContent: () => biomoleculeToDisplay.function?.text ? biomoleculeToDisplay.function?.text : biomoleculeToDisplay.function
            })
        }

        if(biomoleculeToDisplay && biomoleculeToDisplay.interpro && biomoleculeToDisplay.interpro.length > 0 ) {
            tabConfig.push({
                label: 'Domain Annotations',
                renderContent: () => <XrefListComponent
                    xrefList={biomoleculeToDisplay.interpro}
                    xrefLink={"https://www.ebi.ac.uk/interpro/entry/InterPro/"}
                />
            })
        }

        if(biomoleculeToDisplay?.crossRefs) {
            tabConfig.push({
                label: 'Cross References',
                renderContent: () => (
                    <>
                        {biomoleculeToDisplay.type === 'protein' && renderCrossRefContent('Uniprot', 'http://www.uniprot.org/uniprot/', biomoleculeToDisplay.id)}
                        {biomoleculeToDisplay.type === 'pfrag' && renderCrossRefContent('Uniprot Fragment', 'https://www.uniprot.org/uniprotkb/', biomoleculeToDisplay.crossRefs.uniprot)}
                        {renderCrossRefContent('Complex Portal', 'https://www.ebi.ac.uk/complexportal/complex/', biomoleculeToDisplay.crossRefs.complex_portal)}
                        {renderCrossRefContent('CheBI', 'https://www.ebi.ac.uk/chebi/searchId.do?chebiId=', biomoleculeToDisplay.crossRefs.chebi)}
                        {renderCrossRefContent('EBI', 'https://www.ebi.ac.uk/intact/query/', biomoleculeToDisplay.crossRefs.EBI_xref)}
                        {renderCrossRefContent('GlyTouCan', 'https://glytoucan.org/Structures/Glycans/', biomoleculeToDisplay.crossRefs.glytoucan)}
                    </>
                )
            })
        }
        setTabConfig(tabConfig);
    }, [biomolecule]);

    const renderCrossRefContent = (label : string, link : string, value : string) => {
        return (
            value && (
                <div key={label} style={{ display: 'flex', marginBottom: '8px', paddingTop: '5px', alignItems: 'left' }}>
                    <div style={{ flexBasis: '10%', paddingRight: '10px', alignItems: 'center' }}>
                        <Typography variant={"body2"} style={{color: 'darkblue', fontWeight: 'bold'}}>
                                {label}
                        </Typography>
                    </div>
                    <div style={{ flexBasis: '50%', verticalAlign: 'center' }}>
                        <Typography variant={"body2"}>
                            <a href={link + value} target="_blank" rel="noreferrer">
                                {value}
                            </a>
                        </Typography>
                    </div>
                </div>
            )
        );
    };

    const renderCrossRefListContent = (label : string, link : string, value : any[]) => {
        return (
            <XrefListComponent
                label={label}
                xrefList={value}
                xrefLink={link}
            />
        );
    };

    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
    };

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
    const [molecularDetailTabValue, setMolecularDetailTabValue] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleMDTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setMolecularDetailTabValue(newValue);
    };

    const paperStyle = {
        background: 'rgba(255, 255, 255, 0.9)',
        boxShadow: '3px 3px 8px rgba(0, 0, 0, 0.3)',
        padding: '16px',
        width: '100%',
        borderRadius: 0
    };

    const cellStyles = {
        padding: '0px',
        borderBottom: 'none'
    };

    return (
        <>
            {
                !biomolecule &&
                <Paper style={paperStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', background: '#e1ebfc' }}>
                        <div style={{
                            paddingLeft: '20px',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            <h2 style={{paddingRight: '5px'}}>{biomoleculeId} :</h2>
                            <CircularProgress size={25}/>
                        </div>
                    </div>
                </Paper>
            }
            {
                biomolecule && <Paper style={paperStyle}>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            background: '#e1ebfc'
                        }}
                    >
                        <div style={{ paddingLeft: '20px'}}>
                            <h2>{biomoleculeToDisplay && biomoleculeToDisplay.id} : {biomoleculeToDisplay && biomoleculeToDisplay.name}</h2>
                        </div>
                        {
                            biomoleculeToDisplay && biomoleculeToDisplay.species && 
                            <div style={{ paddingLeft: '20px' }}>
                                <SpeciesIcon
                                    speciesId={biomoleculeToDisplay.species.toString()}
                                    width={'40px'}
                                    height={'40px'}
                                />
                            </div>
                        }
                        <div style={{
                            marginLeft: 'auto',
                            paddingRight: '20px',
                            justifyContent: 'center',
                            textAlign: 'center',
                            paddingTop: '5px'
                        }}>
                            {
                                biomoleculeToDisplay?.ecm &&
                                <div>
                                    <Chip
                                        sx={{
                                            borderColor: 'darkblue',
                                            color: 'darkblue'
                                        }}
                                        size="small"
                                        label="MatrixDB ECM"
                                        variant="outlined"
                                    />
                                </div>
                            }
                            {
                                biomoleculeToDisplay?.ecmness &&
                                <div style={{
                                    paddingTop: '2px'
                                }}>
                                    <Chip
                                        sx={{
                                            borderColor: 'green',
                                            color: 'green',
                                        }}
                                        size="small"
                                        label={`${biomoleculeToDisplay.ecmness.matrisome.division} : ${biomoleculeToDisplay.ecmness.matrisome.category}`}
                                        variant="outlined"
                                    />
                                </div>
                            }
                        </div>
                        <div style={{
                            display: "flex",
                            width: "5%",
                            justifyContent: "center",
                            alignItems: "center"
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
                    <div style={{float: 'right'}}>
                            <IconButton onClick={toggleExpansion}>
                                {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </IconButton>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', width: '60%', paddingLeft: '10%', paddingRight: '10%' }}>
                        <Grid container spacing={0}>
                            <Grid item xs={6}>
                                <TableCell style={{...cellStyles, textAlign: 'right', paddingRight: '10px'}}><h4>Name</h4></TableCell>
                                <TableCell style={cellStyles}>
                                    {
                                        biomoleculeToDisplay?.recommendedName || biomoleculeToDisplay?.name
                                    }
                                </TableCell>
                            </Grid>
                            {biomoleculeToDisplay?.otherNames && biomoleculeToDisplay.otherNames.length > 0 && <Grid item xs={6}>
                                <TableCell style={{...cellStyles, textAlign: 'right', paddingRight: '10px'}}><h4>Other Names</h4></TableCell>
                                <TableCell style={cellStyles}>
                                    {
                                        biomoleculeToDisplay?.otherNames?.map((name, index) => (
                                            <div key={index}>
                                                {name}
                                            </div>
                                        ))
                                    }
                                </TableCell>
                            </Grid>}
                            {biomoleculeToDisplay?.gene && <Grid item xs={6}>
                                <TableCell style={{...cellStyles, textAlign: 'right', paddingRight: '10px'}}><h4>Gene</h4></TableCell>
                                <TableCell style={cellStyles}>
                                    {
                                        biomoleculeToDisplay?.gene
                                    }
                                </TableCell>
                            </Grid>}
                            {biomoleculeToDisplay?.molecularDetails?.sequence_length  && <Grid item xs={6}>
                                <TableCell style={{...cellStyles, textAlign: 'right', paddingRight: '10px'}}><h4>Sequence Length</h4></TableCell>
                                <TableCell style={cellStyles}>
                                    {
                                        biomoleculeToDisplay?.molecularDetails?.sequence_length
                                    }
                                </TableCell>
                            </Grid>}
                            {biomoleculeToDisplay?.molecularDetails?.stochiometry  && <Grid item xs={6}>
                                <TableCell style={{...cellStyles, textAlign: 'right', paddingRight: '10px'}}><h4>Stochiometry</h4></TableCell>
                                {
                                    <TableCell style={cellStyles}>
                                        {
                                            biomoleculeToDisplay.molecularDetails?.stochiometry
                                                    .map((stochiometry: any, index: number) => (
                                                        <span key={index}>
                                                            {`${stochiometry.min} `}
                                                            <a href={`/biomolecule/${stochiometry.id}`}>
                                                                {stochiometry.id}
                                                            </a>
                                                        </span>
                                                    ))
                                                    .reduce((prev: any, curr: any) => [prev, ' + ', curr])
                                        }
                                    </TableCell>
                                }
                            </Grid>}
                        </Grid>
                    </div>
                    { isExpanded &&
                        <>
                            <Tabs value={tabValue} onChange={handleTabChange}>
                                {tabConfig.map((config, index) => (
                                        <Tab key={index} label={<Typography variant="h6" style={{ textTransform: 'none', fontSize: '1rem' }}>{config.label}</Typography>} />
                                    )
                                )}
                            </Tabs>
                            {tabConfig.map((config, index) => (
                                    <TabPanel key={index} value={tabValue} index={index}>
                                        <>
                                            <div style={{ flexBasis: '40%', paddingRight: '10px', alignItems: 'center' }}>
                                                <Typography variant="body2">
                                                    {config.renderContent()}
                                                </Typography>
                                            </div>
                                        </>
                                    </TabPanel>
                                ))
                            }
                        </>    
                    }
                    {
                        isExpanded && biomoleculeToDisplay && biomoleculeToDisplay.type === 'gag' &&
                        <>
                            <Tabs value={molecularDetailTabValue} onChange={handleMDTabChange}>
                                {biomoleculeToDisplay.molecularDetails?.snfg &&
                                    <Tab key={0} label={<Typography variant="h6" style={{ textTransform: 'none', fontSize: '1rem' }}>
                                        Symbol Nomenclature For Glycans
                                    </Typography>} />
                                }
                                {biomoleculeToDisplay.molecularDetails?.glycoCT &&
                                    <Tab key={1} label={<Typography variant="h6" style={{ textTransform: 'none', fontSize: '1rem' }}>
                                        GlycoCT
                                    </Typography>} />
                                }
                            </Tabs>
                            {biomoleculeToDisplay.molecularDetails?.snfg &&
                                <TabPanel key={0} value={molecularDetailTabValue} index={0}>
                                    <div style={{paddingTop: '10px'}}>
                                        <Paper style={{ width: '400px'}}>
                                            <img src={process.env.REACT_APP_PUBLIC_URL + "img/snfg_img/"+biomoleculeToDisplay.molecularDetails?.snfg} style={{ width: '400px'}}/>
                                        </Paper>
                                    </div>
                                </TabPanel>
                            }
                            {biomoleculeToDisplay.molecularDetails?.glycoCT &&
                                <TabPanel key={1} value={molecularDetailTabValue} index={1}>
                                    <div style={{paddingTop: '10px'}}>
                                        <Paper style={{ width: '400px', maxHeight: '200px', overflow: 'auto'}}>
                                            {
                                                biomoleculeToDisplay.molecularDetails?.glycoCT.split('@').map((line: string, index: number) => (
                                                    <Typography key={index}>{line}</Typography>
                                                ))
                                            }
                                        </Paper>
                                    </div>
                                </TabPanel>
                            }
                        </>
                    }
            </Paper>
            }
        </>
    );
}

export default OverviewComponent;