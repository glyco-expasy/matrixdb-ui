import {useEffect, useState, useRef} from "react";
import cytoscape from "cytoscape";
import {
    Card,
    CardContent,
    Typography,
    TextField,
    IconButton,Tooltip, Chip, Box, Paper,
} from "@mui/material";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

import React from "react";
import NewFilterComponent from "./filter/FilterComponent";
import {RootState} from "../../stateManagement/store";
import {connect, ConnectedProps} from "react-redux";
import FilterManager from "./filter/FilterManager";
import cytoscapeLogo from "../../assets/images/cytoscape.png";
import {faFileDownload} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {CSVLink} from "react-csv";

function PartnerOverview(props: any) {

    const {partner} = props;

    if (partner) {
        return (
            <Card style={{ flex: 0.35, backgroundColor: 'white', margin: '10px' }}>
                <CardContent style={{ flex: 0.35, backgroundColor: 'white', padding: '20px' }}>
                    <Typography variant="body2" gutterBottom>
                        <a href={"/biomolecule/" + partner.biomoleculeId} style={{ wordBreak: 'break-all' }}>
                            {partner.name || (partner.names && partner.names.name) || partner.biomoleculeId}
                        </a>
                    </Typography>
                    <Typography color="textSecondary">
                        {partner.type}
                    </Typography>
                    {partner.ecm &&
                        <div style={{
                            width: '140px'
                        }}>
                            <Chip
                                sx={{
                                    borderColor: 'darkblue',
                                    color: 'darkblue'
                                }}
                                size="small"
                                label="MatrixDB ECM"
                                variant="outlined"
                            />
                        </div>
                    }
                </CardContent>
            </Card>
        );
    } else {
        return <></>
    }
}

function AssociationOverview(props: any) {

    const [association, setAssociation] = useState<any>(null);

    useEffect(() => {
        setAssociation(props.interaction);
    }, [props.interaction])

    if (association) {
        return (
            <Card style={{ flex: 0.35, backgroundColor: 'white', margin: '10px' }}>
                <CardContent style={{ flex: 0.35, backgroundColor: 'white', padding: '20px' }}>
                    <Typography variant="body2" gutterBottom>
                        <a href={"/association/" + association.id} style={{ wordBreak: 'break-all' }}>
                            {association.id && association.id}
                        </a>
                    </Typography>
                    {
                        association.score && association.score!== 0 && <Typography variant="body2">
                            <strong>Score: {association.score} </strong>
                        </Typography>
                    }
                    {
                        association.type && association.type === 2 && <Typography variant="body2" color="#946011">
                            <strong>Predicted</strong>
                        </Typography>
                    }
                </CardContent>
            </Card>
        );
    } else {
        return <></>
    }
}

function Legend(){
    return(
        <Card style={{ flex: 0.35, backgroundColor: 'white', margin: '10px' }}>
            <CardContent style={{ flex: 0.35, backgroundColor: 'white', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#f89406', marginRight: '10px' }}></div>
                    <span>Protein</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%',backgroundColor: '#018FD5', marginRight: '10px' }}></div>
                    <span>GAG</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%',backgroundColor: '#6a09c5', marginRight: '10px' }}></div>
                    <span>Multimer</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%',backgroundColor: '#f5e214', marginRight: '10px' }}></div>
                    <span>PFRAG</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%',backgroundColor: 'black', marginRight: '10px' }}></div>
                    <span>Cation</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%',backgroundColor: 'lightpink', marginRight: '10px' }}></div>
                    <span>Lipid</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%',backgroundColor: '#d3b486', marginRight: '10px' }}></div>
                    <span>SPEP</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <hr style={{ width: '20px', border: '2px solid black', marginRight: '10px' }} />
                    <span>Experimentally Supported</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <hr style={{ width: '20px', border: '2px solid red', marginRight: '10px' }} />
                    <span>Predicted Interactions</span>
                </div>
            </CardContent>
        </Card>
    )
}

function CytoscapeComponent(props: any) {

    const { biomoleculeId, participants, associations, context, originalNetwork } = props;
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [selectedInteraction, setSelectedInteraction] = useState(null);
    const [associationsToDownload, setAssociationsToDownload] = useState<any[]|[]>([]);
    const cyRef = useRef(null);

    const [quickSearchText, setQuickSearchText] = useState<string | null>(null);
    const [searchDone, setSearchDone] = useState<boolean>(false);

    const [filteredParticipants, setFilteredParticipnats] = useState<number>(0);
    const [filteredAssociations, setFilteredAssociations] = useState<number>(0);

    useEffect(() => {
        if(context && associations) {
            let associationsToDownlaod: any[] = [];
            associations.forEach((assocation: any) => {
                let particpantId = null;
                let p1 = assocation.participants[0];
                if(p1 !== 1) {
                    particpantId = p1;
                }
                if(assocation.participants.length > 1) {
                    let p2 = assocation.participants[1];
                    if(p2 !== 1) {
                        particpantId = p2;
                    }
                }
                associationsToDownlaod.push({
                    participant: context.interactors.interactor_mapping[particpantId],
                    id: assocation.id,
                    score: assocation.score,
                    type: assocation.type === 1 ? 'Experimental' : 'Predicted'
                });
                setAssociationsToDownload(associationsToDownlaod);
            });
        }
    }, []);

    const circularLayout = {
        name: 'circle',
        radius: 150,
        fit: true,
        transform: (node: any, position: any) => {
            position.y -= 350;
            position.x -= 350;
            return position;
        },
    }

    const coseLayout = {
        name: 'cose',
        idealEdgeLength: ( edge: any ) =>  {return 32},
        nodeOverlap: 20,
        fit: true,
        padding: 30,
        randomize: false,
        componentSpacing: 100,
        nodeRepulsion: ( node: any ) => { return 2048; },
        edgeElasticity: ( edge: any ) => { return 32; },
        nestingFactor: 5,
        gravity: 80,
        numIter: 1000,
        initialTemp: 200,
        coolingFactor: 0.95,
        minTemp: 1.0
    }

    const cy = useRef(cytoscape());

    const generateDownloadLink = () => {
        if(cy.current) {
            const base64URI = cy.current.png();
            const link = document.createElement('a');
            link.href = base64URI;
            link.download = `${biomoleculeId}-interactions-cytoscape-graph.png`;
            link.click();
        }
    };

    const generateCytoscapeLink = () => {
        if(cy.current) {
            const jsonGraph = JSON.stringify(cy.current.json());
            const base64URI = `data:application/json;base64,${btoa(jsonGraph)}`;
            const link = document.createElement('a');
            link.href = base64URI;
            link.download = `${biomoleculeId}-interactions-cytoscape.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const onSeachText = (event: any) => {
        let searchText = event.target.value;
        setQuickSearchText(searchText);
    }

    const onQuickSearch = (event: any) => {
        if (event.key === 'Enter') {
            setSearchDone(true);
            drawGraph();
        }
    }

    const getQuickSearchAssociations = () => {
        if(searchDone && quickSearchText) {
            let filteredParticipants = participants.filter((participant: any) => {
                if(participant.name) {
                    return participant.name.toLowerCase().includes(quickSearchText.toLowerCase());
                }
                return false;

            });
            let filterParticipantIds = filteredParticipants.map((filterParticipant: any) => filterParticipant.id);
            let filteredAssociations = associations.filter((association: any) => {
                let participants = association.participants;
                return (filterParticipantIds.includes(participants[0]) || filterParticipantIds.includes(participants[1]));
            });
            return filteredAssociations;
        }
        return null;
    }

    const drawGraph = () => {
        if (cyRef.current && associations.length > 0) {
            //let elements = [];
            /*elements.push({
                data: {
                    id: centerBiomoleculeId,
                    label: centerBiomoleculeId,
                    type: 'center'
                },
                position: {
                    x: 0,
                    y: 0
                }
            });*/

            /*associations.forEach((association: any) => {
                let partnerId = association.participants.filter((participantId: string) => participantId !== centerBiomoleculeId)[0];
                //TODO: self interactions to be handled
                if (partnerId && partnerId !== centerBiomoleculeId) {
                    elements.push({
                        data: {
                            id: partnerId,
                            label: partnerId,
                            type: 'interactor'
                        },
                        position: {
                            x: radius * Math.cos(i * 2 * (Math.PI / partners.size)),
                            y: radius * Math.sin(i * 2 * (Math.PI / partners.size))
                        }
                    });
                    elements.push({
                        data: {
                            source: centerBiomoleculeId,
                            target: partnerId,
                            label: association["id"]
                        }
                    });
                    i++;
                } else {
                    console.log(association.id)
                    console.log(association.participants)
                    console.log(partnerId);
                }

            });*/

            let elements: Array<any> = [];
            /*participants.forEach((participant: any) => {
                elements.push({
                    data: {
                        id: participant.id,
                        label: participant.id
                    }
                });
            });*/

            let filteredParticipants = new Set<string>();

            let quickSearchAssociations = getQuickSearchAssociations();
            if (quickSearchAssociations) {
                quickSearchAssociations.forEach((association: any) => {
                    association.participants.forEach((participant: string) => {
                        filteredParticipants.add(participant);
                    });
                });
            } else {
                associations.forEach((association: any) => {
                    association.participants.forEach((participant: string) => {
                        filteredParticipants.add(participant);
                    });
                });
            }

            let participantsToDraw: any[] = [];
            participants.forEach((participant: any) => {
                if (filteredParticipants.has(participant.id)) {
                    participantsToDraw.push({
                        data: {
                            id: participant.id,
                            label: participant.id,
                            type: participant.type
                        }
                    });
                }
            });
            setFilteredParticipnats(participantsToDraw.length);

            let associationsToDraw: any[] = [];
            if (quickSearchAssociations) {
                quickSearchAssociations.forEach((association: any) => {
                    // Check for self interactions
                    let firstParticipant = association.participants[0];
                    let secondParticipant;
                    if (association.participants.length === 1) {
                        secondParticipant = association.participants[0];
                    } else {
                        secondParticipant = association.participants[1];
                    }
                    associationsToDraw.push({
                        data: {
                            source: firstParticipant,
                            target: secondParticipant,
                            label: association.id,
                            type: association.type && association.type === 2 ? 'predicted' : 'experimental'
                        }
                    });
                });
            } else {
                associations.forEach((association: any) => {
                    // Check for self interactions
                    let firstParticipant = association.participants[0];
                    let secondParticipant;
                    if (association.participants.length === 1) {
                        secondParticipant = association.participants[0];
                    } else {
                        secondParticipant = association.participants[1];
                    }

                    if(firstParticipant === biomoleculeId) {
                        if('-' in firstParticipant) {
                            firstParticipant = firstParticipant.split('-')[0];
                        }
                    }

                    if(secondParticipant === biomoleculeId) {
                        if('-' in secondParticipant) {
                            secondParticipant = secondParticipant.split('-')[0];
                        }
                    }

                    associationsToDraw.push({
                        data: {
                            source: firstParticipant,
                            target: secondParticipant,
                            label: association.id,
                            type: association.type && association.type === 2 ? 'predicted' : 'experimental'
                        }
                    });
                });
            }
            setFilteredAssociations(associationsToDraw.length);

            elements.push(...participantsToDraw);
            elements.push(...associationsToDraw);

            let layout;
            if (filteredParticipants.size < 20) {
                layout = circularLayout;
            } else {
                layout = coseLayout;
            }
            console.log("cytoscape initializting")
            cy.current = cytoscape({
                container: cyRef.current,
                elements: elements,
                layout: layout,
                style: [
                    {
                        selector: 'node[id="' + biomoleculeId + '"]',
                        style: {
                            label: 'data(label)',
                            width: "20px",
                            height: "20px",
                            'background-color': "green !important",
                            'text-valign': 'center',
                            'text-halign': 'center',
                            'font-size': '10px',
                            'font-family': 'Arial',
                            'text-outline-color': '#000',
                        }
                    },
                    {
                        selector: 'node[type="interactor"]',
                        style: {
                            width: "10px",
                            height: "10px",
                            'background-color': "green",
                        },
                    },
                    {
                        selector: 'node[type="protein"]',
                        style: {
                            'background-color': "#f89406",
                        },
                    },
                    {
                        selector: 'node[type="gag"]',
                        style: {
                            'background-color': "#018FD5",
                        },
                    },
                    {
                        selector: 'node[type="multimer"]',
                        style: {
                            'background-color': "#6a09c5",
                        },
                    },
                    {
                        selector: 'node[type="pfrag"]',
                        style: {
                            'background-color': "#f5e214",
                        },
                    },
                    {
                        selector: 'edge',
                        style: {
                            width: "1px",
                            'line-color': '#313030'
                        },
                    },
                    {
                        selector: 'edge[type="predicted"]',
                        style: {
                            width: "1px",
                            'line-color': 'red'
                        },
                    },
                ],
                userZoomingEnabled: false,
            });
            console.log("cytoscape done")
            // Calculate node size based on degree
            const nodes = cy.current.nodes();
            let maxDegree = 0;

            console.log("Starting to calculate")
            nodes.forEach((node: any) => {
                const degree = node.degree(true);
                if (degree > maxDegree) {
                    maxDegree = degree;
                }
            });
            console.log("Calculate the max degree " + maxDegree);

            nodes.forEach((node: any) => {
                const degree = node.degree(true);
                const nodeSize = 20 + (20 * (degree / maxDegree));

                node.style('width', nodeSize).style('height', nodeSize);
            });
            console.log("Calculated the node size")
            cy.current.zoom(1.5);

            cy.current.on('click', 'node', function (event: any) {
                const node = event.target;
                let nodeId = parseInt(node.id());
                let selectedPartner = participants.filter((p: any) => p.id === nodeId)[0];
                let sortedIds = [props.biomoleculeId, context.interactors.interactor_mapping[selectedPartner.id]].sort();
                let selectedInteraction = associations.find((association: any) => association.id === sortedIds[0] + '__' + sortedIds[1]);
                if (selectedInteraction) {
                    setSelectedInteraction(selectedInteraction);
                    setSelectedPartner(null);
                }
            });

            cy.current.on('mouseover', 'node', function (event: any) {
                const node = event.target;
                let nodeId = parseInt(node.id());
                let selectedPartner = participants.filter((p: any) => p.id === nodeId)[0];
                let newSelectedPartner = JSON.parse(JSON.stringify(selectedPartner))
                if (selectedPartner) {
                    newSelectedPartner.biomoleculeId = context.interactors.interactor_mapping[nodeId];
                    setSelectedPartner(newSelectedPartner);
                    setSelectedInteraction(null);
                }
            });

            cy.current.on('mouseout', 'node', function (event: any) {
                const node = event.target;
            });

        }
    }

    useEffect(() => {
        drawGraph();
    }, [participants, associations]);

    return (
        <>
            {cyRef &&
                <Box display="flex">
                    <Box
                        flex={0.65}
                        bgcolor="lightgray"
                        display="flex"
                        flexDirection="column"
                        position="relative"
                    >
                        <Box width="220px" p={1}>
                            {selectedPartner && <PartnerOverview partner={selectedPartner} />}
                            {selectedInteraction && <AssociationOverview interaction={selectedInteraction} />}
                        </Box>
                        <Box mt="auto" p={1}>
                            <Legend />
                        </Box>
                    </Box>
                    <Box display="flex" flexDirection="column">
                        <Tooltip title="Download an image" arrow>
                            <IconButton size="small" style={{ color: 'green' }} onClick={generateDownloadLink} aria-label="download">
                                <PhotoCameraIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Export to cytoscape" arrow>
                            <IconButton size="small" style={{ color: 'green' }} onClick={generateCytoscapeLink} aria-label="download">
                                <img src={cytoscapeLogo} style={{ width: '25px', height: 'auto' }} />
                            </IconButton>
                        </Tooltip>
                        {
                            associations &&
                            <div style={{
                                paddingLeft: '8px',
                                paddingTop: '5px'
                            }}>
                                <CSVLink
                                    data={associationsToDownload}
                                    headers={['id','participant', 'score', 'type']}
                                    filename={`interactions.csv`}
                                >
                                    <FontAwesomeIcon
                                        icon={faFileDownload}
                                        style={{
                                            marginRight: '10px',
                                            fontSize: '1.5em'
                                        }}
                                        color={'darkgreen'}
                                    />
                                </CSVLink>
                            </div>
                        }
                    </Box>
                    <Box flex={3} position="relative">
                        <Box
                            ref={cyRef}
                            sx={{ width: '100%', height: '800px', position: 'relative' }}
                        />
                            <Paper
                                elevation={3}
                                sx={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: '#fff',
                                }}
                            >
                                <TextField
                                    id="outlined-textarea"
                                    label="Quick Search"
                                    placeholder="Search for participant(s)"
                                    onChange={onSeachText}
                                    onKeyDown={onQuickSearch}
                                    size="small"
                                />
                            </Paper>
                            {
                                (
                                    !quickSearchText && (originalNetwork.participants !== participants.length ||
                                    originalNetwork.associations !== associations.length
                                )) &&
                                <Paper
                                    elevation={3}
                                    sx={{
                                        position: 'absolute',
                                        bottom: '10px',
                                        right: '10px',
                                        width: '170px',
                                        height: '100px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: '#fff',
                                    }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}>
                                        <div style={{
                                            display: 'flex'
                                        }}>
                                            <Typography variant="body2">
                                                Participants: {filteredParticipants} / {originalNetwork.participants}
                                            </Typography>
                                        </div>
                                        <div style={{
                                            display: 'flex'
                                        }}>
                                            <Typography variant="body2">
                                                Associations: {filteredAssociations} / {originalNetwork.associations}
                                            </Typography>
                                        </div>
                                    </div>
                                </Paper>
                            }
                    </Box>
                </Box>
            }
        </>
    );
}

const mapStateToProps = (state: RootState) => ({
    network: state.network,
    filters: state.filters
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type AssociationNetworkProps = PropsFromRedux & {biomoleculeIds: string[] | []}

const AssociationNetworkComponent : React.FC<AssociationNetworkProps> = ({
                                                                             network,
                                                                             filters,
                                                                             biomoleculeIds}) => {

    const filterManager = new FilterManager(network, null);
    const currentNetwork = filterManager.getFilteredNetwork(filters);
    return (
        <div style={{ display: 'flex' }}>
            <div
                style={{
                    flex: 3.65,
                    flexDirection: "column",
                    height: "800px"
                }}
            >
                {
                    currentNetwork.interactors &&
                    <CytoscapeComponent
                        biomoleculeId={biomoleculeIds[0]}
                        participants={currentNetwork.interactors}
                        associations={currentNetwork.interactions}
                        context={network.context}
                        originalNetwork={{
                            participants: network.interactors.length,
                            associations: network.interactions.length,
                        }}
                    />
                }
            </div>

            <div style={{flex: 1.35, backgroundColor: 'lightgray'}}>
                <NewFilterComponent/>
            </div>
        </div>
    );

}

export default connector(AssociationNetworkComponent);