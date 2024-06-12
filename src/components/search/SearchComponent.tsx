import React, {useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom';

import {
    Box, Button,
    CircularProgress, Grid, useTheme
} from "@mui/material";
import http from "../../commons/http-commons";
import SearchBoxComponent from "./SearchBoxComponent";
import { useNavigate } from 'react-router-dom';
import ResultComponent from "./ResultComponent";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CircleIcon from '@mui/icons-material/Circle';

function SearchComponent() {

    const [searchText, setSearchText] = useState<string|null>(null);
    const [searchStart, setSearchStart] = useState(false);
    const [searchDone, setSearchDone] = useState(false);
    const [searchResults, setSearchResults] = useState<any>({});
    const navigate = useNavigate();

    const location = useLocation();
    const currentPath = location.pathname;

    const searchBoxCardStyle = {
        display: 'flex',
        flexDirection: 'column',
        background: 'rgb(197, 205, 229)',
        borderRadius: 0
    } as React.CSSProperties;

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const query = searchParams.get('query');
        if(query) {
            setSearchText(query);
            setSearchStart(true);
            handleSearch(query);
        }
    }, [location.search]);

    const handleSearch = (query: string) => {
        http.get("/search?text=" + query)
            .then((searchResponse) => {
                setSearchResults(searchResponse.data);
                searchResponse.data.biomolecules.sort((a: any, b: any) => {
                   return b.interaction_count - a.interaction_count;
                });
                searchResponse.data.publications = searchResponse.data.publications.filter((publication: any) => publication.interaction_count > 0);
                searchResponse.data.publications.sort((a: any, b: any) => {
                    return b.interaction_count - a.interaction_count;
                });
                setSearchDone(true);
                setSearchStart(false);
            });
    }

    const onPressEnter = (e: React.KeyboardEvent) =>{
        if( e.key === 'Enter' ){
            e.preventDefault();
            navigate('/search?query=' + searchText);
        }
    };

    const onClickSearch = (query: string) => {
        setSearchText(query);
        navigate('/search?query=' + query);
    }

    const onSearchTextChange = (e : any) => {
        const query = e.target.value;
        setSearchText(query);
        //navigate('/search?query=' + query);
    }

    return (
        <>
            { currentPath === '/' &&
                <div className={"App App-search"}>
                        <div style={{textAlign: 'center'}}>
                            <h2>The extracellular matrix interaction database</h2>
                            <h4>Database focused on interactions established by extracellular matrix proteins, proteoglycans and polysaccharide</h4>
                        </div>
                        <div style={{width: '70%'}}>
                            <Card style={{ flex: '1', ...searchBoxCardStyle }}>
                                <div style={{
                                    paddingLeft: "5px",
                                    paddingRight: "5px",
                                    paddingTop: "10px"
                                }}>
                                    <SearchBoxComponent
                                        onClickSearch={onClickSearch}
                                        onPressEnter={onPressEnter}
                                        onSearchTextChange={onSearchTextChange}
                                    />
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
                                                    Gene name (for proteins): <a href="/search?query=LOX">LOX</a>
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
                                                    ChEBI accessions: <a href="/search?query=chebi:28304">CHEBI:28304</a>
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
                                                    Uniprot accession : (uniprot) <a href="/search?query=P12109">P12109</a>
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
                                                    Complex portal accession: <a href="/search?query=cpx-1650">cpx-1650</a>
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
                                                    Pubmed identifiers (for publications): <a href="/search?query=28106549">28106549</a>
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </div>
                                </div>
                            </Card>
                        </div>
                </div>
            }
            {
                searchStart && <div style={{textAlign: 'center', paddingTop: '20px'}}>
                    <CircularProgress />
                    </div>
            }
            {
                !searchStart && searchDone && searchResults.length === 0  && <h5>Sorry we couldn't find what you looking for</h5>
            }
            {
                searchDone && currentPath !== '/' &&
                <>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        paddingTop: "20px"
                    }}>
                    {
                        searchDone && Object.keys(searchResults).length > 0 &&
                        <>
                            <div style={{
                                display: 'flex',
                                background: '#e0e7f2',
                                height: '100px',
                                width: '100%',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <div style={{
                                    width: '53%',
                                    paddingBottom: '10px'
                                }}>
                                    <Box sx={{
                                        backgroundColor: 'lightcoral'
                                    }}>
                                        <SearchBoxComponent
                                            searchQuery={searchText}
                                            onClickSearch={onClickSearch}
                                            onPressEnter={onPressEnter}
                                            onSearchTextChange={onSearchTextChange}
                                        />
                                    </Box>
                                </div>
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <ResultComponent searchResults={searchResults}/>
                            </div>
                        </>
                    }
                    </div>
                </>
            }
        </>
    );
}

export default SearchComponent;