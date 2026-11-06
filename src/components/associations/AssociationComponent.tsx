import {useParams} from "react-router";
import React, {useEffect, useState} from "react";
import http from "../../commons/http-commons";
import {
    Box,
    Grid,
    Paper,
    TableCell,
    Typography,
    useTheme
} from "@mui/material";
import Header from "../home/HeaderComponent";
import Footer from "../home/Footer";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPerson} from "@fortawesome/free-solid-svg-icons";

interface AssociationToDisplay {
    id: string,
    pmid?: [string],
    participants: [string],
    source: string,
    score: string | undefined,
    spokeexpandedfrom?: [string],
    directlysupportedby?: [string],
    inferredfrom?: [string],
    prediction_studies?: [string],
    publications: [string]
}


function AssociationComponent() {
    const { associationId } = useParams();
    const [association, setAssociation] = useState<AssociationToDisplay>();

    useEffect(() => {
        http.get("/associations/" + associationId)
            .then((associationResponse) => {
                if(associationResponse.data && associationResponse.data.association) {
                    let associationData = associationResponse.data.association;

                    let association : AssociationToDisplay = {
                        id: associationData.id,
                        pmid: associationData.pmids,
                        participants: associationData.participants,
                        source: associationData.source,
                        score: associationData.score ? String(associationData.score) : undefined,
                        prediction_studies: associationData.prediction_studies,
                        publications: associationData.publications
                    }
                    if(associationData.experiments && associationData.experiments.direct && associationData.experiments.direct.binary &&
                        associationData.experiments.direct.binary.length > 0) {
                        association.directlysupportedby = associationData.experiments.direct.binary;
                    }

                    if(associationData.experiments && associationData.experiments.direct && associationData.experiments.direct.spoke_expanded_from &&
                        associationData.experiments.direct.spoke_expanded_from.length > 0) {
                        association.spokeexpandedfrom = associationData.experiments.direct.spoke_expanded_from;
                        association.spokeexpandedfrom?.sort();
                    }

                    if(associationData.inferredfrom) {
                        let inferredfrom = [];
                        if(Array.isArray(associationData.inferredfrom)) {
                            inferredfrom = associationData.inferredfrom;
                        } else {
                            inferredfrom.push(associationData.inferredfrom);
                        }
                        association.inferredfrom = inferredfrom;
                    }

                    setAssociation(association);
                }
            });
    },[]);

    const theme = useTheme();

    const paperStyle = {
        background: 'var(--mdb-surface)',
        boxShadow: 'var(--mdb-shadow)',
        padding: '16px',
        width: '100%',
        borderRadius: 'var(--mdb-radius)'
    };

    const cellStyles = {
        padding: '0px',
        borderBottom: 'none',
        width: '250px'
    };

    return (
        <>
        <div>
            <Header pageDetails={{
                type: "association",
                id: associationId
            }}/>
            <div
                style={{
                    display: 'flex',
                    height: "80vh",
                    overflowY: 'auto',
                    alignItems: 'center',
                    flexDirection: 'column'
                }}
            >
                <Box
                    style={{
                        width: "60%",
                        paddingTop: '20px'
                    }}
                >
                    {association &&
                        <Paper style={paperStyle}>
                            {/*
                            <div style={{textAlign: 'left' , width: '200px', paddingLeft: '20px'}}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingBottom: '4px' }}>
                                    <div style={{ flex: 1 }}>
                                        <h4>Biomolecules</h4>
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        {association.participants.map((b, index) => {
                                            let link = "/biomolecule/" + b;
                                            return (
                                                <div key={index}>
                                                    <a href={link}>{b}</a>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingBottom: '5px' }}>
                                    <div style={{ flex: 1 }}>
                                        <h4>Experiment(s)</h4>
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        {
                                            association.directlysupportedby &&
                                            <div style={{paddingBottom: '5px'}}>
                                                <Typography align="left">Directly Supported By
                                                    {
                                                        association.directlysupportedby.map(b => {
                                                            let link = "/experiment/" + b;
                                                            return (
                                                                <Grid item xs={6}>
                                                                    <a href={link}>{b}</a>
                                                                </Grid>
                                                            )
                                                        })
                                                    }
                                                </Typography>
                                            </div>
                                        }
                                        {
                                            association.spokeexpandedfrom &&
                                            <div>
                                                <Typography align="left">Spoke Expanded From
                                                    {
                                                        association.spokeexpandedfrom.map(b => {
                                                            let link = "/experiment/" + b;
                                                            return (
                                                                <Grid item xs={6}>
                                                                    <a href={link}>{b}</a>
                                                                </Grid>
                                                            )
                                                        })
                                                    }
                                                </Typography>
                                            </div>
                                        }
                                    </div>
                                    {association.score && <div style={{ flex: 1 }}>
                                        <Typography align="left">
                                            <h4>Score</h4>
                                            <Chip label={`MIScore: ${association.score}`} style={{ backgroundColor: mapScoreToColor(parseFloat(association.score)) }} />
                                        </Typography>
                                    </div>}
                                </div>
                                <Typography align="left" style={{paddingTop: '10px'}}>
                                    <h4>Source</h4>
                                    {association.source}
                                </Typography>
                                <Typography align="left">
                                    <h4>Publications</h4>
                                    {association.pmid && association.pmid.map((pmid: string, index: number) => (
                                        <div key={index}>
                                            <a href={`https://pubmed.ncbi.nlm.nih.gov/${pmid}`} target="_blank" rel="noopener noreferrer">
                                                {pmid}
                                            </a>
                                        </div>
                                    ))}
                                </Typography>
                            </div>*/}
                                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--mdb-section-bg)' }}>
                                    <div style={{ paddingLeft: '20px'}}>
                                        <h3>Interaction: {associationId}</h3>
                                    </div>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    width: '60%',
                                    paddingLeft: '10%',
                                    paddingRight: '10%'
                                }}>
                                    <Grid container spacing={0}>
                                        <Grid item xs={6}>
                                            <TableCell style={{...cellStyles, textAlign: 'right', paddingRight: '10px'}}><h4>Participants</h4></TableCell>
                                            <TableCell style={cellStyles}>
                                                {association.participants.map((b, index) => {
                                                    let link = "/biomolecule/" + b;
                                                    return (
                                                        <div key={index}>
                                                            <a href={link}>{b}</a>
                                                        </div>
                                                    );
                                                })}
                                            </TableCell>
                                        </Grid>
                                        {association.score !== undefined && <Grid item xs={6}>
                                            <TableCell style={{...cellStyles, textAlign: 'right', paddingRight: '10px'}}><h4>Intact MI Score</h4></TableCell>
                                            <TableCell style={cellStyles}>
                                                {
                                                    <Typography variant={"body2"} align="left">
                                                        {association.score === '0' ? '-' : association.score}
                                                    </Typography>
                                                }
                                            </TableCell>
                                        </Grid>}
                                        {((association.directlysupportedby && association.directlysupportedby.length > 0)
                                            || (association.spokeexpandedfrom &&  association.spokeexpandedfrom.length > 0)) &&
                                            <Grid item xs={6}>
                                                <TableCell style={{...cellStyles, textAlign: 'right', paddingRight: '10px'}}><h4>Experiment(s)</h4></TableCell>
                                                <TableCell style={cellStyles}>
                                                    <Typography variant={"body2"} align="left">
                                                        {
                                                            association.directlysupportedby &&
                                                            <div style={{paddingBottom: '5px'}}>
                                                                <Typography align="left">Non-Expanded
                                                                    {
                                                                        association.directlysupportedby.map(b => {
                                                                            let link = "/experiment/" + b;
                                                                            return (
                                                                                <Grid item xs={6}>
                                                                                    <a href={link}>{b}</a>
                                                                                </Grid>
                                                                            )
                                                                        })
                                                                    }
                                                                </Typography>
                                                            </div>
                                                        }
                                                        {
                                                            association.spokeexpandedfrom &&
                                                            <div>
                                                                <Typography style={{fontSize: '12px'}} align="left">Spoke Expanded
                                                                    {
                                                                        association.spokeexpandedfrom.map(b => {
                                                                            let link = "/experiment/" + b;
                                                                            return (
                                                                                <Grid item xs={6}>
                                                                                    <a href={link}>{b}</a>
                                                                                </Grid>
                                                                            )
                                                                        })
                                                                    }
                                                                </Typography>
                                                            </div>
                                                        }
                                                    </Typography>
                                            </TableCell>
                                            </Grid>
                                        }
                                        {association.prediction_studies && association.prediction_studies.length > 0  &&
                                            <Grid item xs={6}>
                                                <TableCell style={{...cellStyles, textAlign: 'right', paddingRight: '10px'}}><h4>Prediction Methods </h4></TableCell>
                                                <TableCell style={cellStyles}>
                                                    <Typography variant={"body2"} align="left">
                                                        <div style={{display: 'flex', flexDirection: 'column'}}>
                                                            {
                                                                association.prediction_studies.map((publication: string) => (
                                                                    <div style={{ display: 'flex', marginRight: '10px' }}>
                                                                        {publication.includes('doi') && publication}
                                                                        {!publication.includes('doi') && <a href={`https://pubmed.ncbi.nlm.nih.gov/${publication}`}>{publication}</a>}
                                                                    </div>
                                                                ))
                                                            }
                                                        </div>
                                                    </Typography>
                                                </TableCell>
                                            </Grid>
                                        }
                                        {association.publications && <Grid item xs={6}>
                                            <TableCell style={{...cellStyles, textAlign: 'right', paddingRight: '10px'}}><h4>Publications</h4></TableCell>
                                            <TableCell style={cellStyles}>
                                                <div>
                                                    {
                                                        Array.isArray(association.publications) && association.publications.map((pmid: string) => (
                                                            <Grid item xs={6}>
                                                                <a href={`/publication/${pmid}`}>{pmid}</a>
                                                            </Grid>
                                                        ))
                                                    }
                                                </div>
                                            </TableCell>
                                        </Grid>
                                        }
                                    </Grid>
                                </div>
                        </Paper>
                    }
                </Box>
            </div>
            <Footer/>
        </div>
        </>
    );
}

export default AssociationComponent;