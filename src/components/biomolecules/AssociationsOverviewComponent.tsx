import React, {useEffect, useState} from 'react';
import {
    Box, CircularProgress, IconButton, Paper, Tab, Tabs
} from "@mui/material";
import http from "../../commons/http-commons";
import AssociationNetworkComponent from "../networks/AssociationNetworkComponent";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {connect, ConnectedProps} from "react-redux";
import * as actions from "../../stateManagement/actions";
import AssociationListComponent from "../tables/AssociationListComponent";
import {AppDispatch, RootState} from "../../stateManagement/store";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import HelpDrawerComponent from "../help/HelpDrawerComponent";


interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

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

type PropsFromRedux = ConnectedProps<typeof connector>;

type AssociationOverviewComponentProps = PropsFromRedux & {
    biomoleculeId : string,
    onInteractionLoad: () => void
};


const AssociationsOverviewComponent: React.FC<AssociationOverviewComponentProps> = ({
                                                                                        biomoleculeId,
                                                                                        onInteractionLoad,
                                                                                        setNetworkDataAction
                                                                                    }) => {

    const [interactors, setInteractors] = useState<any | null>();
    const [interactorStats, setInteractorStats] = useState<any | null>();
    const [isExpanded, setIsExpanded] = useState(true);
    const [tabValue, setTabValue] = useState(0);
    const [openHelp, setOpenHelp] = useState(false);

    useEffect(() => {
        // Get network for biomoleculeId
        http.post('/network', {
                biomolecules: [biomoleculeId],
                second_neighborhood: false
            })
            .then((networkResponse) => {
                let networkData = networkResponse.data;
                setNetworkDataAction(networkData);
                if(networkData) {
                    setInteractors(networkData.interactors);
                }

                // Partner count considering self interactions
                let partnerCount = networkData.partnerCount;
                let filtered = networkData.interactions.filter((interaction:any) => interaction.id === `${biomoleculeId}__${biomoleculeId}`)

                let interactorStats = {
                    partners: partnerCount,
                    supportingEvidence : 0,
                    predictedInteractions: 0,
                    experimentalInteractions: 0
                }
                let binary = new Set(), spokeExpandedFrom = new Set();
                let predictedInteractions = 0, experimentalInteractions = 0;
                networkData.interactions.forEach((interaction: any) => {
                    if(interaction?.experiments?.direct?.binary.length > 0) {
                        interaction.experiments.direct.binary.forEach((exp: string) => binary.add(exp));
                    }

                    if(interaction?.experiments?.direct?.spoke_expanded_from?.length > 0) {
                        interaction.experiments.direct.spoke_expanded_from.forEach((exp: string) => spokeExpandedFrom.add(exp));
                    }

                    if(interaction?.experiments?.direct?.binary.length > 0 || interaction?.experiments?.direct?.spoke_expanded_from?.length > 0) {
                        experimentalInteractions += 1;
                    }

                    if(interaction?.type === 2) {
                        predictedInteractions +=1;
                    }
                });
                interactorStats.supportingEvidence += (binary.size + spokeExpandedFrom.size);
                interactorStats.predictedInteractions = predictedInteractions;
                interactorStats.experimentalInteractions = experimentalInteractions;
                if(networkData.interactors.length > 0) {
                    onInteractionLoad();
                }
                setInteractorStats(interactorStats);
            })
            .catch((reason: any) => {
                console.log("Error in response, " + reason);
            })
    }, [biomoleculeId]);

    const paperStyle = {
        background: 'rgba(255, 255, 255, 0.9)',
        boxShadow: '3px 3px 8px rgba(0, 0, 0, 0.3)',
        padding: '16px',
        width: '100%',
        borderRadius: 0
    };

    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
    };

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

    return (
        <>
            {
                !interactors &&
                <Paper style={paperStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', background: '#e1ebfc' }}>
                        <div style={{
                            paddingLeft: '20px',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            <h3 style={{
                                paddingRight: '5px'
                            }}>
                                Interactions
                            </h3>
                            <CircularProgress
                                size={25}
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
                                helpType="BIOMOLECULE"
                                open={openHelp}
                                onClose={() => setOpenHelp(false)}
                            />
                        </div>
                    </div>
                </Paper>
            }
            {
                interactors && interactors.length > 0 &&
                <div>
                    <Paper style={paperStyle}>
                        <>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                background: '#e1ebfc',
                            }}>
                                <span style={{paddingLeft: '10px'}}>
                                    <h3>Interactions</h3>
                                </span>
                                <div style={{
                                    display: "flex",
                                    width: "5%",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginLeft: 'auto'
                                }}>
                                    <IconButton
                                        onClick={() => setOpenHelp(true)}
                                        size={'small'}
                                    >
                                        <HelpOutlineIcon/>
                                    </IconButton>
                                    <HelpDrawerComponent
                                        helpType="BIOMOLECULE"
                                        open={openHelp}
                                        onClose={() => setOpenHelp(false)}
                                    />
                                </div>
                            </div>
                            <div>
                                {
                                    interactorStats &&
                                    <div style={{clear: 'left', textAlign: 'left'}}>
                                        <h4 >Participants: {interactorStats.partners}</h4>
                                        {interactorStats.supportingEvidence > 0 &&
                                            <div style={{ display: 'flex' }}>
                                                <h4 style={{ display: 'inline-block', margin: '0' }}>Experimentally Supported Interactions: {interactorStats.experimentalInteractions}</h4>
                                            </div>
                                        }
                                        {interactorStats.predictedInteractions > 0 && <h4>Predicted Interactions: <span style={{ color : 'darkred'}}>{interactorStats.predictedInteractions}</span> </h4>}
                                    </div>
                                }
                                <div style={{float: 'right'}}>
                                    <IconButton onClick={toggleExpansion}>
                                        {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                    </IconButton>
                                </div>
                            </div>
                            {
                               isExpanded && biomoleculeId &&
                               <>
                                   <Tabs value={tabValue} onChange={handleTabChange} centered>
                                       <Tab label="Interaction List View" />
                                       <Tab label="Network View" />
                                   </Tabs>
                                   <TabPanel value={tabValue} index={0}>
                                       <AssociationListComponent
                                            biomoleculeIds={[biomoleculeId]}
                                       />
                                   </TabPanel>
                                   <TabPanel value={tabValue} index={1}>
                                       <AssociationNetworkComponent
                                            biomoleculeIds={[biomoleculeId]}
                                       />
                                   </TabPanel>
                               </>
                            }
                        </>
                    </Paper>
                </div>
            }
        </>
    );
}

export default connector(AssociationsOverviewComponent);