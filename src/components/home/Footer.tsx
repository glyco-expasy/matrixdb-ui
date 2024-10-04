import siblogo from "../../assets/images/siblogo.svg";
import snsflogo from "../../assets/images/snsflogo.png";
import ifblogo from "../../assets/images/ifb.png";
import frmlogo from "../../assets/images/frm.png";
import imexlogo from "../../assets/images/imexlogo.png";
import ccbylogo from "../../assets/images/ccby.png";
import React from "react";
import {Grid} from "@mui/material";

function Footer() {
    return(
        <div style={{
            marginTop: 'auto',
            display: 'flex',
            justifyContent: 'center',
            background: 'rgb(136, 132, 132)',
            color: 'white'
        }}>
                <div style={{
                    width: '70%'
                }}>
                    <Grid container spacing={2}>
                        {/* First Row with Images */}
                        <Grid item xs={12} sm={10} style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                                <a href="https://www.sib.swiss" target="_blank" rel="noopener noreferrer">
                                    <img src={siblogo} style={{ width: '80px', height: 'auto', marginRight: '10px' }} className={"App-logo"} alt="SIB Logo" />
                                </a>
                                <a href="https://www.snf.ch" target="_blank" rel="noopener noreferrer">
                                    <img src={snsflogo} style={{ width: '180px', height: 'auto', marginRight: '10px' }} className={"App-logo"} alt="SNSF Logo" />
                                </a>
                                <img src={ifblogo} style={{ width: '150px', height: '50px', marginRight: '10px' }} className={"App-logo"} alt="IFB Logo" />
                                <img src={frmlogo} style={{ width: '80px', height: 'auto' }} className={"App-logo"} alt="FRM Logo" />
                            </div>
                        </Grid>

                        {/* Second Column with Links */}
                        <Grid item xs={12} sm={2} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <ul style={{ listStyleType: 'none', padding: 0, textAlign: 'right', fontSize: '14px', margin: 0 }}>
                                <li style={{ margin: '5px 0' }}>
                                    <a style={{ color: 'white', textDecoration: 'none' }} href="/about">About MatrixDB</a>
                                </li>
                                <li style={{ margin: '5px 0' }}>
                                    <a style={{ color: 'white', textDecoration: 'none' }} href="/naming">MatrixDB Nomenclature</a>
                                </li>
                                <li style={{ margin: '5px 0' }}>
                                    <a style={{ color: 'white', textDecoration: 'none' }} href="/download">Download</a>
                                </li>
                                <li style={{ margin: '5px 0' }}>
                                    <a style={{ color: 'white', textDecoration: 'none' }} href="/networks">Network Explorer</a>
                                </li>
                                <li style={{ margin: '5px 0' }}>
                                    <a style={{ color: 'white', textDecoration: 'none' }} href="/help">Help</a>
                                </li>
                            </ul>
                        </Grid>

                        {/* Second Row with License Info */}
                        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
                                <img src={ccbylogo} style={{
                                    width: '60px',
                                    height: 'auto',
                                    paddingLeft: '20px',
                                    paddingRight: '5px'
                                }} className={"App-logo"}/>
                                <span style={{ fontSize: '14px' }}>
                                    MatrixDB is distributed under the terms of the Creative Commons Attribution Licence CC BY 4.0
                                </span>
                            </div>
                        </Grid>
                    </Grid>
                </div>
                {/*<div style={{
                    display: 'flex',
                    paddingLeft: '200px',
                    paddingRight: '200px'
                }}>
                        <div style={{ flex: '25%' }}>
                            <div>
                                <a href="https://www.sib.swiss" target={'_blank'}>
                                    <img src={siblogo} style={{width: '80px', height: 'auto', paddingLeft: '40px'}} className={"App-logo"}/>
                                </a>
                                <a href="https://www.snf.ch" target={'_blank'}>
                                    <img src={snsflogo} style={{width: '180px', height: 'auto', paddingLeft: '20px'}} className={"App-logo"}/>
                                </a>
                            </div>
                            <div style={{paddingTop: '10px'}}>
                                <img src={ifblogo} style={{width: '150px', height: '50px'}} className={"App-logo"}/>
                                <img src={frmlogo} style={{width: '80px', height: 'auto'}} className={"App-logo"}/>
                            </div>
                        </div>
                    <div style={{ flex: '50%' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img src={imexlogo} style={{ width: '60px', height: 'auto', paddingLeft: '20px' }} className={"App-logo"} alt="IMEx Logo" />
                            <span style={{ fontSize: '13px', paddingLeft: '5px' }}>
                                    MatrixDB is an active member of the International Molecular Exchange (IMEx) consortium. Experiments are reported according to the{' '}
                                <a href="https://pubmed.ncbi.nlm.nih.gov/19670377/">Minimum Information required</a> for reporting a Molecular Interaction experiment or to the{' '}
                                <a href="https://pubmed.ncbi.nlm.nih.gov/22453911/">International Molecular Exchange curation rules.</a>
                                </span>
                        </div>
                        <div>
                            <img src={ccbylogo} style={{width: '60px', height: 'auto', paddingLeft: '20px'}} className={"App-logo"}/>
                            <span style={{fontSize: '10px', paddingLeft: '5px'}}>
                                    MatrixDB is distributed under the terms of the Creative Commons Attribution Licence CC BY 4.0
                                </span>
                        </div>
                    </div>
                    <div style={{ flex: '25%' }}>
                        <ul style={{ listStyleType: 'none', padding: 0,  textAlign: 'right', fontSize: '14px' }}>
                            <li style={{ margin: '5px 0' }} ><a style={{ color: 'white', textDecoration: 'none' }} href="/about">About</a></li>
                            <li style={{ margin: '5px 0' }}><a style={{ color: 'white', textDecoration: 'none' }} href="/statistics">Statistics</a></li>
                            <li style={{ margin: '5px 0' }}><a style={{ color: 'white', textDecoration: 'none' }} href="/networks">Network Explorer</a></li>
                        </ul>
                    </div>
                </div>*/}
        </div>
    );
}

export default Footer;