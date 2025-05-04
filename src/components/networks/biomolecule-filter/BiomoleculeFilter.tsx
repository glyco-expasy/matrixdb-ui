import {SimpleTreeView} from "@mui/x-tree-view/SimpleTreeView";
import {TreeItem} from "@mui/x-tree-view/TreeItem";
import {Box, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import http from "../../../commons/http-commons";

interface BiomoleculeFilterProps {
    searchQuery: string;
    biomolecules: any;
    onFilterSelection: (filterCriteria: any) => void;
}


function BiomoleculeFilter(props: any) {
    const { searchQuery, biomolecules, onFilterSelection } = props;
    const [filter, setFilter] = useState<Map<string, any> | null>(null);
    const [ncbiTaxonomy, setncbiTaxonomy] = useState<any | null>(null);
    const [expanded, setExpanded] = useState<string[]>([]);
    const [selected, setSelected] = useState<string | null>(null);

    useEffect(() => {
        // Group by the different categories
        // Proteins
        // - species
        // - go terms
        // - uniprot keywords
        // Pfrag
        // - species
        // Multimer
        // - species
        // - go terms
        let filter: Map<string, any> = new Map<string, any>();
        biomolecules.forEach((biomolecule: any) => {
            let type = biomolecule.biomolecule_type;

            // set/update type
            if (!filter.has(type)) {
                filter.set(type, {
                    count: 0,
                    species: {},
                    goTerms: {},
                    keywords: {}
                });
            }
            let currentType = filter.get(type);
            currentType.count += 1;

            let species = biomolecule?.species;
            if (species) {
                if (!(species in currentType.species)) {
                    currentType.species[species] = 0;
                }
                currentType.species[species] += 1;
            }

            let goTerms = biomolecule?.go_names;
            if (goTerms) {
                goTerms.split(';').forEach((goTerm: string) => {
                    if (goTerm.toLowerCase().includes(searchQuery.toLowerCase())) {
                        if (!(goTerm in currentType.goTerms)) {
                            currentType.goTerms[goTerm] = 0;
                        }
                        currentType.goTerms[goTerm] += 1;
                    }
                });
            }
        });
        setFilter(filter);

    }, [searchQuery, biomolecules]);

    useEffect(() => {
        if (!ncbiTaxonomy) {
            http.get("/metadata/ncbi")
                .then((ncbiResponse: any) => {
                    interface NcbiData {
                        commonName: string;
                        name: string;
                    }
                    let ncbiMap: { [key: string]: NcbiData } = {};

                    if (ncbiResponse.data.ncbi) {
                        Object.keys(ncbiResponse.data.ncbi).forEach((ncbiId: any) => {
                            ncbiMap[ncbiId] = {
                                commonName: ncbiResponse.data.ncbi[ncbiId].common_name,
                                name: ncbiResponse.data.ncbi[ncbiId].name
                            }
                        });
                        setncbiTaxonomy(ncbiMap);
                    }
                });
        }
    }, []);

    const handleToggle = (event: any, itemId: string, isExpanded: boolean,) => {
        //setExpanded(nodeIds);
        console.log(itemId)
        //setExpanded([itemId])

        const nodeIdParts = itemId.split('_');
        const rootId = nodeIdParts[0];
        const expandedNodes = [rootId];
        if (nodeIdParts.length > 1) {
            expandedNodes.push(`${rootId}_${nodeIdParts[1]}`);
        }
        setExpanded(expandedNodes);

        // Determine type and value based on the node ID
        let type = nodeIdParts.length === 3 ? nodeIdParts[1] : 'biomolecule';
        let value = nodeIdParts.length === 3 ? nodeIdParts[2] : nodeIdParts[0];
        console.log(type)
        console.log(value)
        onFilterSelection({
            type,
            value
        });
    };

    const handleChange = (event: any, itemIds: string[]) => {
        console.log(itemIds)

        // only expand the current tree path
        let firstItem = itemIds[0];
        let itemComponents = firstItem.split('_');

        let expandItems = [];
        if(itemComponents.length > 1) {
            let itemCategory = itemComponents[0];
            expandItems.push(firstItem);
            expandItems.push(itemCategory);
        } else {
            expandItems.push(firstItem);
        }

        setExpanded(expandItems);
        /*setSelected(nodeId);
        const nodeIdParts = nodeId.split('_');
        const rootId = nodeIdParts[0];
        const expandedNodes = [rootId];
        if (nodeIdParts.length > 1) {
            expandedNodes.push(`${rootId}_${nodeIdParts[1]}`);
        }
        setExpanded(expandedNodes);

        // Determine type and value based on the node ID
        let type = nodeIdParts.length === 3 ? nodeIdParts[1] : 'biomolecule';
        let value = nodeIdParts.length === 3 ? nodeIdParts[2] : nodeIdParts[0];

        onFilterSelection({
            type,
            value
        });*/
    };

    return (
        <>
            <div
                style={{
                    background: "#e0e7f2",
                    height: '70px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '5px',
                    paddingLeft: '5px'
                }}
            >
                <Typography style={{
                    fontWeight: 'bold',
                    color: 'darkblue'
                }} variant="body2">
                    Filters
                </Typography>
            </div>
            <Box sx={{
                height: 264,
                flexGrow: 1,
                maxWidth: 400
            }}>
                {
                    filter && ncbiTaxonomy &&
                    <SimpleTreeView
                        expandedItems={expanded}
                        selectedItems={selected}
                        onItemSelectionToggle={handleToggle}
                        onExpandedItemsChange={handleChange}
                    >
                        {
                            Array.from(filter.keys()).map((key: string) => (
                                <TreeItem
                                    key={key}
                                    itemId={key}
                                    label={key}
                                >
                                    {
                                        Object.keys(filter.get(key)).map((subKey: any) => {
                                            if (subKey !== "count" && Object.keys(filter.get(key)[subKey]).length > 0) {
                                                return (
                                                    <TreeItem
                                                        key={`${key}_${subKey}`}
                                                        itemId={`${key}_${subKey}`}
                                                        label={subKey}
                                                    >
                                                        {
                                                            Object.keys(filter.get(key)[subKey]).map((nestedKey: any) => {
                                                                let label = nestedKey;
                                                                if (subKey === 'species') {
                                                                    label = ncbiTaxonomy[nestedKey] ? ncbiTaxonomy[nestedKey].name : nestedKey;
                                                                }
                                                                return (
                                                                    <TreeItem
                                                                        key={`${key}_${subKey}_${nestedKey}`}
                                                                        itemId={`${key}_${subKey}_${nestedKey}`}
                                                                        label={label}
                                                                    />
                                                                )
                                                            })
                                                        }
                                                    </TreeItem>
                                                );
                                            } else {
                                                return null;
                                            }
                                        })
                                    }
                                </TreeItem>
                            ))
                        }
                    </SimpleTreeView>
                }
            </Box>
        </>
    );
}

export default BiomoleculeFilter;