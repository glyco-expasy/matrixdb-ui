import React, {useEffect, useState} from 'react';
import {
    Box,
    IconButton,
    List,
    ListItem,
    Pagination, Paper, Tab, Tabs, Tooltip,
    Typography
} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowTurnUp, faArrowTurnDown, faFilter, faAward, faEye} from "@fortawesome/free-solid-svg-icons";
import SpeciesIcon from "../commons/icons/SpeciesIcon";
import LogoIcon from "../commons/icons/LogoIcon";
import {InfoOutlined} from "@mui/icons-material";
import FilterOverlay from "./FilterOverlay";
import speciesMapping from "../../commons/constants";

function ResultDetailsComponent(props: any) {

    const [currentPage, setCurrentPage] = useState(1);
    const [tabValue, setTabValue] = useState(0);

    interface TabPanelProps {
        children?: React.ReactNode;
        index: number;
        value: number;
    }
    const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
        return (
            <div role="tabpanel" hidden={value !== index}>
                {value === index && <Box p={3}>{children}</Box>}
            </div>
        );
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const displayName = (biomolecule: any) => {
        if(biomolecule.recommended_name) {
            return biomolecule.recommended_name;
        }

        if(biomolecule.name) {
            return biomolecule.name;
        }
    }

    return(
        <>
        {

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingTop: '20px',
                }}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                        </div>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingTop: '20px'
                        }}>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                {
                                    props.searchResults &&
                                    props.searchResults.slice((currentPage - 1) * 10, currentPage * 10).map((result: any) => {
                                        return(
                                            <div style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                paddingBottom: '20px'
                                            }}>
                                                <div style={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    width: '800px'
                                                }}>
                                                    {result.species && <div style={{ flex: '10%',paddingRight: '10px' }}>
                                                        <SpeciesIcon
                                                            speciesId={speciesMapping[result.species.toString()]}
                                                            width={'20px'}
                                                            height={'20px'}
                                                        />
                                                    </div>}
                                                    {!result.species && (
                                                        <div style={{ flex: '10%', paddingRight: '10px' }}>
                                                            <SpeciesIcon
                                                                speciesId={'-1'}
                                                                width={'15px'}
                                                                height={'15px'}
                                                            />
                                                        </div>
                                                    )}
                                                    <div style={{
                                                        width: '70%',
                                                        display: 'flex',
                                                        justifyContent: 'left',
                                                        alignItems: 'left'
                                                    }}>
                                                        <a href={process.env.REACT_APP_PUBLIC_URL + "biomolecule/" + result.biomolecule_id}>
                                                            {displayName(result)}
                                                        </a>
                                                    </div>
                                                    <div style={{
                                                        width: '20%'
                                                    }}>
                                                        <Typography sx={{ paddingLeft: '40px',fontSize: 14 }} color="text.primary" gutterBottom>
                                                            {result.interaction_count}
                                                        </Typography>
                                                    </div>
                                                </div>
                                                <div style={{
                                                    display: 'flex',
                                                }}>
                                                    <div style={{
                                                        width: '10%',
                                                        height: '10px',
                                                        paddingRight: '5px'
                                                    }}>
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
                                                </div>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                            {
                                props.searchResults && props.searchResults.length > 0 &&
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    paddingTop: '20px'
                                }}>
                                    <Pagination
                                        count={Math.ceil(props.searchResults.length / 10)}
                                        page={currentPage}
                                        onChange={(event, page) => setCurrentPage(page)}
                                        color="primary"
                                    />
                                </div>
                            }
                        </div>
                </div>
        }
        </>
    )
}

interface TruncatedListItemTextProps {
    text: string;
    url: string;
    length: number
}
const TruncatedListItemText: React.FC<TruncatedListItemTextProps> = ({ text, url,length }) => {
    const truncatedText = text.length > length ? `${text.substring(0, length)}...` : text;

    return (
        <Tooltip title={text.length > 80 ? text : ''} arrow>
            <Typography variant="body2" noWrap>
                {text.length > 80 ? (
                    <a href={url} target="_blank">
                        {truncatedText}
                    </a>
                ) : (
                    <a href={url} target="_blank">
                        {truncatedText}
                    </a>
                )}
            </Typography>
        </Tooltip>
    );
};

function ResultComponent(props : any) {

    const [viewMode, setViewMode] = useState<string>("NORMAL");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const [filteredBiomolecules, setFilteredBiomolecules] = useState<any[] | []>([]);
    const [filterCriteria, setFilterCriteria] = useState<any | null>(null);

    useEffect(() => {
        setFilteredBiomolecules(props.searchResults.biomolecules);
    }, [props.searchResults.biomolecules]);

    useEffect(() => {
        if(!(props.searchResults.biomolecules && props.searchResults.biomolecules.length > 0)) return;
        if(!filterCriteria) return;

        // Filter the biomolecules
        let filteredBiomolecules = props.searchResults.biomolecules.filter((biomolecule: any) => {
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
        //onSeeMore();
    }, [filterCriteria]);

    const onFilterClear = () => {
        setFilterCriteria(null);
        setFilteredBiomolecules(props.searchResults.biomolecules);
    }

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    const truncateText = (text : string, maxLength: number) => {
        return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    };

    const displayName = (biomolecule: any) => {
        if(biomolecule.recommended_name) {
            return biomolecule.recommended_name;
        }

        if(biomolecule.name) {
            return biomolecule.name;
        }
    }

    const getMostRelevant = (biomolecules: any[]) => {
        let mostRelevant = biomolecules.filter((biomolecule: any) => biomolecule.most_relevant);
        if(mostRelevant.length === 0) {
            return biomolecules;
        } else {
            return mostRelevant;
        }
    }

    const onSeeMore = () => {
        setViewMode("DETAILED");
    }

    const onSeeLess = () => {
        setViewMode("NORMAL");
    }

    const onFilterSelection = (filterCriteria: any) => {
        setFilterCriteria(filterCriteria)
    }

    return (
        <>
            {
                <>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        paddingTop: '5px'
                    }}>
                        {props.searchResults.biomolecules && props.searchResults.biomolecules.length > 0 &&
                            <Paper style={{
                                padding: '10px',
                                textAlign: 'center',
                                marginBottom: '20px',
                                width: '98%',
                                minWidth: '1000px',
                                borderRadius: 0
                            }}>
                                <div style={{
                                    background: 'rgb(225, 235, 252)',
                                    height: '40px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    paddingLeft: '20px',
                                    paddingRight: '20px',
                                }}>
                                    <Typography style={{
                                        fontWeight: 'bold',
                                        color: 'darkblue',
                                        display: 'flex'
                                    }}>
                                        Biomolecules
                                    </Typography>
                                    <div>
                                        <Tooltip title="Most Relevant">
                                            <IconButton
                                                onClick={onSeeLess}
                                                style={{
                                                    backgroundColor: viewMode === 'NORMAL' ? "#81a2b7": "transparent"
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faAward} size={"2xs"}/>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="See More">
                                            <IconButton
                                                onClick={onSeeMore}
                                                style={{
                                                    backgroundColor: viewMode === 'DETAILED' ? "#81a2b7": "transparent"
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faEye} size={"2xs"}/>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Filter">
                                            <IconButton
                                                onClick={handleOpen}
                                                style={{
                                                    backgroundColor: filterCriteria ? "#81a2b7": "transparent"
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faFilter} size={"2xs"}/>
                                            </IconButton>
                                        </Tooltip>
                                        <FilterOverlay
                                            searchQuery={props.searchQuery}
                                            biomolecules={props.searchResults.biomolecules}
                                            onFilterSelection={onFilterSelection}
                                            onFilterClear={onFilterClear}
                                            open={open}
                                            anchorEl={anchorEl}
                                            handleClose={handleClose}
                                        />
                                    </div>
                                </div>
                                {
                                    viewMode !== 'DETAILED' &&
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-around'
                                    }}>
                                        <List>
                                            {getMostRelevant(filteredBiomolecules).slice(0,5).map((result: any, index: number) => (
                                                <ListItem key={index} style={{
                                                    paddingBottom: '20px'
                                                }}>
                                                    <Typography>
                                                        <div key={index} style={{
                                                            display: 'flex',
                                                            marginBottom: '10px',
                                                            width: '500px'
                                                        }}>
                                                            {result.species && (
                                                                <div style={{ flex: '10%', paddingRight: '10px' }}>
                                                                    <SpeciesIcon
                                                                        speciesId={speciesMapping[result.species.toString()]}
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
                                            {getMostRelevant(filteredBiomolecules).slice(5,10).map((result: any, index: number) => (
                                                    <ListItem key={index} style={{ paddingBottom: '20px' }}>
                                                        <Typography>
                                                            <div key={index} style={{
                                                                display: 'flex',
                                                                width: '500px',
                                                                marginBottom: '10px'
                                                            }}>
                                                                {result.species && (
                                                                    <div style={{ flex: '10%', paddingRight: '10px' }}>
                                                                        <SpeciesIcon
                                                                            speciesId={speciesMapping[result.species]}
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
                                    </div>
                                }
                                {
                                    viewMode === 'DETAILED' && filteredBiomolecules.length > 0 &&
                                    <ResultDetailsComponent
                                        searchResults={filteredBiomolecules}
                                        onSeeLess={onSeeLess}
                                    />
                                }
                                {
                                    viewMode === 'DETAILED' && filteredBiomolecules.length === 0 &&
                                    <ResultDetailsComponent
                                        searchResults={props.searchResults.biomolecules}
                                        onSeeLess={onSeeLess}
                                    />
                                }
                            </Paper>
                        }
                        {
                            props.searchResults.publications && props.searchResults.publications.length > 0 &&
                            <Paper style={{
                                padding: '10px',
                                textAlign: 'center',
                                marginBottom: '20px',
                                width: '98%'
                            }}>
                                {props.searchResults.publications && props.searchResults.publications.length > 0 &&
                                    <>
                                        <div style={{ textAlign: 'left', marginBottom: '20px'}}>
                                            <div style={{
                                                background: 'rgb(225, 235, 252)',
                                                height: '40px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                paddingLeft: '20px',
                                                paddingRight: '20px',
                                                justifyContent: 'space-between'
                                            }}>
                                                <Typography style={{fontWeight: 'bold', color: 'darkblue' }}>
                                                    Publications
                                                </Typography>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                                                <List>
                                                    {props.searchResults.publications &&
                                                        props.searchResults.publications.slice(0,5).map((result: any, index: number) => (
                                                            <ListItem key={index}>
                                                                <Typography>
                                                                    <div key={index} style={{
                                                                        display: 'flex',
                                                                        width: '400px',
                                                                        marginBottom: '10px',
                                                                        justifyContent: 'space-between'
                                                                    }}>
                                                                        <div style={{ flex: 1 }}>
                                                                            <TruncatedListItemText
                                                                                text={result.title}
                                                                                url={`/publication/${result.publication_id}`}
                                                                                length={40}
                                                                            />
                                                                        </div>
                                                                        <div style={{
                                                                            flex: 0,
                                                                            paddingRight: '10px'
                                                                        }}>
                                                                            <Typography variant="caption">
                                                                                <strong>{result.interaction_count}</strong>
                                                                            </Typography>
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <Typography variant="body2">
                                                                            {result.abstract && truncateText(result.abstract, 100)}
                                                                        </Typography>
                                                                    </div>
                                                                </Typography>
                                                            </ListItem>
                                                        ))}
                                                </List>
                                                <List>
                                                    {props.searchResults.publications &&
                                                        props.searchResults.publications.slice(5,10).map((result: any, index: number) => (
                                                            <ListItem key={index}>
                                                                <Typography>
                                                                    <div key={index} style={{
                                                                        display: 'flex',
                                                                        width: '400px',
                                                                        marginBottom: '10px',
                                                                        justifyContent: 'space-between'
                                                                    }}>
                                                                        <div style={{ flex: 1 }}>
                                                                            <TruncatedListItemText
                                                                                text={result.title}
                                                                                url={`/publication/${result.publication_id}`}
                                                                                length={40}
                                                                            />
                                                                        </div>
                                                                        <div style={{ flex: 0 }}>
                                                                            <Typography variant="caption">
                                                                                <strong>{result.interaction_count}</strong>
                                                                            </Typography>
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <Typography variant="body2">
                                                                            {result.abstract && truncateText(result.abstract, 80)}
                                                                        </Typography>
                                                                    </div>
                                                                </Typography>
                                                            </ListItem>
                                                        ))}
                                                </List>
                                            </div>
                                        </div>
                                    </>
                                }
                            </Paper>
                        }
                    </div>
                </>
            }
        </>
    );
}

export default ResultComponent;
