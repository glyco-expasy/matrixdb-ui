import React, {useState} from "react";
import {Box, Drawer, List, ListItem, ListItemText, Typography} from "@mui/material";
import SearchHelp from "./SearchHelp";
import Header from "../home/HeaderComponent";
import Footer from "../home/Footer";
import BiomoleculeHelp from "./BiomoleculeHelp";
import NetworkExplorerHelp from "./NetworkExplorerHelp";

function MainHelp() {

    const [selectedTopic, setSelectedTopic] = useState(1);

    const helpTopics = [
        { id: 1, title: 'Search' },
        { id: 2, title: 'Biomolecules' },
        { id: 3, title: 'Network Explorer' }
    ];

    const handleTopicClick = (topic: number) => {
        setSelectedTopic(topic);
    };

    return(
        <div
            className="App"
            style={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh'
            }}
        >
            <Header pageDetails={{
                type: "help"
            }}/>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    margin: '0 auto',
                    width: '70%',
                    marginBottom: '5px',
                    background: 'rgb(237, 239, 245)',
                    paddingTop: '20px',
                }}
            >
                <Box sx={{ display: 'flex', width: '100%' }}>

                    <div>
                        <List>
                            {helpTopics.map((topic) => (
                                <ListItem button key={topic.id} onClick={()=>handleTopicClick(topic.id)}>
                                    <ListItemText primary={topic.title} />
                                </ListItem>
                            ))}
                        </List>
                    </div>

                    {/* Right-side Content */}
                    <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: 'white', borderRadius: 1 }}>
                        {
                            selectedTopic === 1 && <SearchHelp/>
                        }
                        {
                            selectedTopic === 2 && <BiomoleculeHelp/>
                        }
                        {
                            selectedTopic === 3 && <NetworkExplorerHelp/>
                        }
                    </Box>
                </Box>
            </div>
            <Footer/>
        </div>
    );
}

export default MainHelp;