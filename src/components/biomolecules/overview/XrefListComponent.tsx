import React, {useState} from "react";
import {Collapse, IconButton, Link, List, ListItem, ListItemText, Typography} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const XefListComponent: React.FC<any> = (props: any) => {
    const {label, xrefList, xrefLink} = props;
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    if(xrefList) {
        return (
            <div>
                <div style={{ flexBasis: '10%', paddingRight: '10px', paddingTop: '5px', paddingBottom: '3px', alignItems: 'center' }}>
                    <Typography variant={"body2"} style={{color: 'darkblue', fontWeight: 'bold'}}>
                        {label}
                    </Typography>
                </div>
                <List style={{
                    padding: 0
                }}>
                    {xrefList.map((item : any) => (
                        <ListItem style={{
                            padding: 1
                        }}>
                            <div style={{ flexBasis: '10%', paddingRight: '10px', alignItems: 'center' }}>
                                <a
                                    href={`${xrefLink}${item.id}`}
                                    target={'_blank'} rel="noopener noreferrer">
                                    <Typography variant="body2">
                                        {item.id}
                                    </Typography>
                                </a>
                            </div>
                            <div style={{ flexBasis: '50%', verticalAlign: 'center' }}>
                                <Typography variant="body2">
                                    {item.value}
                                </Typography>
                            </div>
                        </ListItem>
                    ))}
                </List>
            </div>
        );
    } else {
        return(<></>);
    }
};

export default XefListComponent;