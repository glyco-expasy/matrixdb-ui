import {useParams} from "react-router";
import React, {useEffect, useState} from "react";
import http from "../../commons/http-commons";
import {
    Box,
    Grid,
    Paper,
    TableCell, Tooltip,
    Typography,
    useTheme
} from "@mui/material";
import Header from "../home/HeaderComponent";
import Footer from "../home/Footer";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFileDownload, faPerson} from "@fortawesome/free-solid-svg-icons";
import {CSVLink} from "react-csv";
import {DataGrid, GridColDef} from "@mui/x-data-grid";


function PublicationComponent() {
    const { publicationId } = useParams();
    const [publication, setPublication] = useState<any>();
    const [interactions, setInteractions] = useState<number>(0);
    const [participants, setParticipants] = useState<number>(0);
    const [evidences, setEvidences] = useState<number>(0);

    useEffect(() => {
        http.get("/publications/" + publicationId)
            .then((associationResponse) => {
                if(associationResponse.data && associationResponse.data) {
                    let publicationData = associationResponse.data;
                    setPublication(publicationData);

                    // Calculate interactions and supporting evidences
                    setInteractions(publicationData.interactions.length);
                    setParticipants(publicationData.participants.length);
                    let evidences = new Set<string>();
                    publicationData.interactions.forEach((interaction: any) => {
                        if(interaction.experiments) {
                            if(interaction.experiments.direct) {
                                if(interaction.experiments.direct.binary) {
                                    interaction.experiments.direct.binary.forEach((evidence:string) => evidences.add(evidence));
                                }

                                if(interaction.experiments.direct.spoke_expanded_from) {
                                    interaction.experiments.direct.spoke_expanded_from.forEach((evidence:string) => evidences.add(evidence));
                                }
                            }
                        }
                    });
                    setEvidences(evidences.size);
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

    const labelCellStyle = {
        padding: '0px',
        borderBottom: 'none',
        width: '200px'
    };

    const cellStyles = {
        padding: '0px',
        paddingLeft: '10px',
        borderBottom: 'none'
    };

    const rows = publication && publication.interactions.map((interaction: any) => {
        let firstPartner = interaction.participants[0];
        let secondPartner = interaction.participants[1];

        let directlySupported = [];
        if(interaction.experiments.direct && interaction.experiments.direct.binary) {
            directlySupported = interaction.experiments.direct.binary;
        }

        let spokeExpandedFrom = [];
        if(interaction.experiments.direct && interaction.experiments.direct.spoke_expanded_from) {
            spokeExpandedFrom = interaction.experiments.direct.spoke_expanded_from;
        }

        return {
            id: firstPartner + '_' + secondPartner,
            firstPartner: firstPartner,
            secondPartner: secondPartner,
            directlySupportedBy: directlySupported,
            spokeExpandedFrom: spokeExpandedFrom,
            score: interaction.score
        }
    });

    const columns: GridColDef[] = [
        {
            field: 'firstPartner',
            headerName: 'First Partner',
            width: 200,
            renderCell: (params: any) =>  (
                <>
                    <a href={process.env.REACT_APP_PUBLIC_URL + "biomolecule/"+params.value}>{params.value}</a>
                </>)
        },
        {
            field: 'secondPartner',
            headerName: 'Second Partner',
            width: 200,
            renderCell: (params: any) =>  (
                <>
                    <a href={process.env.REACT_APP_PUBLIC_URL + "biomolecule/"+params.value}>{params.value}</a>
                </>)
        },
        {
            field: 'directlySupportedBy',
            headerName: 'Non-expanded',
            width: 180,
            renderCell: (params: any) =>  (
                <>
                    {
                        params.value.length > 0 && (
                            <Tooltip
                                title={
                                    <ul style={{ backgroundColor: '#ffffff', margin: 0, padding: 0, listStyleType: 'none' }}>
                                        {params.value.map((ex: any) => (
                                            <li key={ex}>
                                                <a href={process.env.REACT_APP_PUBLIC_URL + "experiment/" + ex}>
                                                    {ex}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                }
                                placement="top"
                                componentsProps={{
                                    tooltip: {
                                        sx: {
                                            bgcolor: "#fff",
                                            color: "#fff"
                                        }
                                    }
                                }}
                                PopperProps={{
                                    sx: {
                                        background: '#fff',
                                        backgroundColor: '#ffffff',
                                        boxShadow: 'var(--mdb-shadow)',
                                        maxWidth: '400px',
                                        border: '1px solid rgba(0, 0, 0, 0.1)'
                                    }
                                }}
                            >
                                  <span className="table-cell-truncate">
                                    {params.value.length}
                                  </span>
                            </Tooltip>
                        )
                    }
                    {
                        params.value.length === 0 && <span className="table-cell-trucate">{params.value.length}</span>
                    }
                </>
            ),
            sortComparator: (v1, v2) =>  v2.length - v1.length
        },
        {
            field: 'spokeExpandedFrom',
            headerName: 'Spoke Expanded',
            width: 180,
            renderCell: (params: any) =>  (
                <>
                    {
                        params.value.length > 0 && (
                            <Tooltip
                                title={
                                    <ul style={{ backgroundColor: '#ffffff', margin: 0, padding: 0, listStyleType: 'none' }}>
                                        {params.value.map((ex: any) => (
                                            <li key={ex}>
                                                <a href={process.env.REACT_APP_PUBLIC_URL + "experiment/" + ex}>
                                                    {ex}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                }
                                placement="top"
                                componentsProps={{
                                    tooltip: {
                                        sx: {
                                            bgcolor: "#fff",
                                            color: "#fff"
                                        }
                                    }
                                }}
                                PopperProps={{
                                    sx: {
                                        background: '#fff',
                                        backgroundColor: '#ffffff',
                                        boxShadow: 'var(--mdb-shadow)',
                                        maxWidth: '400px',
                                        border: '1px solid rgba(0, 0, 0, 0.1)'
                                    }
                                }}
                            >
                                  <span className="table-cell-truncate">
                                    {params.value.length}
                                  </span>
                            </Tooltip>)
                    }
                    {
                        params.value.length === 0 && <span className="table-cell-trucate">{params.value.length}</span>
                    }
                </>
            ),
            sortComparator: (v1, v2) =>  v2.length - v1.length
        }
    ];

    const getSource = () => {
        return `${publication.source}. ${publication.pubdate};${publication.volume}(${publication.issue}):${publication.pages}`;
    }

    return (
        <>
        <div>
            <Header pageDetails={{
                type: "publication",
                id: publicationId
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
                    {publication &&
                        <Paper style={paperStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--mdb-section-bg)' }}>
                                <div style={{ paddingLeft: '20px'}}>
                                    <h3>Publication: {publication.title}</h3>
                                </div>
                            </div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                paddingLeft: '10%',
                                paddingRight: '10%'
                            }}>
                                <Grid container spacing={0}>
                                    <Grid item lg={12}>
                                        <TableCell
                                            style={{...labelCellStyle, textAlign: 'right', paddingRight: '10px'}}><h4>Pubmed</h4></TableCell>
                                        <TableCell
                                            style={cellStyles}>
                                            <Typography variant={"body2"} align="left">
                                                <a href={`https://pubmed.ncbi.nlm.nih.gov/${publication.publication}`} target={'_blank'} rel="noopener noreferrer">{publication.publication}</a>
                                            </Typography>
                                        </TableCell>
                                    </Grid>
                                    <Grid item lg={12}>
                                        <TableCell style={{...labelCellStyle, textAlign: 'right', paddingRight: '10px'}}><h4>Source</h4></TableCell>
                                        <TableCell style={cellStyles}>
                                            <Typography variant={"body2"} align="left">
                                                {getSource()}
                                            </Typography>
                                        </TableCell>
                                    </Grid>
                                    <Grid item lg={12}>
                                        <TableCell style={{...labelCellStyle, textAlign: 'right', paddingRight: '10px'}}><h4>Author (s)</h4></TableCell>
                                        <TableCell style={cellStyles}>
                                            <Typography variant={"body2"} align="left">
                                                {publication.authors.map((authorDetails: any) => authorDetails).join(', ')}
                                            </Typography>
                                        </TableCell>
                                    </Grid>
                                </Grid>
                            </div>
                        </Paper>
                    }
                </Box>
                <Box style={{ width: "60%", paddingTop: '10px' }}>
                    {
                        publication && publication.interactions &&
                        <Paper style={paperStyle}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                background: 'var(--mdb-section-bg)',
                                paddingLeft: '20px',
                            }}>
                                <div style={{clear: 'left', textAlign: 'left'}}>
                                    <h4><span>Participants : {participants}</span></h4>
                                    <h4><span>Interactions : {interactions}</span></h4>
                                </div>
                            </div>
                            {
                                <>
                                    {
                                        interactions > 0 &&
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                width: '100%',
                                                margin: '0 auto',
                                                border: '1px solid #ccc',
                                            }}>
                                                <DataGrid
                                                    rows={rows}
                                                    columns={columns}
                                                    initialState={{
                                                        pagination: {
                                                            paginationModel: {
                                                                pageSize: 5,
                                                            },
                                                        },
                                                    }}
                                                    pageSizeOptions={[5]}
                                                    disableRowSelectionOnClick
                                                />
                                            </div>
                                        </div>
                                    }
                                </>
                            }
                        </Paper>
                    }
                </Box>
            </div>
            <Footer/>
        </div>
        </>
    );
}

export default PublicationComponent;