import {Box, Grid, IconButton, Tab, Tabs} from "@mui/material";
import Typography from "@mui/material/Typography";
import CircleIcon from "@mui/icons-material/Circle";
import Card from "@mui/material/Card";
import React, {useEffect, useState} from "react";
import SearchBoxComponent from "./SearchBoxComponent";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import HelpDrawerComponent from "../help/HelpDrawerComponent";

const searchBoxCardStyle = {
    display: 'flex',
    flexDirection: 'column',
    background: 'rgb(197, 205, 229)',
    borderRadius: 0
} as React.CSSProperties;

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function BasicSearchInstructions() {
    return(
        <Grid container spacing={0}>
            <Grid item xs={12} sm={6}>
                <Typography
                    variant="body2"
                    style={{
                        paddingTop: "8px",
                        paddingLeft: "5px"
                    }}
                >
                    <CircleIcon style={{
                        fontSize: "0.6em",
                        paddingRight: "4px"
                    }}/>
                    Biomolecule name : <a href="/search?query=heparin">heparin</a>
                </Typography>
                <Typography
                    variant="body2"
                    style={{
                        paddingTop: "8px",
                        paddingLeft: "5px",
                    }}
                >
                    <CircleIcon style={{
                        fontSize: "0.6em",
                        paddingRight: "4px"
                    }}/>
                    Gene name: <a href="/search?query=LOX">LOX</a>
                </Typography>
                <Typography
                    variant="body2"
                    style={{
                        paddingTop: "8px",
                        paddingLeft: "5px",
                    }}
                >
                    <CircleIcon style={{
                        fontSize: "0.6em",
                        paddingRight: "4px"
                    }}/>
                    ChEBI identifier: <a href="/search?query=chebi:28304">CHEBI:28304</a>
                </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Typography
                    variant="body2"
                    style={{
                        paddingTop: "8px"
                    }}
                >
                    <CircleIcon style={{
                        fontSize: "0.6em",
                        paddingRight: "4px"
                    }}/>
                    UniProt accession : <a href="/search?query=P12109">P12109</a>
                </Typography>
                <Typography
                    variant="body2"
                    style={{
                        paddingTop: "8px"
                    }}
                >
                    <CircleIcon style={{
                        fontSize: "0.6em",
                        paddingRight: "4px"
                    }}/>
                    Complex Portal: <a href="/search?query=cpx-1650">CPX-1650</a>
                </Typography>
                <Typography
                    variant="body2"
                    style={{
                        paddingTop: "8px"
                    }}
                >
                    <CircleIcon style={{
                        fontSize: "0.6em",
                        paddingRight: "4px"
                    }}/>
                    PubMed identifiers: <a href="/search?query=28106549">28106549</a>
                </Typography>
            </Grid>
        </Grid>
    )
}

function AdvancedSearchInstructions() {
    return(
        <Grid container spacing={0}>
            <Grid item xs={12} sm={6}>
                <Typography
                    variant="body2"
                    style={{
                        paddingTop: "8px",
                        paddingLeft: "5px"
                    }}
                >
                    <CircleIcon style={{
                        fontSize: "0.6em",
                        paddingRight: "4px"
                    }}/>
                    Biomolecule properties : <a href="/search?query=id:gag_1&mode=1">id:GAG_1</a> <a href="/search?query=name:fibronectin&mode=1">name:Fibronectin</a>
                </Typography>
                <Typography
                    variant="body2"
                    style={{
                        paddingTop: "8px",
                        paddingLeft: "5px",
                    }}
                >
                    <CircleIcon style={{
                        fontSize: "0.6em",
                        paddingRight: "4px"
                    }}/>
                    Gene name: <a href="/search?query=gene:LOX&mode=1">gene:LOX</a>
                </Typography>
                <Typography
                    variant="body2"
                    style={{
                        paddingTop: "8px",
                        paddingLeft: "5px",
                    }}
                >
                    <CircleIcon style={{
                        fontSize: "0.6em",
                        paddingRight: "4px"
                    }}/>
                    GO Terms, UniProt Keywords: <a href="/search?query=go:cytosol&mode=1">go:cytosol</a> <a href="/search?query=keywords:Metal-binding&mode=1">keywords:Metal-binding</a>
                </Typography>
                <Typography
                    variant="body2"
                    style={{
                        paddingTop: "8px",
                        paddingLeft: "5px",
                    }}
                >
                    <CircleIcon style={{
                        fontSize: "0.6em",
                        paddingRight: "4px"
                    }}/>
                    Reactome: <a href="/search?query=reactome:ECM proteoglycans&mode=1">reactome:ECM proteoglycans</a>
                </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Typography
                    variant="body2"
                    style={{
                        paddingTop: "8px"
                    }}
                >
                    <CircleIcon style={{
                        fontSize: "0.6em",
                        paddingRight: "4px"
                    }}/>
                    Matrisome division: <a href="/search?query=matrisome_division:matrisome-associated&mode=1">matrisome_division:matrisome-associated</a>
                    {/*<a href="/search?query=matrisome_division:matrisome-associated">matrisome:matrisome_associated</a>*/}
                </Typography>
                <Typography
                    variant="body2"
                    style={{
                        paddingTop: "8px"
                    }}
                >
                    <CircleIcon style={{
                        fontSize: "0.6em",
                        paddingRight: "4px"
                    }}/>
                    Matrisome category: <a href="/search?query=matrisome_category:ecm regulators&mode=1">matrisome_category:ecm regulators</a>
                    {/*<a href="/search?query=matrisome_division:matrisome-associated">matrisome:matrisome_associated</a>*/}
                </Typography>

                <Typography
                    variant="body2"
                    style={{
                        paddingTop: "8px"
                    }}
                >
                    <CircleIcon style={{
                        fontSize: "0.6em",
                        paddingRight: "4px"
                    }}/>
                    GO term AND Species: <a href="/search?query=go:cytosol and species:homo sapiens&mode=1">go:cytosol and species:homo sapiens</a>
                </Typography>
                <Typography
                    variant="body2"
                    style={{
                        paddingTop: "8px"
                    }}
                >
                    <CircleIcon style={{
                        fontSize: "0.6em",
                        paddingRight: "4px"
                    }}/>
                    Matrisome subcategory AND Species: <a href="/search?query=matrisome_subcategory:ecm regulators and species:homo sapiens&mode=1">matrisome_subcategory:ecm regulators and species:homo sapiens</a>
                </Typography>
            </Grid>
        </Grid>
    )
}

function ComplexSearchBoxComponents(props: any) {

    const [searchMode, setSearchMode] = useState<string>('0');
    const [searchQuery, setSearchQuery] = useState<string| null>(null);
    const [tabValue, setTabValue] = useState<number>(0);
    const [openHelp, setOpenHelp] = useState(false);


    useEffect(() => {
        setSearchMode(props.searchMode);
        setTabValue(parseInt(props.searchMode));
    }, [props.searchMode]);

    useEffect(() => {
        setSearchQuery(props.searchQuery);
    }, [props.searchQuery]);

    const onSearchTextChange = (e : any) => {
        setSearchQuery(e.target.value);
    }

    const onPressEnter = (e: React.KeyboardEvent, searchQuery: string) =>{
        if(!searchQuery) return;
        let clearedSearchQuery = searchQuery.replace(/:\s+/g, ':');
        props.onLaunchSearch(clearedSearchQuery, searchMode);
    }

    const onClickSearch = (query: string | null) => {
        if(!query) query = searchQuery;
        props.onLaunchSearch(query, searchMode);
    }

    const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
        return (
            <div role="tabpanel" hidden={value !== index}>
                {value === index && <Box>{children}</Box>}
            </div>
        );
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
        if(newValue === 0) {
            setSearchMode('0');
        }

        if(newValue === 1) {
            setSearchMode('1');
        }
    };

    return(
        <Card style={{ flex: '1', ...searchBoxCardStyle }}>
            <div style={{
                display: 'flex',
                alignItems: 'left',
                justifyContent: 'left'
            }}>
                <Tabs value={tabValue} onChange={handleTabChange} centered>
                    <Tab label="Basic Search" />
                    <Tab label="Advanced Search" />
                </Tabs>
            </div>
            <TabPanel value={tabValue} index={0}>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    paddingLeft: "10px",
                    paddingTop: "10px",
                    paddingBottom: "10px"
                }}>
                    <div style={{
                        display: "flex",
                        width: "95%"
                    }}>
                    <SearchBoxComponent
                        onClickSearch={onClickSearch}
                        onPressEnter={onPressEnter}
                        onSearchTextChange={onSearchTextChange}
                        searchQuery={searchQuery}
                    />
                    </div>
                    <div style={{
                        display: "flex",
                        width: "5%",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <IconButton
                            onClick={() => setOpenHelp(true)}
                            size={'small'}
                        >
                            <HelpOutlineIcon/>
                        </IconButton>
                        <HelpDrawerComponent
                            helpType="SEARCH"
                            open={openHelp}
                            onClose={() => setOpenHelp(false)}
                        />
                    </div>
                </div>
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingBottom: "5px"
                }}>
                    <div style={{
                        width: "80%"
                    }}>
                        <BasicSearchInstructions/>
                    </div>
                </div>
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    paddingLeft: "10px",
                    paddingTop: "10px",
                    paddingBottom: "10px"
                }}>
                    <div style={{
                        display: "flex",
                        width: "95%"
                    }}>
                        <SearchBoxComponent
                            onClickSearch={onClickSearch}
                            onPressEnter={onPressEnter}
                            onSearchTextChange={onSearchTextChange}
                            searchQuery={searchQuery}
                        />
                    </div>
                    <div style={{
                        display: "flex",
                        width: "5%",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <IconButton
                            onClick={() => setOpenHelp(true)}
                            size={'small'}
                        >
                            <HelpOutlineIcon/>
                        </IconButton>
                        <HelpDrawerComponent
                            helpType="SEARCH"
                            open={openHelp}
                            onClose={() => setOpenHelp(false)}
                        />
                    </div>
                </div>
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingBottom: "5px"
                }}>
                    <div style={{
                        width: "80%"
                    }}>
                        <AdvancedSearchInstructions/>
                    </div>
                </div>
            </TabPanel>
        </Card>
    );
}

export default ComplexSearchBoxComponents;