import Header from "../home/HeaderComponent";
import Footer from "../home/Footer";
import imexlogo from "../../assets/images/imexlogo.png";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import React from "react";
import ccbylogo from "../../assets/images/ccby.png";
import LogoIcon from "../commons/icons/LogoIcon";
function AboutComponent() {
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
                        width: 'max(70%, min(100%, 700px))',
                        marginBottom: '5px',
                        background: 'var(--mdb-surface)',
                        paddingTop: '20px'
                    }}>

                            <div style={{
                                paddingRight: '20px',
                                paddingLeft: '20px',
                                maxWidth: '100%',
                                boxSizing: 'border-box',
                                overflowWrap: 'anywhere'
                            }}>
                                <Typography variant={"body1"}>
                                    MatrixDB is a curated interaction database focused on experimentally supported interactions mediated by the components of the extracellular matrix (ECM), namely proteins, proteoglycans, glycosaminoglycans, and bioactive ECM fragments collectively referred to as matrikines or matricryptins. It curate interactions with individual polypeptide chains or with native multimeric proteins (e.g. collagens, laminins, thrombospondins) when appropriate. Multimers are treated as permanent complexes.
                                </Typography><br/>
                                <Typography variant={"body1"}>
                                    Experiments are reported according to the Minimum Information required for reporting a Molecular Interaction experiment (MIMIx, <a href="https://www.nature.com/articles/nbt1324">Orchard et al. 2007 Nat. Biotechnol. 25:894-8</a>) or to the International Molecular Exchange curation rules (<a href="https://www.imexconsortium.org/">IMEx</a>, <a href="https://www.nature.com/articles/nmeth.1931">Orchard et al. 2012 Nat. Methods 9:345-350</a>). MatrixDB uses the controlled vocabulary maintained by the Molecular Interactions Working Group of HUPO-Proteomics Standards Initiative.
                                </Typography><br/>
                                <Typography variant={"body1"}>
                                    MatrixDB is one of the services of the French node of <a href="https://www.france-bioinformatique.fr/en/elixir-fr/">ELIXIR (IFB/ELIXIR-FR)</a>, and an active member of the <a href="https://www.imexconsortium.org/">IMEx consortium</a>, which is one of the Global Core Biodata Global Resources since 2023.
                                </Typography><br/>
                                <Typography variant={"body1"}>
                                    Release MatrixDB 5.0 is based on the following source releases:
                                </Typography>
                                <TableContainer component={Paper} variant="outlined" style={{ margin: '12px 0' }}>
                                    <Table size="small" aria-label="Sources of MatrixDB release 4.0">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell><b>Source</b></TableCell>
                                                <TableCell><b>Release</b></TableCell>
                                                <TableCell><b>Provides</b></TableCell>
                                                <TableCell><b>URL</b></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {[
                                                {source: 'IntAct', release: '2026-01', provides: 'Experimentally supported molecular interactions', url: 'https://www.ebi.ac.uk/intact/'},
                                                {source: 'UniProtKB', release: '2026_03', provides: 'Protein sequences and annotations', url: 'https://www.uniprot.org/'},
                                                {source: 'Bgee', release: '2024-08', provides: 'Gene expression (transcriptomic) data', url: 'https://www.bgee.org/'},
                                                {source: 'MatrisomeDB', release: '2.0', provides: 'Matrisome classification and proteomic expression data', url: 'https://matrisomedb.org/'},
                                                {source: 'Integrated Interactions Database (IID)', release: '2024-01', provides: 'Predicted ECM protein-protein interactions (included for the first time in this release)', url: 'https://iid.ophid.utoronto.ca/'},
                                            ].map((row) => (
                                                <TableRow key={row.source}>
                                                    <TableCell>{row.source}</TableCell>
                                                    <TableCell>{row.release}</TableCell>
                                                    <TableCell>{row.provides}</TableCell>
                                                    <TableCell>
                                                        <a href={row.url} target="_blank" rel="noopener noreferrer">{row.url}</a>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <Typography variant="body1" component="div" style={{ display: 'inline-flex', alignItems: 'center' }}>
                                    <span>MatrixDB is distributed under the terms of the Creative Commons Attribution Licence CC BY 4.0</span>
                                    <img src={ccbylogo} style={{
                                        width: '60px',
                                        height: 'auto',
                                        paddingLeft: '10px'
                                    }} className={"App-logo"}/>
                                </Typography>
                            </div>
                            <br/>
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        margin: '0 auto',
                        width: 'max(70%, min(100%, 700px))',
                        marginBottom: '5px',
                        background: 'var(--mdb-panel)',
                        paddingTop: '5px'
                    }}>
                            <Typography
                                variant={'body1'}
                                style={{
                                    fontWeight: 'bold',
                                    marginBottom: '5px',
                                    marginTop: '5px'
                            }}>
                                Publications describing MatrixDB and its updates. Please cite the most recent publication.
                            </Typography>

                            <Typography
                                variant={'body1'}
                                style={{
                                    marginBottom: '5px',
                                    marginTop: '5px',
                                    paddingLeft: '20px'
                                }}>
                                <li>
                                    <a href="https://pubmed.ncbi.nlm.nih.gov/19147664/" target="_blank" rel="noopener noreferrer">MatrixDB, a database focused on extracellular protein-protein and protein-carbohydrate interactions.</a> Chautard E, Ballut L, Thierry-Mieg N, Ricard-Blum S. Bioinformatics <b>(2009)</b> 25:690-1.
                                </li>
                                <li>
                                    <a href="https://pubmed.ncbi.nlm.nih.gov/20852260/" target="_blank" rel="noopener noreferrer">MatrixDB, the extracellular matrix interaction database.</a> Chautard E, Fatoux-Ardore M, Ballut L, Thierry-Mieg N, Ricard-Blum S. Nucleic Acids Res. <b>(2011)</b> 39(Database issue):D235-40.
                                </li>
                                <li>
                                    <a href="https://pubmed.ncbi.nlm.nih.gov/25378329/" target="_blank" rel="noopener noreferrer">MatrixDB, the extracellular matrix interaction database: updated content, a new navigator and expanded functionalities.</a> Launay G, Salza R, Multedo D, Thierry-Mieg N, Ricard-Blum S. Nucleic Acids Res. <b>(2015)</b> 43(Database issue):D321-7.
                                </li>
                                <li>
                                    <a href="https://pubmed.ncbi.nlm.nih.gov/30371822/" target="_blank" rel="noopener noreferrer">MatrixDB: integration of new data with a focus on glycosaminoglycan interactions.</a> Clerc O, Deniaud M, Vallet SD, Naba A, Rivet A, Perez S, Thierry-Mieg N, Ricard-Blum S. Nucleic Acids Res. <b>(2019)</b> 47(D1):D376-D381.
                                </li>
                                <li>
                                    <a href="https://pubmed.ncbi.nlm.nih.gov/39558161/" target="_target">
                                        MatrixDB 2024: an increased coverage of extracellular matrix interactions, a new Network Explorer and a new web interface.
                                    </a> Samarasinghe KW, Kotlyar M, Vallet SD, Hayes C, Naba A, Jurisica I, Lisacek F, Ricard-Blum S. Nucleic Acids Res. <b>(2025)</b> 53(D1):D1677-D1682.
                                    
                                </li>
                            </Typography>
                    </div>
                </div>
            <Footer/>
        </div>
    );
}

export default AboutComponent;