import React, {useEffect, useState} from "react";
import {
    Alert, Box, Card, Grid,
    IconButton, LinearProgress,
    Typography, Tabs, Tab, Paper
} from "@mui/material";
import AssociationNetworkComponent from "./AssociationNetworkComponent";
import http from "../../commons/http-commons";
import Header from "../home/HeaderComponent";
import Footer from "../home/Footer";
import {connect} from "react-redux";
import {AppDispatch, RootState} from "../../stateManagement/store";
import * as actions from "../../stateManagement/actions";
import SearchBoxComponent from "../search/SearchBoxComponent";
import CircleIcon from "@mui/icons-material/Circle";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import HelpDrawerComponent from "../help/HelpDrawerComponent";
import BiomoleculeSelectionComponent from "./BiomoleculeSelectionComponent";
import {getFromLocalStorage, saveToLocalStorage} from "../../commons/memory-manager";
import NetworkParticipantBoard from "./NetworkParticipantBoardComponent";
import InfiniteScrollingList from "../commons/lists/InfinteScrollingList";
import BiomoleculeCard from "../commons/cards/BiomoleculeCards";
import BiomoleculeFilter from "./biomolecule-filter/BiomoleculeFilter";

const mapStateToProps = (state: RootState) => ({
    currentState: state.currentState,
    filterConfiguration: state.filterConfiguration,
    filters: state.filters,
    network: state.network
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    setNetworkDataAction: (networkData: any) => dispatch(actions.setNetworkDataAction(networkData))
});

const connector = connect(mapStateToProps, mapDispatchToProps);


const NetworkExplorer: React.FC<any> = ({
                                          setNetworkDataAction
                                        }) => {

    const [searchQuery, setSearchQuery] = useState<string|null>(null);
    const [loadingNetwork, setLoadingNetwork] = useState<boolean>(false);
    const [biomolecules, setBiomolecules] = useState<any[] | []>([]);
    const [selectedParticipants, setSelectedParticipants] = useState<any[] | []>([]);

    const [network, setNetwork] = useState<any | null>(null);
    const [networkGenerationError, setNetworkGenerationError] = useState<boolean>(false);
    const [open, setOpen] = useState(false);

    const searchBoxCardStyle = {
        display: 'flex',
        flexDirection: 'column',
        background: 'rgb(197, 205, 229)',
        borderRadius: 0
    } as React.CSSProperties;

    useEffect(() => {
        let biomolecules = getFromLocalStorage("selectedBiomolecules");
        if(!biomolecules) biomolecules = [];

        http.get(`/search?query=id:${biomolecules.join(',')}&mode=1`)
            .then((searchResponse) => {
                setBiomolecules(searchResponse.data.biomolecules);
            });
    }, []);

    const onParticipantAdd = (biomolecule: any[]) => {
        let newSelectedBiomolecules = [...selectedParticipants, ...biomolecule];
        let uniqueBiomolecules = new Map(newSelectedBiomolecules.map(item => [item.biomolecule_id, item]));
        setSelectedParticipants([...uniqueBiomolecules.values()]);

        //let biomolecules = getFromLocalStorage("selectedBiomolecules");
        //saveToLocalStorage("selectedBiomolecules", [...biomolecules, biomolecule.biomolecule_id]);
        //props.onSelectionChange(newSelectedBiomolecules);
    }

    const onParticipantRemove = (biomoleculeToRemove: any) => {
        let newSelectedBiomolecules = selectedParticipants
            .filter((biomolecule: any) => biomolecule.biomolecule_id !== biomoleculeToRemove.biomolecule_id);
        setSelectedParticipants(newSelectedBiomolecules);
        //props.onSelectionChange(newSelectedBiomolecules);
    }

    const onGenerateNetwork = (onlyDirectPartners: boolean) => {
        generateNetwork(onlyDirectPartners);
    }

    const onSelectionChange = (selectedBiomolecules: any) => {
        setSelectedParticipants(selectedBiomolecules);
    }

    const generateNetwork = (onlyDirectPartners: boolean) => {
        if(selectedParticipants && selectedParticipants.length > 0 ) {
            setLoadingNetwork(true);
            setValue(1);
            let biomoleculeIds = selectedParticipants.map((biomolecule: any) => biomolecule.biomolecule_id);
            http.post("/network", {
                biomolecules: biomoleculeIds,
                onlyDirectPartners: onlyDirectPartners
            })
                .then((networkResponse) => {
                    setNetworkDataAction(networkResponse.data);
                    setNetwork({
                        participantIds: networkResponse.data.participants,
                        associations: networkResponse.data.associations
                    });
                    setLoadingNetwork(false);
                    setNetworkGenerationError(false);
                })
                .catch((reason: any) => {
                    setNetworkGenerationError(true);
                });
        }
    };

    const onPressEnter = (e: React.KeyboardEvent, searchQuery: string) =>{
        setSearchQuery(searchQuery);
    };

    const onClickSearch = (query: string) => {
        setSearchQuery(query);
    }

    const onSearchTextChange = (e : any) => {
        setValue(0);
        setSearchQuery(e.target.value);
    }

    const [value, setValue] = useState<number>(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    interface TabPanelProps {
        children?: React.ReactNode;
        index: number;
        value: number;
    }
    const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`ne-tabs-${index}`}
                aria-labelledby={`ne-tabs-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ p: 3 }}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    };

    return (
        <div
            className="App"
            style={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh'
            }}
        >
            <Header
                pageDetails={{
                    type: 'network',
                }}
            />
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <div style={{
                    display: 'flex',
                    background: '#e0e7f2',
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <div style={{
                        width: '70%',
                        paddingBottom: '10px',
                        paddingTop: '20px'
                    }}>
                        <Box sx={{
                            backgroundColor: 'lightcoral'
                        }}>
                            <Card style={{ flex: '1', ...searchBoxCardStyle }}>
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
                                        />
                                    </div>
                                    <div style={{
                                        display: "flex",
                                        width: "5%",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                        <IconButton
                                            onClick={() => setOpen(true)}
                                            size={'small'}
                                        >
                                            <HelpOutlineIcon/>
                                        </IconButton>
                                        <HelpDrawerComponent
                                            helpType="NETWORK_EXPLORER"
                                            open={open}
                                            onClose={() => setOpen(false)}
                                        />
                                    </div>
                                </div>
                            </Card>
                        </Box>
                    </div>
                </div>

                {
                    biomolecules.length === 0 &&
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <div style={{
                            width: '100%'
                        }}>
                            <Typography
                                variant="body2"
                                style={{
                                    paddingTop: "4px"
                                }}
                            >
                                <CircleIcon style={{
                                    fontSize: "0.6em",
                                    paddingRight: "4px"
                                }}/>
                                Search for biomolecules with free text queries
                            </Typography>
                            <Typography
                                variant="body2"
                                style={{
                                    paddingTop: "4px"
                                }}
                            >
                                <CircleIcon style={{
                                    fontSize: "0.6em",
                                    paddingRight: "4px"
                                }}/>
                                Select the biomolecules to be added to the network
                            </Typography>
                            <Typography
                                variant="body2"
                                style={{
                                    paddingTop: "4px"
                                }}
                            >
                                <CircleIcon style={{
                                    fontSize: "0.6em",
                                    paddingRight: "4px"
                                }}/>
                                Generate network and export it to an image or cytoscape export
                            </Typography>
                        </div>
                    </div>
                }
                {
                    ((biomolecules && biomolecules.length > 0) || searchQuery) &&
                    <div style={{
                        display: 'flex',
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        {
                            <div style={{
                                display: 'flex',
                                width: '100%',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <div style={{
                                    width: '90%'
                                }}>
                                    <Grid
                                        container
                                        spacing={0}
                                        sx={{
                                            width: '100%'
                                        }}
                                    >
                                        {
                                            <>
                                                <Box sx={{ width: '100%' }}>
                                                    <Tabs value={value} onChange={handleChange}>
                                                        <Tab
                                                            label={
                                                                <Typography variant="h6" style={{ textTransform: 'none', fontSize: '1rem' }}>
                                                                    Biomolecule Selection
                                                                </Typography>
                                                            }
                                                        />
                                                        {
                                                            network &&
                                                            <Tab
                                                                label={
                                                                    <Typography variant="h6" style={{ textTransform: 'none', fontSize: '1rem' }}>
                                                                        Network
                                                                    </Typography>
                                                                }
                                                            />
                                                        }
                                                    </Tabs>
                                                    <TabPanel value={value} index={0}>
                                                        <div style={{
                                                            display: 'flex',
                                                            width: '100%',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            padding: '0'
                                                        }}>
                                                            <Grid
                                                                container
                                                                spacing={0}
                                                                sx={{
                                                                    width: '100%'
                                                                }}
                                                            >
                                                                {
                                                                    <Grid item xs={12} md={3} sm={3}>
                                                                        <div style={{
                                                                            overflow: 'auto'
                                                                        }}>
                                                                            {
                                                                                selectedParticipants &&
                                                                                <NetworkParticipantBoard
                                                                                    participants={selectedParticipants}
                                                                                    onClear={() => setSelectedParticipants([])}
                                                                                    onBiomoleculeRemove={onParticipantRemove}
                                                                                    onGenerate={onGenerateNetwork}
                                                                                />
                                                                            }
                                                                        </div>
                                                                    </Grid>
                                                                }
                                                                {
                                                                    <BiomoleculeSelectionComponent
                                                                        searchQuery={searchQuery}
                                                                        onParticipantAdd={onParticipantAdd}
                                                                        onParticipantRemove={onParticipantRemove}
                                                                        onSelectionChange={onSelectionChange}
                                                                        onGenerateNetwork={generateNetwork}
                                                                    />
                                                                }
                                                            </Grid>
                                                        </div>
                                                    </TabPanel>
                                                    {
                                                        network && !loadingNetwork &&
                                                        <TabPanel value={value} index={1}>
                                                            <Grid item xs={12} md={12} sm={12}>
                                                                <AssociationNetworkComponent
                                                                    biomoleculeIds={selectedParticipants.map((biomolecule: any) => biomolecule.biomolecule_id) as string[]}
                                                                />
                                                            </Grid>
                                                        </TabPanel>
                                                    }
                                                </Box>
                                            </>
                                        }
                                    </Grid>
                                </div>
                            </div>
                        }
                    </div>
                }

                <div style={{width: '40%', padding: '20px' }}>
                    {/*<Paper elevation={1} style={{ padding: '20px' }}>
                        <div style={{
                            paddingTop: '10px',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <div>
                                <Typography variant={'body2'}>
                                    <strong>Search for biomolecules to generate interaction networks </strong>
                                </Typography>
                            </div>
                            <Autocomplete
                                style={{ width: '100%' }}
                                size={"medium"}
                                id="property"
                                options={suggestions}
                                value={searchQuery}
                                noOptionsText={'Type and search for biomolecules'}
                                onInputChange={(event, newInputValue) => {
                                    if(newInputValue !== undefined) {
                                        setSearchQuery(newInputValue);
                                    }
                                }}
                                renderInput={(params) => {
                                    return renderOptions(params);
                                }}
                                filterOptions={(options: any[], state: any) => {
                                    return options;
                                }}
                                renderOption={(props: any, option: any) => {
                                    if(suggestions.length === 0) return;
                                    if(suggestionNameMapping && option !== undefined) {
                                        let optionDetails = suggestionNameMapping.get(option);
                                        if(optionDetails) {
                                            return(
                                                <div {...props}>
                                                    <BiomoleculeCard biomolecule={optionDetails}/>
                                                </div>
                                            );
                                        }
                                    }
                                }}
                                onChange={(event: React.ChangeEvent<{}>, newValue: string | null) => {
                                    let newBiomoelcules : [any] | []= [];
                                    if(biomolecules.length > 0) {
                                        newBiomoelcules = biomolecules;
                                    }
                                    if (newValue && suggestionNameMapping) {
                                        let existing = newBiomoelcules.find((bm: any) => bm.biomolecule_id === newValue);
                                        if(!existing) {
                                            newBiomoelcules.push(suggestionNameMapping.get(newValue) as never);
                                            setBiomolecules(newBiomoelcules);
                                            setSearchQuery(null);
                                        }
                                    }
                                }}
                            />
                            <div style={{
                                paddingTop: '10px',
                                display: 'flex',
                                flexDirection: 'column',
                            }}>
                                {
                                    !loadingNetwork && biomolecules.length > 0 &&
                                    <div>
                                        <Typography>Interaction network for : </Typography>
                                    </div>
                                }
                                <div>
                                    <List>
                                        {
                                            biomolecules.map((biomolecule, index) => {
                                                if(biomolecule) {
                                                    return (<BiomoleculeCard biomolecule={biomolecule}/>);
                                                }
                                            })
                                        }
                                    </List>
                                </div>
                            </div>
                        </div>
                        <div style={{
                            justifyContent: 'right',
                            textAlign: 'right'
                        }}>
                            {
                                biomolecules.length > 0 &&
                                <Tooltip title="Clear" arrow>
                                    <IconButton style={{color: 'green'}} aria-label="Clear">
                                        <ClearIcon onClick={clearBiomolecules}/>
                                    </IconButton>
                                </Tooltip>
                            }
                            {
                                biomolecules.length > 0 &&
                                <Tooltip title="Generate Network" arrow>
                                    <IconButton style={{color: 'green'}} aria-label="Generate">
                                        <PlayCircleIcon onClick={generateNetwork}/>
                                    </IconButton>
                                </Tooltip>
                            }
                        </div>
                    </Paper>*/}
                </div>

                <div style={{
                    width: '80%',
                    padding: '20px',
                    overflowY: 'auto'
                }}>
                    {
                        networkGenerationError &&
                        <>
                            <Box sx={{
                                width: '100%',
                                textAlign: 'center'
                            }}>
                                <Alert severity="error">Could not generate network due to unexpected issue.</Alert>
                            </Box>
                        </>
                    }
                    {
                        loadingNetwork && biomolecules &&
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '60vh',
                        }}>
                            <div style={{
                                width: '80%',
                            }}>
                                <Box sx={{
                                    width: '100%',
                                    textAlign: 'center',
                                }}>
                                    <Typography variant={'body1'}>
                                        Building interaction network for {selectedParticipants.map((b: any) => b.biomolecule_id).join(', ')}
                                    </Typography>
                                    <LinearProgress />
                                </Box>
                            </div>
                        </div>
                    }
                    {
                        networkGenerationError &&
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '60vh',
                        }}>
                            <div style={{
                                width: '80%',
                            }}>
                                <Box sx={{
                                    width: '100%',
                                    textAlign: 'center',
                                }}>
                                    <Typography variant="body1" color="warning" gutterBottom>
                                        Network Generation failed.
                                    </Typography>
                                </Box>
                            </div>
                        </div>
                    }
                </div>
            </div>
            {/*<div style={{height: '81vh', width: '20%', maxWidth: '400px'}}>
                <Paper
                    elevation={1}
                    style={{ padding: '20px' }}
                >
                    <div style={{
                        paddingTop: '100px',
                        display: 'flex',
                    }}>
                        <Autocomplete
                            style={{ width: '500px' }}
                            size={"medium"}
                            id="property"
                            disabled={loadingSuggestions || loadingNetwork}
                            options={suggestions}
                            value={searchQuery}
                            onInputChange={(event, newInputValue) => {
                                setSearchQuery(newInputValue);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                />
                            )}
                            onChange={(event: React.ChangeEvent<{}>, newValue: string | null) => {
                                if(newValue){
                                    setBiomolecules([...biomolecules, newValue]);
                                }
                            }}
                        />
                    </div>
                </Paper>
                <div style={{
                    paddingTop: '10px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    Interaction network for : {biomolecules.map((biomolecule) => {
                        return(<InputLabel style={{
                            border: '1px solid green',
                            padding: '5px',
                            textAlign: 'center',
                            color: 'green',
                            fontWeight: 'bold',
                            borderRadius: '4px',
                            fontSize: '12px',
                            textTransform: 'capitalize'
                        }}>{biomolecule}</InputLabel>)
                    })}
                    {
                        biomolecules.length > 0 &&
                        <IconButton style={{color: 'green'}} aria-label="Generate">
                            <BuildIcon onClick={generateNetwork}/>
                        </IconButton>
                    }
                    {
                        biomolecules.length > 0 &&
                        <IconButton style={{color: 'green'}} aria-label="Generate">
                            <ClearIcon onClick={clearBiomolecules}/>
                        </IconButton>
                    }
                </div>
            </div>*/}
            <Footer/>

        </div>
    );
}

export default connector(NetworkExplorer);