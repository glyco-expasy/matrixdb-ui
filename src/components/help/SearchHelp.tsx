import {Box, Typography} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import React from "react";

import searchHelp from "../../assets/images/help/quick-search-network.mp4";
import searchResult from "../../assets/images/help/search-results.png";
import searchSeeMore from "../../assets/images/help/search-seemore.png";
import searchAdvaned from "../../assets/images/help/search-advanced.png";

function SearchHelp() {
    return(
        <>
            <Box sx={{ my: 4 }}>
                <Typography variant="body1" paragraph>
                    <strong>MatrixDB</strong> can be searched by inputting biomolecule names, identifiers, acronyms or related publications either as free text (Basic Search) or with more specific queries (Advanced Search).
                </Typography>

                <Typography variant="h6" gutterBottom>
                    Basic Search
                </Typography>
                <Typography variant="body1" paragraph>
                    Basic search is a free text flexible search on the entire database. It outputs a list of biomolecules and/or publications matching partly or fully the searched term. The results are ranked by interaction partner counts (highest to lowest). If this searched term is common (e.g., 'membrane') items of the list are displayed according to a measure of relevance. Relevance is computed on weights assigned to the localisation of the searched term. For example, if the term is in the name of a biomolecule, it will be considered more relevant than if it is found in annotations. The complete list of criteria is available here.
                </Typography>

                <Typography variant="body1" paragraph>
                    Examples of search terms in the different categories are suggested under the input window. They can be tested on the spot.
                    The screenshot below shows an example of searching 'thrombospondin'. The default output is a list of ten biomolecules ordered by relevance ('thrombospondin' is always part of biomolecule names) and ranked from the highest to the lowest number of interaction partners (in this case, counts of interaction partners are larger in human). Note that the reward icon representing relevance is circled on the right side of the banner.
                </Typography>

                <Typography variant="caption" display="block" gutterBottom>
                    <span style={{
                        paddingLeft: "10px"
                    }}>
                        <img src={searchResult} width="600px" alt="search results"/>
                    </span>
                </Typography>

                <Typography variant="body1" paragraph>
                    Results beyond the most relevant results can be viewed by clicking on the eye icon ('see more' view), in which the exhaustive list of results is displayed by blocks of ten and sorted by the corresponding interaction partner counts for each biomolecule.
                </Typography>

                <Typography variant="caption" display="block" gutterBottom>
                    <span style={{
                        paddingLeft: "10px"
                    }}>
                        <img src={searchSeeMore} width="600px" alt="search results"/>
                    </span>
                </Typography>

                <Typography variant="body1" paragraph>
                    Results can be further filtered via clicking on the filter icon. Filters encompass the selection of biomolecule types or properties including species or associated GO terms. A short demo of the use of filters with the search for 'thrombospondin' is shown below.
                </Typography>

                <Typography variant="caption" display="block" gutterBottom>
                    <span style={{
                        paddingLeft: "10px"
                    }}>
                        <video
                            src={searchHelp}
                            controls
                            width="600px"
                            style={{ paddingLeft: "10px" }}
                        ></video>
                    </span>
                </Typography>

                <Typography variant="h6" gutterBottom>
                    Advanced Search
                </Typography>
                <Typography variant="body1" paragraph>
                    Advanced search is more targeted and designed to search the database with specific properties of biomolecules. Consequently, in this case, a prefix with a semi-column is expected before the search term.
                </Typography>

                <Typography variant="body1" paragraph>
                    Examples of search terms in the different categories are suggested under the input window. They can be tested on the spot.
                    The example below shows how to retrieve the ADAM1 gene entry from the database.
                </Typography>

                <Typography variant="caption" display="block" gutterBottom>
                    <span style={{
                        paddingLeft: "10px",
                        paddingBottom: "30px"
                    }}>
                        <img src={searchAdvaned} width={"600px"} alt="search advanced"/>
                    </span>
                </Typography>

                <Typography variant="body1" paragraph>
                    More generally, biomolecules can be searched with properties such as identifier or name (see MatrixDB nomenclature page), but also annotations such as GO terms or matrisome (sub)categories.
                    Terms can be combined with a logical AND
                </Typography>
            </Box>
        </>
    );
}

export default SearchHelp;