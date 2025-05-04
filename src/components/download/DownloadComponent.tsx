import Header from "../home/HeaderComponent";
import Footer from "../home/Footer";
import imexlogo from "../../assets/images/imexlogo.png";
import {Box, TableContainer, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {faFileDownload} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ProteinProteinInteractionComponent from "../statistics/ProteinProteinInteractionComponent";
import http from "../../commons/http-commons";
import ExperimentPieChartComponent from "../statistics/ExperimentPieChartComponent";
import BiomoleculeCircularDisplayComponent from "../statistics/BiomoleculeCircularDisplayCompotnent";

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
                                    /> <a href={"/downloads/matrixdb_CORE_4_0.tab.zip"}> matrixdb_CORE_4_0.tab.zip</a>
                                </Typography>
                                <br/>
                                <Typography variant={"body2"} style={{fontWeight: 'bold'}}>
                                    MatrixDB curated interaction dataset (release 4.0) including interactions imported from IMEx databases as a MITAB 2.7 file   : <br/>
                                    <FontAwesomeIcon
                                        icon={faFileDownload}
                                        style={{
                                            marginRight: '10px',
                                            fontSize: '1.5em'
                                        }}
                                        color={'darkgreen'}
                                    /><a href={"/downloads/matrixdb_all_4_0.tab.zip"}> matrixdb_all_4_0.tab.zip</a>

                                    <br/>
                                    <br/>
                                    Protein-Protein interactions (experimental vs predicted)
                                    {proteinProteinInteractionStatistics && <ExperimentPieChartComponent data={[
                                        {   title: "Experimental",
                                            value: proteinProteinInteractionStatistics.experimental,
                                        },
                                        {
                                            title: "Predicted",
                                            value: proteinProteinInteractionStatistics.predicted,
                                        }]
                                    } width={200} height={200} />}
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
                                <br/>
                                <Typography variant={"body2"} style={{fontWeight: 'bold'}}>
                                    The previous release of MatrixDB (release 3.4) is available at
                                    <a href={'http://v1.matrixdb.univ-lyon1.fr/'} target="_blank"> http://v1.matrixdb.univ-lyon1.fr/
                                    </a>
                                </Typography>
                                <br/>
                                <Typography variant={"body2"} style={{fontWeight: 'bold'}}>
                                    Biomolecule counts by types
                                </Typography>
                                {
                                    biomoleculeStatistics &&
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'left'
                                    }}>
                                        <BiomoleculeCircularDisplayComponent
                                            biomoleculeStatistics={biomoleculeStatistics}
                                            width={400}
                                            height={240}
                                        />
                                    </div>
                                }

                                <Box sx={{ padding: 3 }}>
                                    <Typography variant="body2" gutterBottom>
                                        MatrixDB selects extracellular matrix (ECM) and secreted proteins according to the following criteria, and according to the  matrisome divisions and categories.
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
                                <Typography variant={"body2"} style={{ fontWeight: 'bold', marginTop: '20px' }}>
                                    All data provided on this page is licensed under the 
                                    <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" style={{ marginLeft: '5px' }}>
                                        Creative Commons Attribution License (CC BY 4.0)
                                    </a>
                                    and should be appropriately credited when used.
                                </Typography>
                            </div>
                    </div>
                </div>
            <Footer/>
        </div>
    );
}

export default DownloadComponent;