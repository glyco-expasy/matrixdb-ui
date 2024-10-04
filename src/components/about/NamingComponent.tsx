import Header from "../home/HeaderComponent";
import Footer from "../home/Footer";
import {Divider, List, ListItem, Typography} from "@mui/material";
import React from "react";
function NamingComponent() {
    return(
        <div
            className="App"
            style={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                paddingTop: '20px'
            }}
        >
            <Header pageDetails={{
                type: "about"
            }}/>
            <div>
                <div className="App"
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        margin: '0 auto',
                        width: '70%',
                        marginBottom: '5px',
                        background: 'rgb(197,205,229)',
                        paddingTop: '5px'
                    }}
                >
                    <Typography
                        variant={'body1'}
                        style={{
                            fontWeight: 'bold',
                            marginBottom: '5px',
                            marginTop: '5px'
                        }}>
                        MatrixDB Nomenclature
                    </Typography>
                    <div style={{
                        paddingLeft: '20px',
                        paddingRight: '20px'
                    }}>
                        <Typography
                            variant="body1"
                            style={{
                                fontWeight: 'bold'
                            }}
                        >
                            Biomolecules
                        </Typography>
                        <Typography variant="body2">
                            Custom identifiers are used for all biomolecule types except proteins. An annotated list of these custom identifiers is available in the Download section.
                            Biomolecule types and identifiers are as follows:
                        </Typography>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row'
                        }}>
                            <div style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                backgroundColor: '#f89406',
                                marginRight: '10px'
                            }}></div>
                            <Typography
                                variant="body2"
                                style={{
                                    fontWeight: 'bold'
                                }}
                            >
                                Protein
                            </Typography>
                        </div>
                        <Typography variant="body2">
                            A protein is identified by a UniProtKB - Swiss-Prot/TrEMBL primary Accession Number (Example: P98160). This is the most stable identifier of UniProtKB - Swiss-Prot/TrEMBL. Note that when a protein entry is modified, the previous accession number is retained in a secondary accession number list.
                        </Typography>

                        <Typography variant="body2" paragraph>
                            ECM proteins are annotated as MatrixDB ECM (based on the criteria available in the Download tab) and with matrisome division and category (defined below) when available. The labels are displayed in the top right banner.
                            <div className="row-container" style={{ display: 'flex', gap: '20px' }}>
                                <div className="title-column" style={{ display: 'flex', flexDirection: 'column' }}>
                                    <h5 className="division-title">Division</h5>
                                    <h5 className="category-title">Categories</h5>
                                </div>

                                <div className="categories-container" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                    <div className="category">
                                        <h5 className="category-title">Core Matrisome</h5>
                                        <ul className="subcategory-list" style={{ listStyleType: 'none', paddingLeft: '0' }}>
                                            <li className="subcategory-item">ECM Glycoproteins</li>
                                            <li className="subcategory-item">Proteoglycans</li>
                                            <li className="subcategory-item">Collagens</li>
                                        </ul>
                                    </div>

                                    <div className="category">
                                        <h5 className="category-title">Matrisome-Associated</h5>
                                        <ul className="subcategory-list" style={{ listStyleType: 'none', paddingLeft: '0' }}>
                                            <li className="subcategory-item">ECM Regulators</li>
                                            <li className="subcategory-item">Secreted Factors</li>
                                            <li className="subcategory-item">ECM-Affiliated Proteins</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </Typography>

                        <div style={{
                            display: 'flex',
                            flexDirection: 'row'
                        }}>
                            <div style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                backgroundColor: '#6a09c5',
                                marginRight: '10px'
                            }}></div>
                            <Typography variant="body2" style={{
                                fontWeight: 'bold'
                            }}>Multimer (MULT)</Typography>
                        </div>
                        <Typography variant="body2">
                            A multimer is identified by a MatrixDB-specific identifier "MULT_x_species" or "MULT_x_VARy_species" for molecular isoforms where x and y are numbers. A cross-reference to the EBI Complex Portal is provided when available (e.g., CPX-1713 for native human collagen II).
                        </Typography>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row'
                        }}>
                            <div style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                backgroundColor: '#018FD5',
                                marginRight: '10px'
                            }}></div>
                            <Typography variant="body2" style={{
                                fontWeight: 'bold'
                            }}>Glycosaminoglycan (GAG)</Typography>
                        </div>
                        <Typography variant="body2">
                            A glycosaminoglycan is identified by a MatrixDB-specific identifier "GAG_x" where x is a number. A cross-reference to ChEBI (Chemical Entities of Biological Interest) is provided when available  (e.g., CHEBI:28304 for heparin).
                        </Typography>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row'
                        }}>
                            <div style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                backgroundColor: '#f5e214',
                                marginRight: '10px'
                            }}></div>
                            <Typography variant="body2" style={{
                                fontWeight: 'bold'
                            }}>Bioactive protein fragment (PFRAG) </Typography>
                        </div>
                        <Typography variant="body2">
                            A protein fragment (e.g., a matricryptin or matrikine) is identified by a MatrixDB-specific identifier "PFRAG_x_species" where x is a number. A cross-reference to the PRO feature of UniProtKB is provided when available (e.g., PRO_0000005794 for human endostatin). </Typography>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row'
                        }}>
                            <div style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                backgroundColor: 'black',
                                marginRight: '10px'
                            }}></div>
                            <Typography variant="body2" style={{
                                fontWeight: 'bold'
                            }}>Cation (CAT)</Typography>
                        </div>
                        <Typography variant="body2">
                            A cation is identified by a MatrixDB-specific identifier "CAT_x" where x is a number. A cross-reference to ChEBI (Chemical Entities of Biological Interest) is provided when available (e.g., CHEBI:29108 for calcium). </Typography>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row'
                        }}>
                            <div style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                backgroundColor: 'lightpink',
                                marginRight: '10px'
                            }}></div>
                            <Typography variant="body2" style={{
                                fontWeight: 'bold'
                            }}>Lipid (LIP)</Typography>
                        </div>
                        <Typography variant="body2">
                            A lipid is identified by a MatrixDB-specific identifier "LIP_x" where x is a number. A cross-reference to ChEBI (Chemical Entities of Biological Interest) is provided when available (e.g., CHEBI:18318 for glycolipid sulfatide).</Typography>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row'
                        }}>
                            <div style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                backgroundColor: '#d3b486',
                                marginRight: '10px'
                            }}></div>
                            <Typography variant="body2" style={{
                                fontWeight: 'bold'
                            }}>Synthetic peptides (SPEP)</Typography>
                        </div>
                        <Typography variant="body2">
                            A synthetic or engineered peptide is identified by a MatrixDB-specific identifier "SPEP_x" where x is a number. A cross-reference to ChEBI (Chemical Entities of Biological Interest) or an EBI identifier is provided when available (e.g., EBI-6894609 for the triple-helical FRET peptide substrate THP-15).</Typography>
                        <Typography variant="body2" style={{
                            fontWeight: 'bold'
                        }}>Others</Typography>
                        <Typography variant="body2">
                            Remaining molecules are identified by a MatrixDB-specific identifier "SMALLMOL_x" where x is a number. A cross-reference to ChEBI (Chemical Entities of Biological Interest) is provided when available (e.g., CHEBI:76023 for thioflavin T).
                        </Typography><br/><br/>

                        <Divider/><br/>
                        <Typography
                            variant="body1"
                            style={{
                                fontWeight: 'bold'
                            }}
                        >
                            Interactions
                        </Typography>
                        <Typography variant="body2">
                            MatrixDB uses the following naming convention for pairwise interactions:
                            A pairwise interaction identifier is composed of the two interacting biomolecule identifiers, separated by two underscores. </Typography>
                        <Typography variant="body2">Example interactions:</Typography>
                        <ul>
                            <Typography variant="body2" component="li">CAT_1__O54943</Typography>
                            <Typography variant="body2" component="li">O15496__P12109</Typography>
                        </ul><br/><br/>

                        <Divider/><br/>
                        <Typography
                            variant="body1"
                            style={{
                                fontWeight: 'bold'
                            }}
                        >
                            Experiments
                        </Typography>

                        <Typography variant="body1" paragraph>
                            An experiment identifier for a pairwise interaction is composed of four underscore-separated fields:
                        </Typography>
                        <Typography variant="body1" paragraph>
                            <ul style={{ listStyleType: 'none', padding: 0 }}>
                                <Typography variant="body2" component="li">(1) an interaction identifier</Typography>
                                <Typography variant="body2" component="li">(2) the supporting PubMed Identifier (PMID),</Typography>
                                <Typography variant="body2" component="li">(3) the source database name and</Typography>
                                <Typography variant="body2" component="li">(4) a counter that starts at 1, but is incremented each time a single source database refers to several experiments curated from the same publication and supporting the same interaction.</Typography>
                            </ul>
                        </Typography>

                        <Typography variant="body2" color="textSecondary" paragraph>
                            Examples:
                        </Typography>
                        <ul>
                            <Typography variant="body2" component="li"> A2A3K4__P28482_32296183_intact_1 </Typography>
                            <Typography variant="body2" component="li"> A2A3K4__P28482_32296183_intact_2 </Typography>
                            <Typography variant="body2" component="li"> A2A3K4__P28482_32296183_intact_3 </Typography>
                            <Typography variant="body2" component="li"> CAT_1__P05067_7929392_MatrixDB_1 </Typography>
                            <Typography variant="body2" component="li"> A0AVK6__P05067_21832049_InnateDB_1 </Typography>
                        </ul>

                        <Typography variant="body1" paragraph>
                            An experiment identifier for n-ary interactions is composed of six underscore-separated fields:
                        </Typography>
                        <Typography variant="body1" paragraph>
                            <ul style={{ listStyleType: 'none', padding: 0 }}>
                                <Typography variant="body2" component="li">(1) the interaction identifier of the first two biomolecules </Typography>
                                <Typography variant="body2" component="li">(2) three dots: ... </Typography>
                                <Typography variant="body2" component="li">(3) the identifier of the last biomolecule listed in the interaction </Typography>
                                <Typography variant="body2" component="li">(4) the supporting PubMed Identifier (PMID), </Typography>
                                <Typography variant="body2" component="li">(5) the source database name and </Typography>
                                <Typography variant="body2" component="li">(6) a counter that starts at 1, but is incremented each time a single source database refers to several experiments curated from the same publication and supporting the same interaction.</Typography>
                            </ul>
                        </Typography>

                        <Typography variant="body2" color="textSecondary" paragraph>
                            Examples:
                        </Typography>
                        <ul>
                            <Typography variant="body2" component="li"> A0AVF1__A2A3K4__...__Q9Y6Y8_26673895_intact_1 </Typography>
                            <Typography variant="body2" component="li"> P12109__P48449__...__Q9UIH9_35016035_uniprot_1 </Typography>
                        </ul>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default NamingComponent;