import {Box, Divider, List, ListItem, ListItemText, Typography} from "@mui/material";
import React from "react";
import CircleIcon from "@mui/icons-material/Circle";

import ecmness from "../../assets/images/help/ecmness.png";
import searchResult from "../../assets/images/help/search-results.png";

function BiomoleculeHelp() {
    return(
            <Box sx={{ my: 4, paddingBottom: '20px' }}>
                <Typography variant="h6" gutterBottom>
                    Overview of Sections
                </Typography>
                <Typography variant="body1" paragraph>
                    A biomolecule page is organised in four sections:
                </Typography>
                <List>
                    <ListItem>
                        <ListItemText primary="1. Overview" />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="2. Interactions" />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="3. Expression" />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="4. Structure" />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="5. Annotations" />
                    </ListItem>
                </List>
                <Typography variant="body1" paragraph>
                    Each is directly accessible via a menu on the top left. If no information can be shown in a section, the name of this section will not feature in the top left menu.
                </Typography>

                <Divider />

                <Typography variant="h6" gutterBottom sx={{ marginTop: 2 }}>
                    Overview Section
                </Typography>
                <Typography variant="body1" paragraph>
                    The overview section provides the name(s) and identifier of the biomolecule. Further information is available in several tabs, shown only if information is available.
                </Typography>

                <Typography variant="subtitle1" gutterBottom>
                    If the biomolecule is a protein:
                </Typography>
                <ul>
                    <li>A description of the biological function(s) (source: UniProt)</li>
                    <li>Details of cellular location (source: UniProt)</li>
                    <li>A list of protein family/domain annotation (source: UniProt/InterPro)</li>
                    <li>Cross-references to UniProt and possible PFRAG related entries</li>
                </ul>

                <Typography variant="subtitle1" gutterBottom>
                    If the biomolecule is a multimer:
                </Typography>
                <ul>
                    <li>A description and number of assembled chains (source: Complex Portal)</li>
                    <li>Details of the biological function(s) (source: Complex Portal)</li>
                    <li>Cross-references to Complex Portal</li>
                </ul>

                <Typography variant="subtitle1" gutterBottom>
                    If the biomolecule is a glycosaminoglycan:
                </Typography>
                <ul>
                    <li>A description of the structure (source: ChEBI)</li>
                    <li>In-house annotation of the GAG sequence</li>
                    <li>Details of cellular location (source: ?)</li>
                    <li>A depiction of the molecule in the <a href="https://www.ncbi.nlm.nih.gov/glycans/snfg.html" target="_blank">Symbol Nomenclature for Glycans (SNFG)</a></li>
                    <li>The GlycoCT encoding of the GAG structure</li>
                    <li>Cross-references to GlyTouCan and ChEBI</li>
                </ul>

                <Typography variant="subtitle1" gutterBottom>
                    If the biomolecule is a cation, a small molecule, or a synthetic peptide:
                </Typography>
                <ul>
                    <li>Cross-references to <a href="https://www.ebi.ac.uk/chebi/">ChEBI</a></li>
                </ul>

                <Typography variant="body1" paragraph>
                    ECMness label is displayed in the top right banner for proteins, based on the ECMness criterion of MatrixDB ('MatrixDB ECM' blue capsule) and MatrisomeDB categories and subcategories, defined as:
                    <div className="category">
                        <h5 className="category-title">Core Matrisome</h5>
                        <ul className="subcategory-list">
                            <li className="subcategory-item">ECM Glycoproteins</li>
                            <li className="subcategory-item">Proteoglycans</li>
                            <li className="subcategory-item">Collagens</li>
                        </ul>
                    </div>

                    <div className="category">
                        <h5 className="category-title">Matrisome-Associated</h5>
                        <ul className="subcategory-list">
                            <li className="subcategory-item">ECM Regulators</li>
                            <li className="subcategory-item">Secreted Factors</li>
                            <li className="subcategory-item">ECM-Affiliated Proteins</li>
                        </ul>
                    </div>
                </Typography>

                <Divider />

                <Typography variant="h6" gutterBottom sx={{ marginTop: 2 }}>
                    Interactions Section
                </Typography>
                <Typography variant="body1" paragraph>
                    The 'Interactions' section shows the full set of biomolecules interacting with the biomolecule described above (subject of the page). Information is first summarised with three figures:
                </Typography>

                <Box component="ul" sx={{ pl: 2, mb: 2 }}>
                    <Typography component="li" variant="body2">
                        <strong>Number of Participants:</strong> counts the number of biomolecules interacting with the subject biomolecule (including self-interactions).
                    </Typography>
                    <Typography component="li" variant="body2">
                        <strong>Number of Experimentally Supported Interactions:</strong> counts the number of interactions with experimental evidence.
                    </Typography>
                    <Typography component="li" variant="body2">
                        <strong>Number of Predicted Interactions:</strong> counts the number of predicted interactions.
                    </Typography>
                </Box>

                <Typography variant="body1" paragraph>
                    Below, two alternative views are available. In the <strong>Interaction list view</strong>, binary interactions are displayed in a list. In the <strong>Network view</strong>, a network is visualised using the Cytoscape software.
                    Visit <a href="https://cytoscape.org" target="_blank" rel="noopener noreferrer">Cytoscape</a> for more details.
                </Typography>

                <Box sx={{ marginBottom: 2 }}>
                    <Typography variant="body2" gutterBottom>
                        Interaction List View
                    </Typography>
                    <Typography variant="body1" paragraph>
                        The list of binary interactions with the subject biomolecule is shown by series of ten in an interactive six-column table:
                    </Typography>
                    <Box component="ul" sx={{ pl: 2 }}>
                        <Typography component="li" variant="body2">
                            <strong>Participant:</strong> provides the full name of each biomolecule participating in the interaction.
                        </Typography>
                        <Typography component="li" variant="body2">
                            <strong>Interactions:</strong> describes the interaction with biomolecule identifiers.
                        </Typography>
                        <Typography component="li" variant="body2">
                            <strong>Non-expanded*:</strong> counts the number of direct interactions, as provided in the source database. Mousing over a number triggers a tooltip with link(s) to experimental evidence.
                        </Typography>
                        <Typography component="li" variant="body2">
                            <strong>Spoke Expanded*:</strong> counts the number of associations, as provided in the source database. Mousing over a number triggers a tooltip with link(s) to experimental evidence.
                        </Typography>
                        <Typography component="li" variant="body2">
                            <strong>MI score:</strong> specifies the molecular interaction score when provided by the source database.
                        </Typography>
                        <Typography component="li" variant="body2">
                            <strong>Type:</strong> specifies whether the interaction is experimentally supported or predicted.
                        </Typography>
                    </Box>
                    <Typography variant="caption" display="block" paragraph>
                        The table can be exported as a .csv file.
                    </Typography>
                </Box>

                <Box sx={{ marginBottom: 2 }}>
                    <Typography variant="body2" gutterBottom>
                        Network View
                    </Typography>
                    <Typography variant="body1" paragraph>
                        All listed binary interactions of the previous view are mapped to an interactive graph, where each node is a biomolecule and an edge is an interaction. Mousing over a node prompts the display of its name in the upper left side banner.
                        The color code for the nodes and the edges is summarised in a legend featured in the lower left side banner. The graph is interactive so nodes can be moved around and edges can be lengthened or shortened simply by holding the mouse on a node.
                        For users unfamiliar with Cytoscape, it may be helpful to consider the corresponding
                        <a href="https://cytoscape.org/documentation_users.html" target="_blank" rel="noopener noreferrer"> documentation</a>.
                    </Typography>
                    <Typography variant="body2" paragraph>
                        The graph can be exported as a Cytoscape file (Cytoscape icon, top left) or as an image (camera icon, top left). The video below highlights the display of the Network view of the human Toll-like receptor 4 and the use of the Quick search window to focus on a selection of participants (all protein names including 'factor' in this example).
                    </Typography>
                    <Typography variant="body2" paragraph>
                        Interactions can be filtered with parameters displayed on the right side of the graph. The video below shows an example of use.
                    </Typography>
                    <Typography variant="body2" paragraph>
                        Source databases may provide refined information on a precise protein isoform involved in the interaction.
                    </Typography>
                </Box>

                <Divider />

                <Box sx={{ marginBottom: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Expression Section (for proteins only)
                    </Typography>
                    <Typography variant="body1" paragraph>
                        This section shows in the first tab (Transcriptomics data) the RNA expression associated with the subject protein based on the Genotype-Tissue Expression (GTEx) project data processed by the BGee pipeline. The anatomogram is borrowed from the
                        <a href="https://www.ebi.ac.uk/gxa/home" target="_blank" rel="noopener noreferrer"> Expression Atlas</a>. The heat map reflects expression measured in TPM.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        The second tab (Proteomics data) also displays in a heat map the subject protein expression data extracted from MatrisomeDB datasets.
                    </Typography>
                </Box>

                <Divider />

                <Box sx={{ marginBottom: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        3D Structure Section
                    </Typography>
                    <Typography variant="body1" paragraph>
                        The 3-dimensional structure of biomolecules is shown when available and extracted from the Protein Data Bank (PDB). Structures are displayed in 3D with the Mol-* visualization library.
                        For more details, visit <a href="https://molstar.org" target="_blank" rel="noopener noreferrer">Molstar</a>. When binding regions are specified in the source databases, it is possible to highlight them by clicking on the eye icon next to amino acid coordinates, as shown in the screenshot below:
                    </Typography>
                </Box>

                <Divider />

                <Box>
                    <Typography variant="h6" gutterBottom>
                        Annotations Section
                    </Typography>
                    <Typography variant="body1" paragraph>
                        This section consists of three tabs encompassing GO terms, UniProt keywords, and Reactome pathways associated with the subject protein or multimer. These annotations are listed with corresponding cross references in their respective tab.
                    </Typography>
                </Box>
            </Box>
    );
}

export default BiomoleculeHelp;