import { Drawer, IconButton, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import CloseIcon from "@mui/icons-material/Close";
import CircleIcon from "@mui/icons-material/Circle";
import NetworkExplorerHelp from "./NetworkExplorerHelp";
import SearchHelp from "./SearchHelp";
import BiomoleculeHelp from "./BiomoleculeHelp";

function HelpDrawerComponent(props: any) {

    const {helpType} = props;
    const [open, setOpen]= useState(false);

    useEffect(() => {
        setOpen(props.open);
    }, [props.open]);

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (event.type === 'keydown' && (event as React.KeyboardEvent).key === 'Tab') {
            return;
        }
        if (event.type === 'keydown' && (event as React.KeyboardEvent).key === 'Shift') {
            return;
        }
        props.onClose(open);
    };

    return (
        <Drawer
            open={open}
            onClose={toggleDrawer(false)}
            anchor={"right"}
            PaperProps={{
                sx: {
                    width: '40vw',
                    top: '45px',
                    position: 'absolute'
                }
            }}
        >
            <div
                style={{
                    display: "flex",
                    paddingTop: "15px",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "#050a30",
                    color: "white"
                }}
            >
                <div style={{
                    width: "80%",
                    paddingLeft: "5px"
                }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        Help
                    </Typography>
                </div>
                <div style={{
                    width: "20%",
                    textAlign: "right"
                }}>
                    <IconButton onClick={toggleDrawer(false)} style={{ color: 'white' }}>
                        <CloseIcon />
                    </IconButton>
                </div>
            </div>
            <div style={{
                width: '100%'
            }}>
                {
                    helpType === 'NETWORK_EXPLORER' &&
                    <NetworkExplorerHelp/>
                }
                {
                    helpType === 'SEARCH' &&
                    <SearchHelp/>
                }
                {
                    helpType === 'BIOMOLECULE' &&
                    <BiomoleculeHelp/>
                }

            </div>
        </Drawer>
    );
}

export default HelpDrawerComponent;