import React, {useEffect, useState} from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import {Box, Grid, Tooltip} from "@mui/material";
import http from "../../commons/http-commons";
import {faCircleNodes} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import BiomoleculeCircularDisplayComponent from "../statistics/BiomoleculeCircularDisplayCompotnent";
import InteractionHeatMapComponent from "../statistics/InteractionHeatMapComponent";
import cytoscapeLogo from "../../assets/images/cytoscape.png";
import ProteinProteinInteractionComponent from "../statistics/ProteinProteinInteractionComponent";
import LogoIcon from "../commons/icons/LogoIcon";
import CirclePacking from "../statistics/BiomoleculeBySpeciesCirclePacking";
import imexlogo from "../../assets/images/imexlogo.png";



function MainContentComponent() {
    const [statistics, setStatistics] = useState<any>({});
    const [biomoleculeStatistics, setBiomoleculeStatistics] = useState<any>([]);
    const [interactionStatistics, setInteractionStatistics] = useState<any[]>([]);
    const [proteinProteinInteractionStatistics, setProteinProteinInteractionStatistics] = useState<any>(null);

    useEffect(() => {
        http.get("/statistics/")
            .then((statisticsResponse) => {
                setStatistics(statisticsResponse.data);
                let biomoleculeData = statisticsResponse.data.biomolecules;
                let biomoleculeStatistics = [
                    {
                        type: 'Protein',
                        value: biomoleculeData.protein.all,
                        bySpecies: biomoleculeData.protein.by_species
                    },
                    {
                        type: 'GAG',
                        value: biomoleculeData.gag
                    },
                    {
                        type: 'Multimer',
                        value: biomoleculeData.multimer.all,
                        bySpecies: biomoleculeData.multimer.by_species

                    },
                    {
                        type: 'PFRAG',
                        value: biomoleculeData.pfrag.all,
                        bySpecies: biomoleculeData.pfrag.by_species
                    },
                    {
                        type: 'SmallMolecules',
                        value: biomoleculeData.smallmol
                    },
                    {
                        type: 'CAT',
                        value: biomoleculeData.cat
                    },
                    {
                        type: 'LIPID',
                        value: biomoleculeData.lipid
                    },
                    {
                        type: 'SPEP',
                        value: biomoleculeData.spep
                    }
                ];
                setBiomoleculeStatistics(biomoleculeStatistics);

                let interactionData = statisticsResponse.data.interactions;
                let interactionStatistics = [
                    { row: 'Protein', column: 'Protein', value: interactionData.protein_protein.directly_supported},
                    { row: 'Protein', column: 'GAG', value: interactionData.protein_gag || 0},
                    { row: 'Protein', column: 'PFRAG', value: interactionData.protein_pfrag || 0},
                    { row: 'Protein', column: 'Multimer', value: interactionData?.protein_multimer || 0},
                    { row: 'GAG', column: 'Protein', value: interactionData.protein_gag || 0},
                    { row: 'GAG', column: 'GAG', value: interactionData?.gag_gag || 0},
                    { row: 'GAG', column: 'PFRAG', value: interactionData.gag_pfrag || 0 },
                    { row: 'GAG', column: 'Multimer', value: interactionData.gag_multimer || 0},
                    { row: 'PFRAG', column: 'Protein', value: interactionData.protein_pfrag || 0 },
                    { row: 'PFRAG', column: 'GAG', value: interactionData.gag_pfrag || 0 },
                    { row: 'PFRAG', column: 'PFRAG', value: interactionData.pfrag_pfrag || 0},
                    { row: 'PFRAG', column: 'Multimer', value: interactionData.multimer_pfrag || 0 },
                    { row: 'Multimer', column: 'Protein', value: interactionData.protein_multimer ||  0},
                    { row: 'Multimer', column: 'GAG', value: interactionData.gag_multimer || 0},
                    { row: 'Multimer', column: 'PFRAG', value: interactionData.multimer_pfrag || 0 },
                    { row: 'Multimer', column: 'Multimer', value: interactionData.multimer_multimer || 0 },
                    { row: 'Other', column: 'Protein', value: interactionData.protein_other || 0 },
                    { row: 'Other', column: 'PFRAG', value: interactionData.pfrag_other ||  0},
                    { row: 'Other', column: 'GAG', value: interactionData.gag_other || 0},
                    { row: 'Other', column: 'Multimer', value: interactionData.multimer_other || 0 },
                    { row: 'Protein', column: 'Other', value: interactionData.protein_other || 0 },
                    { row: 'PFRAG', column: 'Other', value: interactionData.pfrag_other ||  0},
                    { row: 'GAG', column: 'Other', value: interactionData.gag_other || 0},
                    { row: 'Multimer', column: 'Other', value: interactionData.multimer_other || 0 },
                    { row: 'Other', column: 'Other', value: interactionData.other_other || 0 },
                ];
                setInteractionStatistics(interactionStatistics);
                setProteinProteinInteractionStatistics({
                    all: interactionData.protein_protein.all,
                    experimental: interactionData.protein_protein.directly_supported,
                    predicted: interactionData.protein_protein.predicted
                })
            });
    }, []);

    const cardStyle = {
        display: 'flex',
        flexDirection: 'column',
        background: '#e7ebef',
        borderRadius: 0,
        height: '330px'
    } as React.CSSProperties;

    interface TruncatedListItemTextProps {
        text: string;
        url: string;
    }
    const TruncatedListItemText: React.FC<TruncatedListItemTextProps> = ({ text, url }) => {
        const truncatedText = text.length > 50 ? `${text.substring(0, 50)}...` : text;

        return (
            <Tooltip title={text.length > 50 ? text : ''} arrow>
                <Typography variant="body2" noWrap>
                    {text.length > 50 ? (
                        <a href={url} target="_blank">
                            {truncatedText}
                        </a>
                    ) : (
                        truncatedText
                    )}
                </Typography>
            </Tooltip>
        );
    };

    return (
        <>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingTop: '20px',
                margin: '0 auto',
                marginBottom: '5px',
                background: 'rgb(237, 239, 245)',
                width: '70%'
            }}>
                <Typography
                    variant={'body1'}
                    style={{
                        fontWeight: 'bold',
                        marginBottom: '5px'
                    }}>
                    MatrixDB Content
                </Typography>
                {/*<div style={{
                    display: 'flex',
                    width: '70%'
                }}>*/}
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={6}>
                            {
                                interactionStatistics && interactionStatistics.length > 0 &&
                                <Card style={{ flex: '1', margin: '10px', ...cardStyle }}>
                                    <Typography
                                        component="div"
                                        style={{
                                            color: 'darkblue' ,
                                            textAlign: 'center',
                                            marginLeft: '10px',
                                            marginTop: '15px',
                                            fontWeight: 'bold'
                                        }}>
                                        <a href="/naming">Experimentally Supported Binary Interactions</a>
                                        <br/>
                                        ({statistics.interactions.all - statistics.interactions.protein_protein.predicted})
                                    </Typography>
                                    <InteractionHeatMapComponent
                                        data={interactionStatistics}
                                        width={260}
                                        height={260}
                                    />
                                </Card>
                            }
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                            {proteinProteinInteractionStatistics && <Card
                                style={{
                                    flex: '1',
                                    margin: '10px',
                                    ...cardStyle
                                }}
                            >
                                <Typography
                                    component="div"
                                    style={{
                                        color: 'darkblue',
                                        textAlign: 'center',
                                        marginLeft: '10px',
                                        marginTop: '15px',
                                        marginBottom: '10px',
                                        fontWeight: 'bold'
                                    }}>
                                    Protein-Protein Interactions ({proteinProteinInteractionStatistics.all})
                                </Typography>
                                <div style={{
                                    paddingTop: '30px'
                                }}>
                                    <ProteinProteinInteractionComponent
                                        data={[
                                            {   name: "Experimental",
                                                value: proteinProteinInteractionStatistics.experimental,
                                                color: '#201f1f'
                                            },
                                            {
                                                name: "Predicted",
                                                value: proteinProteinInteractionStatistics.predicted,
                                                color: '#b32828'
                                            }]
                                        }/>
                                </div>
                            </Card>}
                        </Grid>
                    </Grid>
                {/*</div>*/}
                {/*<div
                    style={{
                        display: 'flex',
                        width: '70%'
                    }}
                >*/}
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={6}>
                            {statistics.biomolecules &&
                                <Card
                                    style={{
                                        flex: '1',
                                        margin: '10px',
                                        ...cardStyle
                                    }}
                                >
                                    <Typography
                                        component="div"
                                        style={{
                                            color: 'darkblue',
                                            textAlign: 'center',
                                            marginLeft: '10px',
                                            marginTop: '15px',
                                            marginBottom: '10px',
                                            fontWeight: 'bold'
                                        }}>
                                        <a href={"/naming"}>Biomolecules </a> ({statistics.biomolecules.all })
                                    </Typography>
                                    <BiomoleculeCircularDisplayComponent
                                        biomoleculeStatistics={biomoleculeStatistics}
                                        width={400}
                                        height={240}
                                    />
                                    <Typography
                                        component="div"
                                        style={{
                                            color: 'darkblue',
                                            textAlign: 'left',
                                            marginLeft: '10px',
                                            marginBottom: '10px'
                                        }}>
                                        <a href={"/naming"}>MatrixDB Nomenclature </a>
                                    </Typography>
                                </Card>
                            }
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                            {statistics.biomolecules && <Card style={{ flex: '1', margin: '10px', ...cardStyle }}>
                                <Typography
                                    component="div"
                                    style={{
                                        color: 'darkblue' ,
                                        textAlign: 'center',
                                        marginLeft: '10px',
                                        marginTop: '15px',
                                        marginBottom: '10px',
                                        fontWeight: 'bold'
                                    }}>
                                    Protein, Multimer & Protein Fragments by Species
                                </Typography>
                                <CirclePacking
                                    biomoleculeStatistics={biomoleculeStatistics}
                                />
                            </Card>}
                        </Grid>
                    </Grid>
                {/*}</div>*/}
            </div>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                margin: '0 auto',
                width: '70%',
                marginBottom: '5px',
                background: 'rgb(197,205,229)',
                paddingTop: '5px'
            }}>
                <Typography
                    variant={'body1'}
                    style={{
                        fontWeight: 'bold',
                        marginBottom: '5px',
                        marginTop: '5px'
                    }}>
                    Build Interaction Networks
                </Typography>
                <Typography
                    variant={'body1'}
                    style={{
                        marginBottom: '5px',
                        marginTop: '5px',
                        width: '70%'
                    }}>
                    <FontAwesomeIcon
                        icon={faCircleNodes}
                        style={{
                            fontSize: '1.5em',
                            paddingRight: '5px'
                        }}
                        color='green'
                    />
                    Interaction networks can be built, filtered and modified using <a href="/networks" target="_blank">Network explorer</a>
                </Typography>
                <Typography
                    variant={'body1'}
                    style={{
                        marginBottom: '5px',
                        marginTop: '5px',
                        width: '70%'
                    }}>
                    <img src={cytoscapeLogo} style={{width: '25px', height: 'auto'}}/>
                    Interaction network export is available as image (svg), tabular (.csv) or Cytoscape (.json) format
                </Typography>
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                margin: '0 auto',
                width: '70%',
                marginBottom: '5px',
                background: 'rgb(237, 239, 245)',
                paddingTop: '5px'
            }}>
                <Typography
                    variant={'body1'}
                    style={{
                        fontWeight: 'bold',
                        marginBottom: '5px',
                        marginTop: '5px'
                    }}>
                    Data Sources
                </Typography>

                <Grid container spacing={2} direction="column">
                    <Grid item xs={12}>
                        <div style={{ textAlign: 'center' }}>
                            <Typography variant="body2" gutterBottom style={{ fontWeight: 'bold' }}>
                                Interaction Data
                            </Typography>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                                <a href="https://matrixdb.univ-lyon1.fr/" target="_blank">
                                    <LogoIcon logoName="matrixdb" width="50" height="auto" />
                                </a>
                                <a href="https://www.imexconsortium.org/" target="_blank">
                                    <LogoIcon logoName="imex" width="60" height="auto" />
                                </a>
                                <a href="https://www.ebi.ac.uk/intact/" target="_blank">
                                    <LogoIcon logoName="intact" width="100" height="auto" />
                                </a>
                                <Typography variant="body1">
                                    <a href="http://iid.ophid.utoronto.ca/" target="_blank">Integrated Interactions Database (IID)</a>
                                </Typography>
                            </div>
                        </div>
                    </Grid>

                    <Grid item xs={12}>
                        <div style={{ textAlign: 'center' }}>
                            <Typography variant="body2" gutterBottom style={{ fontWeight: 'bold' }}>
                                Biomolecule Data
                            </Typography>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                                <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                                    <a href="https://www.uniprot.org/" target="_blank" rel="noopener noreferrer">
                                        <LogoIcon logoName="uniprot" width="30" height="auto" />
                                    </a>
                                    <Typography variant="body1" ml={1} style={{ paddingTop: '10px'}}>
                                        <a href="https://www.uniprot.org/" target="_blank" rel="noopener noreferrer">
                                            UniProtKB
                                        </a>
                                    </Typography>
                                </Box>

                                <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                                    <a href="https://www.ebi.ac.uk/chebi/" target="_blank" rel="noopener noreferrer">
                                        <LogoIcon logoName="chebi" width="40" height="auto" />
                                    </a>
                                    <Typography variant="body1" ml={1}>
                                        <a href="https://www.ebi.ac.uk/chebi/" target="_blank" rel="noopener noreferrer">
                                            ChEBI
                                        </a>
                                    </Typography>
                                </Box>

                                <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                                    <a href="https://www.ebi.ac.uk/complexportal/" target="_blank" rel="noopener noreferrer">
                                        <LogoIcon logoName="complex-portal" width="20" height="auto" />
                                    </a>
                                    <Typography variant="body1" ml={1} style={{ paddingTop: '10px'}}>
                                        <a href="https://www.ebi.ac.uk/complexportal/" target="_blank" rel="noopener noreferrer">
                                            Complex Portal
                                        </a>
                                    </Typography>
                                </Box>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                            <Box display="flex" flexDirection="row" gap={4} mb={2}>
                            {/* Expression Data */}
                            <div style={{ textAlign: 'center' }}>
                                <Typography variant="body2" gutterBottom style={{ fontWeight: 'bold' }}>
                                    Expression Data
                                </Typography>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                                    <a href="https://www.bgee.org/" target="_blank" rel="noopener noreferrer">
                                        <LogoIcon logoName="bgee" width="auto" height="30" />
                                    </a>
                                </div>
                            </div>

                            {/* Proteomic Data */}
                            <div style={{ textAlign: 'center' }}>
                                <Typography variant="body2" gutterBottom style={{ fontWeight: 'bold' }}>
                                    Proteomic Data
                                </Typography>
                                <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                                    <a href="https://matrisomedb.org/" target="_blank" rel="noopener noreferrer">
                                        <LogoIcon logoName="matrisome" width="100" height="auto" />
                                    </a>
                                    <Typography variant="body1">
                                        <a href="https://matrisomedb.org/" target="_blank" rel="noopener noreferrer">
                                            MatrisomeDB 2.0
                                        </a>
                                    </Typography>
                                </Box>
                            </div>
                            </Box>
                        </div>
                    </Grid>
                </Grid>

            </div>
        </>
    );
}

export default MainContentComponent;
