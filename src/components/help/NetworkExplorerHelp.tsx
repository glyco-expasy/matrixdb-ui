import {Box, List, ListItem, ListItemText, Typography} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import React from "react";

import biomoleculeAdd from "../../assets/images/help/biomolecule-add.png";
import biomoleculeAdded from "../../assets/images/help/biomolecule-added.png";
import biomoleculeSearch from "../../assets/images/help/biomolecule-search.png";
import participants from "../../assets/images/help/participants.png";
import resultsWithFilters from "../../assets/images/help/results-with-filters.png";

import networkGenerationExample from "../../assets/videos/network-participant-selection.mp4";
import network1 from "../../assets/images/help/network_1.png";
import network2 from "../../assets/images/help/network_2.png";
import searchHelp from "../../assets/images/help/quick-search-network.mp4";

function NetworkExplorerHelp() {
    return(
        <div style={{
            height: '100vh',
            overflowY: 'auto'
        }}>
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Network Explorer
                </Typography>
                <Typography variant="body1" paragraph>
                    Network Explorer is a graphic and interactive tool providing an interface to explore interaction networks of a selectable biomolecule set. It proceeds in three steps:
                </Typography>

                <Box component="ul" sx={{ pl: 2, mb: 2 }}>
                    <Typography component="li" variant="body2">
                        <strong>1. Search for biomolecules with free text queries</strong>
                    </Typography>
                    <Typography component="li" variant="body2">
                        <strong>2. Select the biomolecules to be added to the network</strong>
                    </Typography>
                    <Typography component="li" variant="body2">
                        <strong>3. Generate an interaction network that can be exported as an image or a Cytoscape format file</strong>
                    </Typography>
                </Box>

                <Typography variant="h6" gutterBottom>
                    Biomolecule Search and Selection
                </Typography>
                <Typography variant="body1" paragraph>
                    Biomolecules can be searched and added to Network Explorer. The selection can be maintained in the browser session, which is useful when a user wishes the tool to remember a list of favorite biomolecules from which to build interaction networks.
                    There are two ways to add biomolecules to the Network Explorer:
                </Typography>

                <Box sx={{ marginBottom: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        From the Biomolecule Page
                    </Typography>
                    <Typography variant="body1" paragraph>
                        In each biomolecule page, the Network Explorer icon is shown in green on the right end side of the top banner (black). When mousing over the icon, a tooltip specifies the identifier/accession number of the biomolecule described in the page and suggests adding it to Network Explorer, which happens upon clicking on the icon.
                        Above the icon, a number shows the size of the pre-existing input selection if Network Explorer was used previously. Clicking on the icon instantly updates the number (+1) and makes the corresponding biomolecule an input of Network Explorer. To go to the Network Explorer page, click on the name itself (Network Explorer).
                    </Typography>

                    <Typography variant="subtitle1" gutterBottom>
                        From the Network Explorer Page
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Depending on the precision of the term input in the search window, the list of results can be limited to one (e.g., if the user entered an accession number) or to many (e.g., when the term is generic, such as 'platelet'). A 'Biomolecule Selection' header is prompted, and below it is a banner with several sections.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Initially, the 'Selected participants' section is empty. The results of the search are shown in another section called 'Search results,' which displays the list of biomolecules matching the search term. The list can be browsed, and items can be selected by clicking on the green circled plus sign.
                        They can also be filtered using criteria listed on the right. The 'Selected participants' section can therefore be gradually populated. From the biomolecules list, you can select the participants for network generation, either one by one or all together (double tick sign).
                        The short video shows the selection process limited to multimers and proteins associated with the GO term 'platelet activating factor receptor activity'.
                    </Typography>
                    <span style={{
                        paddingLeft: "10px"
                    }}>
                        <video
                            src={networkGenerationExample}
                            controls
                            width="600px"
                            style={{ paddingLeft: "10px" }}
                        ></video>
                    </span>
                </Box>

                <Typography variant="h6" gutterBottom>
                    Network Generation
                </Typography>
                <Typography variant="body1" paragraph>
                    Once the participants are selected, click on the network generation icon to generate the resulting network in the network tab. By default, the network includes partners' interactions.
                </Typography>
                <Typography variant="body1" paragraph>
                    The result of the selection shown in the video is illustrated in the screenshot below:
                </Typography>
                <img src={network1} alt="Network Generation example1" width="50%"/>

                <Typography variant="body1" paragraph>
                    If the 'Exclude partner interactions' box is ticked, then the network is only built with binary interactions, as shown in the screenshot below:
                </Typography>
                <img src={network2} alt="Network Generation example2" width="50%"/>

            </Box>

        </div>
    );
}

export default NetworkExplorerHelp;