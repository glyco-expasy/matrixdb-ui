import React, { useState } from 'react';
import {
    Box,
    IconButton,
    List,
    ListItem,
    Pagination, Paper, Tab, Tabs, Tooltip,
    Typography
} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAtom, faBook, faArrowTurnUp, faArrowTurnDown} from "@fortawesome/free-solid-svg-icons";
import SpeciesIcon from "../commons/icons/SpeciesIcon";
import LogoIcon from "../commons/icons/LogoIcon";
import {InfoOutlined} from "@mui/icons-material";

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
                    <Paper style={{
                        padding: '10px',
                        textAlign: 'center',
                        marginBottom: '20px',
                        width: '98%',
                        minWidth: '1000px',
                        borderRadius: 0
                    }}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <div style={{
                                display: 'flex'
                            }}>
                                <Tooltip title="See Less">
                                    <IconButton onClick={props.onSeeLess}>
                                        <FontAwesomeIcon icon={faArrowTurnUp}  size={'xs'}/>
                                    </IconButton>
                                </Tooltip>
                            </div>
                            <div style={{
                                display: 'flex'
                            }}>
                                <Tabs value={0} onChange={() => {}} centered>
                                    {
                                        <Tab
                                            label="Biomolecules"
                                            icon={<IconButton>
                                                <FontAwesomeIcon icon={faAtom} size={"2xs"}/>
                                            </IconButton>}
                                            iconPosition="start"
                                            style={{ padding: '4px', margin: '0' }}
                                        />
                                    }
                                    {
                                        <Tab
                                            label="Publications"
                                            icon={<IconButton>
                                                <FontAwesomeIcon icon={faBook} size={"2xs"}/>
                                            </IconButton>}
                                            iconPosition="start"
                                        />
                                    }
                                </Tabs>
                            </div>
                        </div>
                        <TabPanel value={tabValue} index={0}>
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
                                                                speciesId={result.species.toString()}
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
                        </TabPanel>
                    </Paper>
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

    const [viewMode, setViewMode] = useState<string>("relevant");
    const [expandBiomolecules, setExpandBiomolecules] = useState<boolean>(false);
    const [expandPublications, setExpandPublications] = useState<boolean>(false);

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

    return (
        <>
            {
                viewMode !== 'DETAILED' && <>
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
                                        color: 'darkblue'
                                    }}>
                                        Biomolecules
                                    </Typography>
                                    <Tooltip title="Sorted by the associated partner counts">
                                        <div style={{ cursor: 'pointer' }}>
                                            <InfoOutlined style={{ color: 'gray' }} />
                                        </div>
                                    </Tooltip>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-around'
                                }}>
                                    <List>
                                        {getMostRelevant(props.searchResults.biomolecules).slice(0,5).map((result: any, index: number) => (
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
                                        {getMostRelevant(props.searchResults.biomolecules).slice(5,10).map((result: any, index: number) => (
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
                                <div style={{
                                    alignItems: 'right',
                                    textAlign: 'right'
                                }}>
                                    {
                                        props.searchResults.biomolecules && props.searchResults.biomolecules.length > 10 &&
                                        <Tooltip title="See More">
                                            <IconButton onClick={() => onSeeMore()}>
                                                <FontAwesomeIcon icon={faArrowTurnDown}  size={'xs'}/>
                                            </IconButton>
                                        </Tooltip>
                                    }
                                </div>
                            </Paper>
                        }
                        {props.searchResults.publications && props.searchResults.publications.length > 0 &&
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
                                            <Tooltip title="Sorted by the associated partner counts">
                                                <div style={{ cursor: 'pointer' }}>
                                                    <InfoOutlined style={{ color: 'gray' }} />
                                                </div>
                                            </Tooltip>
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
            {
                viewMode === 'DETAILED' &&
                <ResultDetailsComponent
                    searchResults={props.searchResults.biomolecules}
                    onSeeLess={onSeeLess}
                />
            }
        </>
    );
}

export default ResultComponent;
