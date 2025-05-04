import {List, ListItem, Typography} from "@mui/material";
import React from "react";

const SelectableList: React.FC<any> = (props: any) => {

    const {selectedItem, itemIds, onItemChange, itemLogo, itemURL} = props;

    const rowColor = (itemId: string, index: number) => {
        if(selectedItem === itemId) {
            return {border: '1px solid #3498db'};
        } else {
            if(index % 2 === 0) {
                return {background: 'white'}
            } else {
                return {background: 'rgb(223,236,243)'};
            }
        }
    }

    return (
        <List style={{
            height: '500px',
            overflowY: 'auto'
        }}>
            {itemIds.map((itemId: string, index: number) => (
                <ListItem key={index}
                          style={rowColor(itemId, index)}
                          onClick={() => onItemChange(itemId)}
                >
                    <img
                        src={itemLogo}
                        style={{
                            width: '20px',
                            paddingRight: '10px'
                        }}/>
                    <Typography variant={'body2'}>
                        <a
                            href={`${itemURL}${itemId}`}
                            target='_blank'
                            rel="noreferrer"
                        >
                            {itemId}
                        </a>
                    </Typography>
                </ListItem>
            ))}
        </List>
    );
};

export default SelectableList;