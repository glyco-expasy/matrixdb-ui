import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {AppBar, Toolbar, useTheme} from "@mui/material";
import logo from "../../assets/images/matrixdb_logo_medium.png";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleNodes} from '@fortawesome/free-solid-svg-icons';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import {saveToLocalStorage} from "../../commons/memory-manager";

interface HeaderProps {
    pageDetails: {
        type: string,
        id?: string
    }
}

function Header(props: HeaderProps) {

    const {pageDetails} = props;
    const [selectedBiomolecules, setSelectedBiomolecules] = useState<string[]>([]);
    const [biomoleculeAdded, setBiomoleculeAdded] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setSelectedBiomolecules(getFromLocalStorage("selectedBiomolecules"));
    }, []);

    useEffect(() => {
        let currentBiomoleculeId = props.pageDetails.id;
        if(currentBiomoleculeId && selectedBiomolecules) {
            let selectedBiomoleculeIds = selectedBiomolecules.map((biomolecule: any) => biomolecule.id);
            if(selectedBiomoleculeIds.includes(currentBiomoleculeId)) {
                setBiomoleculeAdded(true);
            }
        }
    }, [props.pageDetails, selectedBiomolecules]);

    const getFromLocalStorage = (key: string) => {
        try {
            const storedData = localStorage.getItem(key);
            return storedData ? JSON.parse(storedData) : null;
        } catch (error) {
            console.error('Error retrieving from local storage:', error);
            return null;
        }
    };

    const onBiomoleculeAdd = () => {
        if(pageDetails && pageDetails.id) {
            if(biomoleculeAdded) {
                goToExplorer();
            } else {
                setBiomoleculeAdded(true);
                let selected = getFromLocalStorage("selectedBiomolecules");
                if(!selected) selected = [];

                if(!selected.includes(pageDetails.id)) {
                    saveToLocalStorage("selectedBiomolecules", [...selected, pageDetails.id]);
                }
            }
        }
    }

    const goToExplorer = () => {
        navigate("/networks")
    }

    const isBiomoleculeAdded = () => {
        let selected = getFromLocalStorage("selectedBiomolecules");
        return selected && selected.includes(pageDetails.id);
    }

    const getBiomoleculeCount = () => {
        return getFromLocalStorage("selectedBiomolecules").length;
    }

    const theme = useTheme();

    return(
        <div style={{height: '5vh'}}>
        <AppBar
            style={{ zIndex: theme.zIndex.drawer + 1, position: "fixed", top: 0 }}
            position="static"
        >
            <Toolbar className={'App-search-header'}>
                <a href="/">
                    <div>
                        <img src={logo} style={{width: '50px', height: '50px'}} className={"App-logo"}/>
                    </div>
                </a>
                <div style={{ marginLeft: 'auto' }}>
                    <span style={{ paddingRight: '4px' }}>
                        <a style={{color: 'white', textDecoration: 'none', position: 'relative'}} href="/about">
                            About MatrixDB
                        </a>
                        <span style={{color: 'white', padding: '0 4px'}}>|</span>
                    </span>
                    <span style={{ paddingRight: '4px' }}>
                        <a style={{color: 'white', textDecoration: 'none', position: 'relative'}} href="/naming">
                            MatrixDB Nomenclature
                        </a>
                        <span style={{color: 'white', padding: '0 4px'}}>|</span>
                    </span>
                    <span style={{paddingRight: '4px'}}>
                        <a style={{color: 'white', textDecoration: 'none', position: 'relative'}} href="/download">
                            Download
                        </a>
                        <span style={{color: 'white', padding: '0 4px'}}>|</span>
                    </span>
                    <span style={{ paddingRight: '4px' }}>
                        <a style={{color: 'white', textDecoration: 'none', position: 'relative'}} href="/help">
                            Help
                        </a>
                    </span>
                    {pageDetails.type !== 'network' &&
                        <>
                            <span style={{color: 'white', padding: '0 4px'}}>|</span>
                            <span style={{paddingRight: '4px'}}>
                                <a style={{color: 'white', textDecoration: 'none', position: 'relative'}} href="/networks">
                                    Network Explorer
                                </a>
                            </span>
                        </>
                    }
                    {
                        pageDetails.type === 'biomolecule' &&
                        <button style={{
                            color: 'white',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            position: 'relative',
                            marginRight: '10px'
                        }}
                            title={isBiomoleculeAdded() ? "Go to Explorer" : "Add " + pageDetails.id +" to Explorer"}
                            onClick={onBiomoleculeAdd}
                        >
                            <FontAwesomeIcon
                                icon={faCircleNodes}
                                style={{ fontSize: '1.5em' }}
                                color={!isBiomoleculeAdded() ? 'green': 'white' }
                            />
                            {
                                !isBiomoleculeAdded() &&
                                <FontAwesomeIcon
                                    icon={faPlus}
                                    style={{ position: 'absolute', top: '-8px', fontSize: '0.8em' }}
                                    color={'green'}
                                />
                            }
                            {
                                selectedBiomolecules && selectedBiomolecules.length > 0 && (
                                    <div style={{ position: 'absolute', top: '-8px', fontSize: '0.8em', color: 'white' }}>
                                        {getBiomoleculeCount()}
                                    </div>
                                )
                            }
                        </button>
                    }
                    {
                        pageDetails.type !== 'biomolecule' && pageDetails.type !== 'network' &&
                        <button style={{
                            color: 'white',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            position: 'relative',
                            marginRight: '10px'
                        }}
                            title={"Go to Explorer"}
                            onClick={goToExplorer}
                        >
                            <FontAwesomeIcon
                                icon={faCircleNodes}
                                style={{ fontSize: '1.5em' }}
                                color={!biomoleculeAdded ? 'green': 'blue' }

                            />
                            {selectedBiomolecules && selectedBiomolecules.length > 0 && (
                                <div style={{ position: 'absolute', top: '-8px', fontSize: '0.8em', color: 'green' }}>
                                    {selectedBiomolecules.length}
                                </div>
                            )}
                        </button>
                    }

                    {/*
                    <button style={{ color: 'white', background: 'transparent', border: 'none', cursor: 'pointer'}} title="Downloads">
                        <FontAwesomeIcon icon={faDownload} style={{ marginRight: '10px', fontSize: '1.5em' }} />
                    </button>

                    <button style={{ color: 'white', background: 'transparent', border: 'none', cursor: 'pointer' }} title="Help">
                        <FontAwesomeIcon icon={faInfo} style={{ marginRight: '10px', fontSize: '1.5em' }} />
                    </button>*/
                    }
                </div>
            </Toolbar>
        </AppBar>
        </div>
    );
}

export default Header;