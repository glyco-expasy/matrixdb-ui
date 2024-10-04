import React, {useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom';
import {
    Box,
    CircularProgress, Typography
} from "@mui/material";
import http from "../../commons/http-commons";
import { useNavigate } from 'react-router-dom';
import ResultComponent from "./ResultComponent";
import ComplexSearchBoxComponent from "./ComplexSearchBoxComponent";
import LogoIcon from "../commons/icons/LogoIcon";

function SearchComponent() {

    const [searchQuery, setSearchQuery] = useState<string | null>(null);
    const [searchStart, setSearchStart] = useState(false);
    const [searchDone, setSearchDone] = useState(false);
    const [searchMode, setSearchMode] = useState<string>('0');
    const [searchResults, setSearchResults] = useState<any>({});

    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const query = searchParams.get('query');
        const mode = searchParams.get('mode') || '0';
        if(query) {
            setSearchQuery(query);
            setSearchStart(true);
            setSearchMode(mode);
            handleSearch(query, mode);
        }
    }, [location.search]);

    const handleSearch = (query: string, mode: string) => {
        http.get(`/search?query=${query}&mode=${mode}`)
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

    const launchSearch = ((query: string, searchMode: string) => {
        navigate(`/search?query=${query}&mode=${searchMode}`);
    })

    return (
        <>
            { currentPath === '/' &&
                <div className={"App App-search"}>
                        <div style={{textAlign: 'center'}}>
                            <h2>The extracellular matrix interaction database</h2>
                            <h4>Database focused on interactions established by extracellular matrix proteins, proteoglycans and glycosaminoglycans</h4>
                            <Typography variant="body2" component="div" style={{ display: 'inline-flex', alignItems: 'center' }}>
                                <span style={{ marginLeft: '8px' }}>MatrixDB is a member of the International Molecular Exchange consortium</span>
                                <LogoIcon logoName="imex" width="60" height="auto" />

                            </Typography>
                        </div>
                        <div style={{width: '70%'}}>
                            <ComplexSearchBoxComponent
                                searchMode={searchMode}
                                onLaunchSearch={launchSearch}
                                searchQuery={searchQuery}
                            />
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
                    {
                        searchDone && Object.keys(searchResults).length > 0 &&
                        <>
                            <div className={"App App-search"}>
                                <div style={{
                                    paddingTop: '10px',
                                    width: '70%'
                                }}>
                                    <ComplexSearchBoxComponent
                                        searchMode={searchMode}
                                        onLaunchSearch={launchSearch}
                                        searchQuery={searchQuery}
                                    />
                                </div>
                                <div style={{width: '70%'}}>
                                    <ResultComponent
                                        searchQuery={searchQuery}
                                        searchResults={searchResults}
                                    />
                                </div>
                            </div>
                        </>
                    }
                </>
            }
        </>
    );
}

export default SearchComponent;