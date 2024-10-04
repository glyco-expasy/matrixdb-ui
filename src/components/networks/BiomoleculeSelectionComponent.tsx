import {Grid, IconButton, List, ListItem, Paper, Tab, Tabs, Tooltip, Typography} from "@mui/material";
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import BiomoleculeFilter from "./biomolecule-filter/BiomoleculeFilter";
import React, {useEffect, useState} from "react";
import BiomoleculeCard from "../commons/cards/BiomoleculeCards";
import {getFromLocalStorage, removeFromLocalStorage, saveToLocalStorage} from "../../commons/memory-manager";
import http from "../../commons/http-commons";
import ResultBiomoleculeCard from "../commons/cards/ResultBiomoleculeCard";

const   BiomoleculeSelectionComponent: React.FC<any> = (props: any)  => {

    const [biomolecules, setBiomolecules] = useState<any[]>([]);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [selectedParticipants, setSelectedParticipants] = useState<any[]>([]);
    const [filteredBiomolecules, setFilteredBiomolecules] = useState<any[] | null>(null);
    const [filterCriteria, setFilterCriteria] = useState<any>(null);
    const [selectedTab, setSelectedTab] = useState(0);

    useEffect(() => {
        updateBiomolcules();
    }, []);

    useEffect(() => {
        setSelectedParticipants(props.selectedParticipants);
        if(props.selectedParticipants && props.selectedParticipants.length > 0) setSelectedTab(0);
    }, [props.selectedParticipants]);

    useEffect(() => {
        if(!searchResults) return;
        if(!filterCriteria) return;

        // Filter the biomolecules
        let filteredBiomolecules = searchResults.filter((biomolecule: any) => {
            if(filterCriteria.type === 'species') {
                return biomolecule.species === filterCriteria.value;
            } else if(filterCriteria.type === 'goTerms') {
                return biomolecule?.go_names?.includes(filterCriteria.value);
            } else if(filterCriteria.type === 'biomolecule'){
                return biomolecule.biomolecule_type === filterCriteria.value;
            }
        });
        if(filteredBiomolecules.length === 0 || !filteredBiomolecules) filteredBiomolecules = [];
        setFilteredBiomolecules(filteredBiomolecules);
    }, [filterCriteria]);

    useEffect(() => {
        let query = props.searchQuery;
        if(!query || query === '') return;

        http.get(`/search?query=${query}`)
            .then((suggestionResponse) => {
                // Only consider the bimolecules with interactions
                let biomoleculesWithInteractions = suggestionResponse.data.biomolecules.filter((biomolecule: any) => biomolecule.interaction_count > 0);
                setSearchResults(biomoleculesWithInteractions);
                setFilteredBiomolecules(biomoleculesWithInteractions);
                setSelectedTab(1);
            });
    }, [props.searchQuery]);

    const updateBiomolcules = () => {
        let biomolecules = getFromLocalStorage("selectedBiomolecules");
        if(!biomolecules) biomolecules = [];

        http.get(`/search?query=id:${biomolecules.join(',')}&mode=1`)
            .then((searchResponse) => {
                setBiomolecules(searchResponse.data.biomolecules);
            });
    }

    const onRemoveBiomolecule = (biomolecule: any) => {
        removeFromLocalStorage('selectedBiomolecules', biomolecule.biomolecule_id);
        updateBiomolcules();
        //props.onParticipantRemove(biomolecule);
    }

    const onRemoveAllBiomolecules = () => {
        removeFromLocalStorage('selectedBiomolecules',
            biomolecules.map((biomolecule: any) => biomolecule.biomolecule_id));
        updateBiomolcules();
        setSelectedTab(1);
    }

    const onSaveToBiomolcules = (biomolecules: any[])  => {
        if(!biomolecules) return;
        saveToLocalStorage('selectedBiomolecules',
            biomolecules.map((biomolecule: any) => biomolecule.biomolecule_id));
        updateBiomolcules();
        setSelectedTab(0);
    }

    const onParticipantsAdd = (biomolecules: any[]) => {
        let currentSelectedParticipants = [];
        if(selectedParticipants) {
            currentSelectedParticipants = selectedParticipants;
        }
        let newSelectedParticipants = new Set([...currentSelectedParticipants, ...biomolecules]);

        setSelectedParticipants([...newSelectedParticipants]);
        props.onParticipantAdd([...newSelectedParticipants]);
    }

    const handleTabChange = (event : any, newValue : number) => {
        setSelectedTab(newValue);
    }

    return(
        <>
            <Grid item xs={12} md={6} sm={6}>
                {
                    <>
                        <div
                            style={{
                                background: "#e0e7f2",
                                height: '70px',
                                display: 'flex',
                                alignItems: 'center',
                                paddingTop: '5px',
                                paddingLeft: '5px'
                            }}
                        >
                            <Tabs
                                value={selectedTab}
                                onChange={handleTabChange}
                                indicatorColor="primary"
                                textColor="primary"
                                variant="fullWidth"
                                centered
                            >
                                {
                                    biomolecules && biomolecules.length > 0 &&
                                    <Tab
                                        label={
                                            <Typography variant="h6" style={{ textTransform: 'none', fontSize: '0.8rem' }}>
                                                Biomolecules ({biomolecules.length})
                                            </Typography>
                                        }
                                    />
                                }
                                {
                                    props.searchQuery && searchResults &&
                                    <Tab
                                        label={
                                            <Typography variant="h6" style={{ textTransform: 'none', fontSize: '0.8rem' }}>
                                                Search Results : {props.searchQuery} ({ filteredBiomolecules && filteredBiomolecules.length !== searchResults.length ? `${filteredBiomolecules.length} / ${searchResults.length}` : searchResults.length})
                                            </Typography>
                                        }
                                    />
                                }
                            </Tabs>
                        </div>

                        {
                            selectedTab === 0 &&
                            <Paper
                                style={{
                                    textAlign: 'center',
                                    marginBottom: '20px',
                                    height: '400px',
                                    borderRadius: '0em',
                                    overflow: 'auto'
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-around'
                                    }}
                                >
                                    <div style={{
                                        display: 'flex'
                                    }}>
                                        {
                                            /*biomolecules &&
                                            <InfiniteScrollingList listItems={biomolecules}>
                                                {
                                                    biomolecules.map((biomolecule) => {
                                                            let selectedIds = [];
                                                            if(selectedParticipants && selectedParticipants.length > 0) {
                                                                selectedIds = selectedParticipants.map(
                                                                    (biomolecule: any) => biomolecule.biomolecule_id);
                                                            }

                                                            return (
                                                                <BiomoleculeCard
                                                                    biomolecule={biomolecule}
                                                                    onBiomoleculeAdd={props.onBimoleculeAdd}
                                                                    onBiomoleculeRemove={props.onBiomoleculeRemove}
                                                                    cardType="normal"
                                                                    selected={selectedIds.includes(biomolecule.biomolecule_id)}
                                                                />
                                                            );
                                                        }
                                                    )}
                                            </InfiniteScrollingList>*/
                                            <List>
                                                {
                                                    biomolecules.map((biomolecule) => {
                                                        let selectedIds = [];
                                                        if(selectedParticipants && selectedParticipants.length > 0) {
                                                            selectedIds = selectedParticipants.map(
                                                                (biomolecule: any) => biomolecule.biomolecule_id);
                                                        }

                                                        return (
                                                            <ListItem>
                                                                <BiomoleculeCard
                                                                    biomolecule={biomolecule}
                                                                    onParticipantAdd={() => onParticipantsAdd([biomolecule])}
                                                                    onBiomoleculeRemove={(biomolecule: any) => onRemoveBiomolecule(biomolecule)}
                                                                    cardType="normal"
                                                                    selected={selectedIds.includes(biomolecule.biomolecule_id)}
                                                                />
                                                            </ListItem>
                                                        );
                                                    })
                                                }
                                            </List>
                                        }
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        paddingTop: '10px'
                                    }}>
                                        <Tooltip title="Clear all from biomolecules">
                                            <IconButton
                                                onClick={onRemoveAllBiomolecules}
                                                sx={{ height: '30px' }}
                                                style={{ color: 'red' }}
                                                aria-label="Add">
                                                <DeleteSweepIcon/>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Select all as participants">
                                            <IconButton
                                                onClick={() => onParticipantsAdd(biomolecules)}
                                                sx={{ height: '30px' }}
                                                style={{ color: 'green' }}
                                                aria-label="Add"
                                            >
                                                <DoneAllIcon/>
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                </div>
                            </Paper>
                        }

                        {
                            selectedTab === 1 &&
                            <Paper
                                style={{
                                    textAlign: 'center',
                                    marginBottom: '20px',
                                    height: '400px',
                                    borderRadius: '0em',
                                    overflow: 'auto'
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-around'
                                    }}
                                >
                                    {/*
                                            <List>
                                                {biomolecules.slice(0,5).map((result: any, index: number) => (
                                                    <ListItem key={index} style={{
                                                        paddingBottom: '20px'
                                                    }}>
                                                        <Typography>
                                                            <div key={index} style={{
                                                                display: 'flex',
                                                                marginBottom: '10px',
                                                                width: '400px'
                                                            }}>
                                                                {result.species && (
                                                                    <div style={{ flex: '10%', paddingRight: '10px' }}>
                                                                        <SpeciesIcon
                                                                            speciesId={result.species}
                                                                            width={'20px'}
                                                                            height={'20px'}
                                                                        />
                                                                    </div>
                                                                )}
                                                                {!result.species && (
                                                                    <div style={{ flex: '10%', paddingRight: '10px' }}>
                                                                        <SpeciesIcon
                                                                            speciesId={'-1'}
                                                                            width={'15px'}
                                                                            height={'15px'}
                                                                        />
                                                                    </div>
                                                                )}
                                                                <div style={{ flex: '60%' }}>
                                                                    <a href={`/biomolecule/${result.biomolecule_id}`} color="inherit">
                                                                        {displayName(result)}
                                                                    </a>
                                                                </div>
                                                                <div style={{ flex: '20%' }}>
                                                                    <Typography variant="caption">
                                                                        <strong>{result.interaction_count}</strong>
                                                                    </Typography>
                                                                </div>
                                                                <div style={{ flex: '10%', paddingRight: '5px' }}>
                                                                    <IconButton style={{color: 'green'}} aria-label="Add">
                                                                        <AddIcon/>
                                                                    </IconButton>
                                                                </div>
                                                            </div>
                                                            <div style={{ display: 'flex', flexDirection: 'row'}}>
                                                                {
                                                                    result.biomolecule_type !== 'protein' &&
                                                                    <>
                                                                        <LogoIcon logoName={'matrixdb'} width={'15'} height={'15'}/>
                                                                        <Typography style={{paddingLeft: '5px', paddingRight: '5px', fontSize: '12px'}} variant="body2">
                                                                            {result.biomolecule_id}
                                                                        </Typography>
                                                                    </>
                                                                }
                                                                {
                                                                    result.biomolecule_type === 'protein' &&
                                                                    <>
                                                                        <LogoIcon logoName={'uniprot'} width={'15'} height={'15'}/>
                                                                        <Typography style={{paddingLeft: '5px', paddingRight: '5px', fontSize: '12px'}}  variant="body2">
                                                                            {result.biomolecule_id}
                                                                        </Typography>
                                                                        {
                                                                            result.gene &&
                                                                            <Typography style={{paddingLeft: '5px', paddingRight: '5px', fontSize: '12px'}}  variant="body2">
                                                                                Gene: {result.gene}
                                                                            </Typography>
                                                                        }
                                                                    </>
                                                                }
                                                                {
                                                                    result.chebi &&
                                                                    <>
                                                                        <LogoIcon logoName={'chebi'} width={'15'} height={'15'}/>
                                                                        <Typography style={{paddingLeft: '5px', paddingRight: '5px', fontSize: '12px'}}  variant="body2">
                                                                            {result.chebi}
                                                                        </Typography>
                                                                    </>
                                                                }
                                                                {
                                                                    result.complex_portal &&
                                                                    <>
                                                                        <LogoIcon logoName={'complex-portal'} width={'15'} height={'15'}/>
                                                                        <Typography style={{paddingLeft: '5px', paddingRight: '5px', fontSize: '12px'}}  variant="body2">
                                                                            {result.complex_portal}
                                                                        </Typography>
                                                                    </>
                                                                }
                                                            </div>
                                                        </Typography>
                                                    </ListItem>
                                                ))}
                                            </List>
                                            <List>
                                                {biomolecules.slice(5,10).map((result: any, index: number) => (
                                                        <ListItem key={index} style={{ paddingBottom: '20px' }}>
                                                            <Typography>
                                                                <div key={index} style={{
                                                                    display: 'flex',
                                                                    width: '400px',
                                                                    marginBottom: '10px'
                                                                }}>
                                                                    {result.species && (
                                                                        <div style={{ flex: '10%', paddingRight: '10px' }}>
                                                                            <SpeciesIcon
                                                                                speciesId={result.species}
                                                                                width={'20px'}
                                                                                height={'20px'}
                                                                            />
                                                                        </div>
                                                                    )}
                                                                    {!result.species && (
                                                                        <div style={{ flex: '10%', paddingRight: '10px' }}>
                                                                            <SpeciesIcon
                                                                                speciesId={'-1'}
                                                                                width={'15px'}
                                                                                height={'15px'}
                                                                            />
                                                                        </div>
                                                                    )}
                                                                    <div style={{ flex: '70%' }}>
                                                                        <a href={`/biomolecule/${result.biomolecule_id}`} color="inherit">
                                                                            {displayName(result)}
                                                                        </a>
                                                                    </div>
                                                                    <div style={{ flex: '20%' }}>
                                                                        <Typography variant="caption">
                                                                            <strong>{result.interaction_count}</strong>
                                                                        </Typography>
                                                                    </div>
                                                                </div>
                                                                <div style={{ display: 'flex', flexDirection: 'row'}}>
                                                                    {
                                                                        result.biomolecule_type !== 'protein' &&
                                                                        <>
                                                                            <LogoIcon logoName={'matrixdb'} width={'15'} height={'15'}/>
                                                                            <Typography style={{paddingLeft: '5px', paddingRight: '5px', fontSize: '12px'}} variant="body2">
                                                                                {result.biomolecule_id}
                                                                            </Typography>
                                                                        </>
                                                                    }
                                                                    {
                                                                        result.biomolecule_type === 'protein' &&
                                                                        <>
                                                                            <LogoIcon logoName={'uniprot'} width={'15'} height={'15'}/>
                                                                            <Typography style={{paddingLeft: '5px', paddingRight: '5px', fontSize: '12px'}}  variant="body2">
                                                                                {result.biomolecule_id}
                                                                            </Typography>
                                                                            {
                                                                                result.gene &&
                                                                                <Typography style={{paddingLeft: '5px', paddingRight: '5px', fontSize: '12px'}}  variant="body2">
                                                                                    Gene: {result.gene}
                                                                                </Typography>
                                                                            }
                                                                        </>
                                                                    }
                                                                    {
                                                                        result.chebi &&
                                                                        <>
                                                                            <LogoIcon logoName={'chebi'} width={'15'} height={'15'}/>
                                                                            <Typography style={{paddingLeft: '5px', paddingRight: '5px', fontSize: '12px'}}  variant="body2">
                                                                                {result.chebi}
                                                                            </Typography>
                                                                        </>
                                                                    }
                                                                    {
                                                                        result.complex_portal &&
                                                                        <>
                                                                            <LogoIcon logoName={'complex-portal'} width={'15'} height={'15'}/>
                                                                            <Typography style={{paddingLeft: '5px', paddingRight: '5px', fontSize: '12px'}}  variant="body2">
                                                                                {result.complex_portal}
                                                                            </Typography>
                                                                        </>
                                                                    }
                                                                </div>
                                                            </Typography>
                                                        </ListItem>
                                                    ))}
                                            </List>
                                            */}
                                    <div style={{
                                        display: 'flex'
                                    }}>
                                        {
                                            filteredBiomolecules &&
                                            <List>
                                                {
                                                    filteredBiomolecules.map((biomolecule) => {
                                                            let selectedIds = [];
                                                            if(selectedParticipants) {
                                                                selectedIds = selectedParticipants.map(
                                                                    (biomolecule: any) => biomolecule.biomolecule_id);
                                                            }
                                                            return (
                                                                <ListItem>
                                                                    <ResultBiomoleculeCard
                                                                        biomolecule={biomolecule}
                                                                        onBiomoleculeAdd={() => onSaveToBiomolcules([biomolecule])}
                                                                        onBiomoleculeRemove={onRemoveBiomolecule}
                                                                        cardType="normal"
                                                                        selected={selectedIds.includes(biomolecule.biomolecule_id)}
                                                                    />
                                                                </ListItem>
                                                            );
                                                        }
                                                    )}
                                            </List>
                                        }
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        paddingTop: '10px'
                                    }}>
                                        <Tooltip title="Select all as participants">
                                            <IconButton
                                                onClick={() => {
                                                    if(filteredBiomolecules) {
                                                        onSaveToBiomolcules(filteredBiomolecules);
                                                    }
                                                }}
                                                sx={{ height: '30px'}}
                                                style={{ color: 'green'}}
                                                aria-label="Add"
                                            >
                                                <DoneAllIcon/>
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                </div>
                            </Paper>
                        }
                    </>
                }
            </Grid>
            <Grid item xs={12} md={3} sm={3}>
                <div style={{
                    overflow: 'auto'
                }}>
                    {
                        props.searchQuery && searchResults &&
                        <BiomoleculeFilter
                            searchQuery={props.searchQuery}
                            biomolecules={searchResults}
                            onFilterSelection={(filterCriteria: any) => {
                                setSelectedTab(1);
                                setFilterCriteria(filterCriteria)
                            }}
                        />
                    }
                </div>
            </Grid>
        </>
    )
}

export default BiomoleculeSelectionComponent;