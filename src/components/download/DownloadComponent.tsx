import Header from "../home/HeaderComponent";
import Footer from "../home/Footer";
import imexlogo from "../../assets/images/imexlogo.png";
import {Box, TableContainer, Typography} from "@mui/material";
import React from "react";
import {faFileDownload} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const uniProtKBData = [
    { term: 'Basement membrane', code: 'KW-0084' },
    { term: 'Extracellular matrix', code: 'KW-0272' },
    { term: 'Extracellular space/secreted', code: 'KW-0964' },
];

const goTermsData = [
    { term: 'Extracellular matrix', code: 'GO:0031012' },
    { term: 'Basement membrane', code: 'GO:0005604' },
    { term: 'Extracellular space', code: 'GO:0005615' },
    { term: 'Extracellular region', code: 'GO:0005576' },
];
function DownloadComponent() {
    return(
        <div
            className="App"
            style={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh'
            }}
        >
            <Header pageDetails={{
                type: "about"
            }}/>
                <div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        margin: '0 auto',
                        width: '70%',
                        marginBottom: '5px',
                        background: 'rgb(237, 239, 245)',
                        paddingTop: '20px'
                    }}>
                            <Typography
                                variant={'body1'}
                                style={{
                                    fontWeight: 'bold',
                                    marginBottom: '5px',
                                    marginTop: '5px'
                                }}
                            >
                                Download
                            </Typography>
                            <div style={{
                                paddingRight: '20px',
                                paddingLeft: '20px'
                            }}>
                                <Typography variant={"body2"} style={{fontWeight: 'bold'}}>
                                    MatrixDB manually curated interaction dataset  as a MITAB 2.7 file: <br/>
                                    <FontAwesomeIcon
                                        icon={faFileDownload}
                                        style={{
                                            marginRight: '10px',
                                            fontSize: '1.5em'
                                        }}
                                        color={'darkgreen'}
                                    /> <a href={"/downloads/matrixdb_CORE.tab.zip"}> matrixdb_CORE.tab.zip</a>
                                </Typography>
                                <Typography variant={"body2"} style={{fontWeight: 'bold'}}>
                                    Interaction dataset including interactions imported from IMEX databases as MITAB 2.7 file   : <br/>
                                    <FontAwesomeIcon
                                        icon={faFileDownload}
                                        style={{
                                            marginRight: '10px',
                                            fontSize: '1.5em'
                                        }}
                                        color={'darkgreen'}
                                    /><a href={"/downloads/matrixdb_all.tab.zip"}> matrixdb_all.tab.zip</a>
                                </Typography>
                                <Typography variant={"body2"} style={{fontWeight: 'bold'}}>
                                    Biomolecules : <br/>
                                    <FontAwesomeIcon
                                        icon={faFileDownload}
                                        style={{
                                            marginRight: '10px',
                                            fontSize: '1.5em'
                                        }}
                                        color={'darkgreen'}
                                    /><a href={"/downloads/biomolecules.csv"}> biomolecules.csv</a>
                                </Typography>
                                <Typography variant={"body2"} style={{fontWeight: 'bold'}}>
                                    ECM Proteins : <br/>
                                    <FontAwesomeIcon
                                        icon={faFileDownload}
                                        style={{
                                            marginRight: '10px',
                                            fontSize: '1.5em'
                                        }}
                                        color={'darkgreen'}
                                    /><a href={"/downloads/ecm_proteins.csv"}> ecm_proteins.csv</a>
                                </Typography>
                                <Box sx={{ padding: 3 }}>
                                    <Typography variant="body2" gutterBottom>
                                        MatrixDB selects extra cellular matrix (ECM) proteins according to the following criteria and according to the classification from matrisome project.
                                    </Typography>
                                    <Typography variant="body2" gutterBottom>
                                        UniProtKB Keywords
                                    </Typography>
                                    {uniProtKBData.map((item, index) => (
                                        <Box key={index} sx={{ display: 'flex', mb: 1 }}>
                                            <Typography variant="body2" sx={{ width: '300px', fontWeight: 'bold' }}>
                                                {item.term}
                                            </Typography>
                                            <Typography variant="body2" sx={{ width: '100px' }}>
                                                {item.code}
                                            </Typography>
                                        </Box>
                                    ))}

                                    <Typography variant="body2" gutterBottom sx={{ marginTop: 4 }}>
                                        GO Term Cellular Component
                                    </Typography>

                                    {goTermsData.map((item, index) => (
                                        <Box key={index} sx={{ display: 'flex', mb: 1 }}>
                                            <Typography variant="body2" sx={{ width: '300px', fontWeight: 'bold' }}>
                                                {item.term}
                                            </Typography>
                                            <Typography variant="body2" sx={{ width: '100px' }}>
                                                {item.code}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </div>
                    </div>
                </div>
            <Footer/>
        </div>
    );
}

export default DownloadComponent;