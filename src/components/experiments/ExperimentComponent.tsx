import {useParams} from "react-router";
import React, {useEffect, useState} from "react";
import http from "../../commons/http-commons";
import SearchIcon from "@mui/icons-material/Search";
import logo from "../../assets/images/matrixdb_logo_medium.png";
import {
    AppBar,
    Box,
    experimentalStyled,
    Grid,
    IconButton,
    InputBase,
    Paper, Tab,
    TableCell, Tabs,
    Toolbar,
    Typography,
    useTheme
} from "@mui/material";
import Header from "../home/HeaderComponent";
import Footer from "../home/Footer";


interface ParticipantToDisplay {
    id: string,
    biomolecule: string,
    detectionMethod: string,
    detectionMethodPSIMI: string,
    biologicalRole: string,
    biologicalRolePSIMI: string,
    experimentalRole: string
    experimentalRolePSIMI: string
}

interface ExperimentToDisplay {
    id: string,
    intactId: string,
    imexId: string,
    pmid: string,
    source: string,
    sourcePSIMI: string,
    spokeexpandedto?: Array<string>,
    directlysupports?: Array<string>,
    inferredto?: Array<string>,
    detectionMethod: string,
    detectionMethodPSIMI: string,
    type: string,
    typePSIMI: string,
    comment: string,
    participants?: Array<ParticipantToDisplay>,
    parameters?: any
}


function ExperimentComponent() {
    const { experimentId } = useParams();
    const [experiment, setExperiment] = useState<ExperimentToDisplay>();

    useEffect(() => {
        http.get("/experiments/" + experimentId)
            .then((experimentResponse) => {
                if(experimentResponse.data && experimentResponse.data.experiment) {
                    let experimentData = experimentResponse.data.experiment;
                    let experiment = {
                        id: experimentData.id,
                        pmid: experimentData.pmid,
                        source: experimentData.source.name,
                        sourcePSIMI: experimentData.source.id.replace(':','_'),
                        spokeexpandedfrom: experimentData?.spokeexpandedfrom,
                        directlysupports: experimentData?.directlysupports,
                        inferredfrom: experimentData?.inferredfrom,
                        detectionMethod: experimentData.interaction_detection_method.name,
                        detectionMethodPSIMI: experimentData.interaction_detection_method.id.replace(':','_'),
                        type: experimentData.interaction_type.name,
                        typePSIMI: experimentData.interaction_type.id.replace(':','_'),
                        comment: experimentData.comment,
                        intactId: experimentData.xrefs.intact,
                        imexId: experimentData?.xrefs.imex,
                        participants: experimentData.participants && Object.keys(experimentData.participants).map(pk  => {
                            return {
                                id: experimentData.participants[pk].id || experimentData.participants[pk].biomolecule ,
                                detectionMethod: experimentData.participants[pk]?.participant_detection_method.name,
                                detectionMethodPSIMI : experimentData.participants[pk].participant_detection_method.id?.replace(':','_'),
                                biologicalRole: experimentData.participants[pk].biological_role.name,
                                biologicalRolePSIMI: experimentData.participants[pk].biological_role.id?.replace(':','_'),
                                experimentalRole: experimentData.participants[pk].experimental_role.name,
                                experimentalRolePSIMI: experimentData.participants[pk].experimental_role.id?.replace(':','_')
                            }
                        }),
                        parameters: experimentData?.parameters
                    }
                    experiment.participants.sort((a: any, b: any) => {
                        const aBait = a.experimentalRole.includes('bait');
                        const bBait = b.experimentalRole.includes('bait');

                        if (aBait && !bBait) return -1;
                        if (!aBait && bBait) return 1;
                        return 0;
                    });
                    setExperiment(experiment);
                }
            });
    }, []);

    const generateExperimentName = (experiment : ExperimentToDisplay) => {
        let participants = experiment.participants;
        if(participants?.length === 2 ) {
            let bait = participants.find((participant) => participant.experimentalRole === 'MI:0496');
            let prey = participants.find((participant) => participant.experimentalRole !== 'MI:0496');
            return (
                    <span>
                        <h6>{bait?.id} and { prey?.id }</h6>
                    </span>  
            )
        } else {
            let bait = participants?.find((participant) => participant.experimentalRole === 'MI:0496');
            if(bait && participants) {
                return (
                    <span>
                        <h6>{bait.id} and { participants.length - 1} others</h6>
                    </span>  
                )
            }
            
        }
    }

    const theme = useTheme();

    const paperStyle = {
        background: 'rgba(255, 255, 255, 0.9)',
        boxShadow: '3px 3px 8px rgba(0, 0, 0, 0.3)',
        padding: '16px',
        width: '100%',
        borderRadius: 0,
        paddingBottom: '10px',
        paddingTop: '10px'
    };

    const participantPaperStyle = {
        background: 'rgba(255, 255, 255, 0.9)',
        boxShadow: '3px 3px 8px rgba(0, 0, 0, 0.3)',
        width: '100%',
        borderRadius: 0,
        paddingLeft: '4px',
        paddingBottom: '4px',
        paddingTop: '4px'
    };

    const cellStyles = {
        padding: '0px',
        borderBottom: 'none'
    };

    const getParticipantTypeId = (id: string) => {
        if(id) {
            if(id.includes('PFRAG')) return 'lightblue';
            if(id.includes('GAG')) return 'green';
            if(id.includes('MULT')) return 'orange';
            return 'blue';
        } else return 'white';
    }

    const getExperimentFeature = (feature: string) => {
        if(feature.includes('kd')){
            return 'Affinity : ' + feature.split(':')[1] ;
        } else {
            return feature;
        }
    }

    return (<>
            <Header pageDetails={{
                type: "experiment",
                id: experimentId
            }}/>
            {
                experiment &&
                <div
                    style={{
                        display: 'flex',
                        height: "80vh",
                        overflowY: 'auto',
                        alignItems: 'center',
                        flexDirection: 'column'
                    }}
                >
                    <Box style={{ width: "60%", paddingTop: '20px' }}>
                        <Paper style={paperStyle}>

                            <div style={{ display: 'flex', alignItems: 'center', background: '#e1ebfc' }}>
                                <div style={{ paddingLeft: '20px'}}>
                                    <h3>Experiment: {experiment.id}</h3>
                                </div>
                            </div>

                            {/*<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingBottom: '5px' }}>
                                <div style={{ flex: 1 }}>
                                    {
                                        (experiment?.intactId || experiment?.imexId) &&
                                        <div style={{paddingBottom: '5px'}}>
                                            <Typography align="left">
                                                <h4>External Reference</h4>
                                                {
                                                    experiment.intactId &&
                                                    <Typography align="left">
                                                        Intact <a href={'https://www.ebi.ac.uk/intact/details/interaction/'+experiment.intactId}>{experiment.intactId}</a>
                                                    </Typography>
                                                }
                                                {
                                                    experiment.imexId &&
                                                    <Typography align="left">
                                                        IMEX <a href={''}>{experiment.imexId}</a>
                                                    </Typography>
                                                }
                                            </Typography>
                                        </div>
                                    }
                                </div>
                                {
                                    experiment.detectionMethod && <div style={{ flex: 1 }}>
                                        <div style={{paddingBottom: '5px'}}>
                                            <Typography align="left">
                                                <h4>Detection Method</h4>
                                                <a target="_blank"  href={"http://purl.obolibrary.org/obo/" +experiment.detectionMethod }>
                                                    {experiment.detectionMethod}
                                                </a>
                                            </Typography>
                                        </div>
                                    </div>
                                }
                                {
                                    experiment.type && <div style={{ flex: 1 }}>
                                        <div style={{paddingBottom: '5px'}}>
                                            <Typography align="left">
                                                <h4>Interaction Type:</h4>
                                                <a target="_blank"  href={"http://purl.obolibrary.org/obo/" +experiment.type }>
                                                    {experiment.type}
                                                </a>
                                            </Typography>
                                        </div>
                                    </div>
                                }
                                {
                                    experiment.pmid && <div style={{ flex: 1 }}>
                                        <div style={{paddingBottom: '5px'}}>
                                            <Typography align="left">
                                                <h4>PMID</h4>
                                                <a href={"https://pubmed.ncbi.nlm.nih.gov/"+experiment.pmid} target="_blank">{experiment.pmid}</a>
                                            </Typography>
                                        </div>
                                    </div>
                                }
                                {
                                    experiment.pmid && <div style={{ flex: 1 }}>
                                        <div style={{paddingBottom: '5px'}}>
                                            <Typography align="left">
                                                <h4>Source</h4>
                                                <a target="_blank"  href={"http://purl.obolibrary.org/obo/" +experiment.source }>
                                                    {experiment.source}
                                                </a>
                                            </Typography>
                                        </div>
                                    </div>
                                }
                                {
                                    experiment.comment && <div style={{ flex: 1 }}>
                                        <div style={{paddingBottom: '5px'}}>
                                            <Typography align="left">
                                                <h4>General Comment</h4> {experiment.comment}</Typography>
                                        </div>
                                    </div>
                                }
                                {
                                    experiment.directlysupports && <div style={{ flex: 1 }}>
                                        <div style={{paddingBottom: '5px'}}>
                                            <Typography align="left"><b>Directly Supports</b> {experiment.directlysupports}</Typography>
                                        </div>
                                    </div>
                                }
                            </div>*/}

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                width: '60%',
                                paddingLeft: '10%',
                                paddingRight: '10%'
                            }}>
                                <Grid container spacing={0}>
                                        <Grid item xs={6}>
                                            <TableCell style={{...cellStyles, textAlign: 'right', paddingRight: '10px'}}><h4>Interaction Type</h4></TableCell>
                                            <TableCell style={cellStyles}>
                                                <Typography variant={"body2"} align="left">
                                                    <a target="_blank"  href={"http://purl.obolibrary.org/obo/" +experiment.typePSIMI }>
                                                        {experiment.type}
                                                    </a>
                                                </Typography>
                                            </TableCell>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TableCell style={{...cellStyles, textAlign: 'right', paddingRight: '10px'}}><h4>Detection Method</h4></TableCell>
                                            <TableCell style={cellStyles}>
                                                <Typography variant={"body2"} align="left">
                                                    <a target="_blank"  href={"http://purl.obolibrary.org/obo/" +experiment.detectionMethodPSIMI }>
                                                        {experiment.detectionMethod}
                                                    </a>
                                                </Typography>
                                            </TableCell>
                                        </Grid>
                                        {(experiment.intactId || experiment.imexId) && <Grid item xs={6}>
                                            <TableCell style={{...cellStyles, textAlign: 'right', paddingRight: '10px'}}><h4>External References</h4></TableCell>
                                            <TableCell style={cellStyles}>
                                                {
                                                    experiment.intactId &&
                                                    <Typography variant={"body2"} align="left">
                                                        Intact <a href={'https://www.ebi.ac.uk/intact/details/interaction/'+experiment.intactId} target='_blank'>{experiment.intactId}</a>
                                                    </Typography>
                                                }
                                                {
                                                    experiment.imexId &&
                                                    <Typography variant={"body2"} align="left">
                                                        IMEX <a href={'https://www.ebi.ac.uk/intact/imex/main.xhtml?query=' +experiment.imexId} target='_blank'>{experiment.imexId}</a>
                                                    </Typography>
                                                }
                                            </TableCell>
                                        </Grid>}
                                        <Grid item xs={6}>
                                            <TableCell style={{...cellStyles, textAlign: 'right', paddingRight: '10px'}}><h4>Publication (PubMed)</h4></TableCell>
                                            <TableCell style={cellStyles}>
                                                <div>
                                                    <span style={{ marginRight: '10px' }}>
                                                        <a href={`/publication/${experiment.pmid}`}>
                                                            {experiment.pmid}
                                                        </a>
                                                    </span>
                                                </div>
                                            </TableCell>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TableCell style={{...cellStyles, textAlign: 'right', paddingRight: '10px'}}><h4>Source</h4></TableCell>
                                            <TableCell style={cellStyles}>
                                                <a target='_blank' href={`http://purl.obolibrary.org/obo/${experiment.sourcePSIMI}`}>
                                                    {experiment.source}
                                                </a>
                                            </TableCell>
                                        </Grid>
                                        {experiment.parameters && <Grid item xs={6}>
                                            <TableCell style={{...cellStyles, textAlign: 'right', paddingRight: '10px'}}><h4>Features</h4></TableCell>
                                            <TableCell style={cellStyles}>
                                                {getExperimentFeature(experiment.parameters)}
                                            </TableCell>
                                        </Grid>}
                                    </Grid>
                            </div>
                        </Paper>
                    </Box>
                    <Box style={{ width: "60%", paddingTop: '10px' }}>
                        {experiment && experiment.participants &&
                            <Paper style={paperStyle}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    background: '#e1ebfc',
                                    paddingLeft: '20px',
                                }}>
                                        <h4>Participants ({experiment.participants.length})</h4>
                                </div>
                                {
                                    <div style={{
                                        paddingTop: '10px'
                                    }}>
                                        <Grid container spacing={1}>
                                            {experiment && experiment.participants && experiment.participants.sort((p1,p2) => {return p1.id.localeCompare(p2.id)}).map(participant => {
                                                return(
                                                    <Grid item xs={6}>
                                                        <Paper style={participantPaperStyle}>
                                                            <div style={{padding: '10px', textAlign: 'center' }}>
                                                                <a href={`/biomolecule/${participant.id}`}>
                                                                    <Typography variant="body1"><b>{participant && participant.id}</b></Typography>
                                                                </a>
                                                            </div>
                                                            <Grid item xs={12}>
                                                                <Typography variant={"body2"} align="left"><b>Participant Detection Method: </b>
                                                                    <a target="_blank"  href={"http://purl.obolibrary.org/obo/" +participant.detectionMethodPSIMI }>
                                                                        {participant.detectionMethod}
                                                                    </a>
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={12}>
                                                                <Typography variant={"body2"} align="left"><b>Biological Role: </b>
                                                                    <a target="_blank"  href={"http://purl.obolibrary.org/obo/" +participant.biologicalRolePSIMI }>
                                                                        {participant.biologicalRole}
                                                                    </a>
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={12}>
                                                                <Typography variant={"body2"} align="left"><b>Experiment Role: </b>
                                                                    <a target="_blank"  href={"http://purl.obolibrary.org/obo/" +participant.experimentalRolePSIMI }>
                                                                        {participant.experimentalRole}
                                                                    </a>
                                                                </Typography>
                                                            </Grid>
                                                        </Paper>
                                                    </Grid>
                                                )
                                            })}
                                        </Grid>
                                    </div>
                                }
                            </Paper>}
                    </Box>
                </div>
            }
            <Footer/>
        </>
    );
}

export default ExperimentComponent;