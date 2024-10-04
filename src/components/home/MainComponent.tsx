import React, {useState} from 'react';
import { useLocation } from 'react-router-dom';
import {
    useTheme
 } from "@mui/material";
import SearchComponent from '../search/SearchComponent';
import MainContentComponent from './MainContentComponent';
import Header from "./HeaderComponent";
import Footer from "./Footer";


function MainComponent() {

    const theme = useTheme();

    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <div style={{
            fontFamily: 'Arial',
            display: 'flex',
            flexDirection: 'column',
            height: '100vh'
        }}>
            <Header pageDetails={{
                type: "home",
                id: ""
            }}/>
            <main style={{ flex: 1}}>
                <div style={{
                    paddingTop: '30px',
                    marginBottom: '5px'
                }}>
                    <SearchComponent/>
                </div>
                {currentPath !== '/search' && <MainContentComponent/>}
            </main>
            <Footer/>
        </div>
    );
}

export default MainComponent;
