import React, {useEffect, useState} from "react";
import {Checkbox, IconButton, Tooltip, Typography} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import {PlayCircle} from "@mui/icons-material";
import BiomoleculeCard from "../commons/cards/BiomoleculeCards";

const NetworkParticipantBoard: React.FC<any> = (props: any) => {

    const {onBiomoleculeRemove, onClear, onGenerate} = props;
    const [onlyDirectPartners, setOnlyDirectPartners] = useState<boolean>(false);
    const [participants, setParticipants] = useState<any[]>([]);

    useEffect(() => {
        if(!props.participants) return;
        setParticipants(props.participants);
    }, [props.participants]);


    return(
        <>
            <div style={{
                display: "flex",
                flexDirection: "column",
                paddingBottom: "5px"
            }}>
                <div
                    style={{
                        background: "#e0e7f2",
                        height: '70px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: '5px',
                        paddingLeft: '5px'
                    }}
                >
                    <Typography style={{
                        fontWeight: 'bold',
                        color: 'darkblue'
                    }} variant="body2">
                        Selected Participants
                    </Typography>
                </div>
                {
                   participants && participants.length === 0 &&
                    <Typography style={{
                        paddingTop: '10px'
                    }} variant="body2">
                        No Participants Selected
                    </Typography>
                }
                {
                    participants && participants.length > 0 &&
                    participants.map((participant: any) => (
                        <BiomoleculeCard
                            biomolecule={participant}
                            onBiomoleculeRemove={onBiomoleculeRemove}
                            cardType="selected"
                        >
                        </BiomoleculeCard>
                    ))
                }
                {
                    participants.length > 0 &&
                    <>
                        <div>
                            Exclude partner interactions <Checkbox
                            value={onlyDirectPartners} onClick={() => setOnlyDirectPartners(!onlyDirectPartners)}/>
                        </div>
                        <div style={{
                            justifyContent: 'right',
                            textAlign: 'right'
                        }}>
                            {
                                participants.length > 0 &&
                                <Tooltip title="Clear" arrow>
                                    <IconButton style={{color: 'red'}} aria-label="Clear">
                                        <ClearIcon onClick={onClear}/>
                                    </IconButton>
                                </Tooltip>
                            }
                            {
                                participants.length > 0 &&
                                <Tooltip title="Generate Network" arrow>
                                    <IconButton style={{color: 'green'}} aria-label="Generate">
                                        <PlayCircle onClick={() => onGenerate(onlyDirectPartners)}/>
                                    </IconButton>
                                </Tooltip>
                            }
                        </div>
                    </>
                }
            </div>
        </>
    )
}

export default NetworkParticipantBoard;