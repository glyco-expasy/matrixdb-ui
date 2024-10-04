import Header from "../home/HeaderComponent";
import Footer from "../home/Footer";
import imexlogo from "../../assets/images/imexlogo.png";
import {Typography} from "@mui/material";
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
                        width: '70%',
                        marginBottom: '5px',
                        background: 'rgb(237, 239, 245)',
                        paddingTop: '20px'
                    }}>

                            <div style={{
                                paddingRight: '20px',
                                paddingLeft: '20px'
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
                                    Release MatrixDB 4.0 (2024-09-01) is based on release 2024-02 of IntAct, release 2024-01 of UniProtKB, release 2024-01 of BGee, release 2.0 of MatrisomeDB. This release also includes for the first time predicted ECM protein-protein interactions from the Integrated Interactions Database (IID) (2024-01)
                                </Typography>
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
                                Publications describing MatrixDB and its updates
                            </Typography>

                            <Typography
                                variant={'body1'}
                                style={{
                                    marginBottom: '5px',
                                    marginTop: '5px',
                                    paddingLeft: '20px'
                                }}>
                                <li>
                                    <a href="https://pubmed.ncbi.nlm.nih.gov/19147664/" target="_blank">MatrixDB, a database focused on extracellular protein-protein and protein-carbohydrate interactions.</a> Chautard E, Ballut L, Thierry-Mieg N, Ricard-Blum S. Bioinformatics <b>(2009)</b> 25:690-1.
                                </li>
                                <li>
                                    <a href="https://pubmed.ncbi.nlm.nih.gov/20852260/" target="_blank">MatrixDB, the extracellular matrix interaction database.</a> Chautard E, Fatoux-Ardore M, Ballut L, Thierry-Mieg N, Ricard-Blum S. Nucleic Acids Res. <b>(2011)</b> 39(Database issue):D235-40.
                                </li>
                                <li>
                                    <a href="https://pubmed.ncbi.nlm.nih.gov/25378329/" target="_blank">MatrixDB, the extracellular matrix interaction database: updated content, a new navigator and expanded functionalities.</a> Launay G, Salza R, Multedo D, Thierry-Mieg N, Ricard-Blum S. Nucleic Acids Res. <b>(2015)</b> 43(Database issue):D321-7.
                                </li>
                                <li>
                                    <a href="https://pubmed.ncbi.nlm.nih.gov/30371822/" target="_blank">MatrixDB: integration of new data with a focus on glycosaminoglycan interactions.</a> Clerc O, Deniaud M, Vallet SD, Naba A, Rivet A, Perez S, Thierry-Mieg N, Ricard-Blum S. Nucleic Acids Res. <b>(2019)</b> 47(D1):D376-D381.
                                </li>
                            </Typography>
                    </div>
                </div>
            <Footer/>
        </div>
    );
}

export default AboutComponent;