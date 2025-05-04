import React from 'react';
import {Routes, Route} from 'react-router-dom';

import MainComponent from "./components/home/MainComponent";
import BiomoleculeComponent from "./components/biomolecules/BiomoleculeComponent";
import AssociationComponent from "./components/associations/AssociationComponent";
import ExperimentComponent from "./components/experiments/ExperimentComponent";

import './App.css';
import StatisticsComponent from "./components/statistics/StatisticsComponent";
import NetworkExplorer from "./components/networks/NetworkExplorerComponent";
import PublicationComponent from "./components/publications/PublicationComponent";
import AboutComponent from "./components/about/AboutComponent";
import DownloadComponent from "./components/download/DownloadComponent";
import NamingComponent from "./components/about/NamingComponent";
import MainHelp from "./components/help/MainHelp";

function App() {

      return (
        <div className="App">
            <Routes>
                <Route path="/" element={<MainComponent/>}/>
                <Route path="/about" element={<AboutComponent/>}/>
                <Route path="/naming" element={<NamingComponent/>}/>
                <Route path="/search" element={<MainComponent/>}/>
                <Route path="/help" element={<MainHelp/>}/>
                <Route path="/biomolecule/:biomoleculeId" element={<BiomoleculeComponent/>} />
                <Route path="/association/:associationId" element={<AssociationComponent/>} />
                <Route path="/experiment/:experimentId" element={<ExperimentComponent/>} />
                <Route path="/publication/:publicationId" element={<PublicationComponent/>} />
                <Route path="/statistics/" element={<StatisticsComponent/>} />
                <Route path="/networks/" element={<NetworkExplorer/>} />
                <Route path="/download/" element={<DownloadComponent/>} />
            </Routes>
        </div>
      );
}

export default App;
