import {Card, CardContent, IconButton, Tooltip, Typography} from "@mui/material";
import SpeciesIcon from "../icons/SpeciesIcon";
import LogoIcon from "../icons/LogoIcon";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import React from "react";
import DoneIcon from '@mui/icons-material/Done';
import speciesMapping from "../../../commons/constants";

const getSpeciesNCBI = (biomolecule: any) => {
    return speciesMapping[biomolecule.species];
}

const ResultBiomoleculeCard: React.FC<any> = (props: any) => {

    const {biomolecule, cardType, selected} = props;

    const onBiomoleculeAdd = () => {
        props.onBiomoleculeAdd(biomolecule);
    }

    return(
        <Card variant="outlined"
              style={{ marginBottom: '8px' }}
        >
            <CardContent
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '500px'
                }}
            >
                <div style={{
                    display: "flex",
                    flexDirection: "column"
                }}>
                    <div style={{
                        display: "flex"
                    }}>
                        <div style={{
                            paddingLeft: '5px'
                        }}>
                            <SpeciesIcon
                                speciesId={getSpeciesNCBI(biomolecule)}
                                width="20"
                                height="20"
                            />
                        </div>
                        <div style={{
                            width: '400px'
                        }}>
                            <Typography
                                variant="body1"
                                style={{
                                    marginRight: '16px',
                                    marginLeft: '8px'
                                }}
                            >
                                {biomolecule.recommended_name ?  biomolecule.recommended_name : biomolecule.name }
                            </Typography>
                        </div>
                        {
                            cardType === 'normal' && biomolecule.biomolcule_type !== 'protein' &&
                            <>
                                <LogoIcon
                                    logoName={'matrixdb'}
                                    width={'15'}
                                    height={'15'}
                                />
                                <Typography
                                    style={{
                                        paddingLeft: '5px',
                                        paddingRight: '5px',
                                        fontSize: '12px'
                                    }}
                                    variant="body2"
                                >
                                    {biomolecule.biomolecule_id}
                                </Typography>
                            </>
                        }
                        {
                            cardType === 'normal' && biomolecule.biomolecule_type === 'protein' &&
                            <>
                                <LogoIcon
                                    logoName={'uniprot'}
                                    width={'15'}
                                    height={'15'}
                                />
                                <Typography
                                    style={{
                                        paddingLeft: '5px',
                                        paddingRight: '5px',
                                        fontSize: '12px'
                                    }}
                                    variant="body2"
                                >
                                    {biomolecule.biomolecule_id}
                                </Typography>
                            </>
                        }
                        {
                            cardType === 'normal' && biomolecule.chebi &&
                            <>
                                <LogoIcon
                                    logoName={'chebi'}
                                    width={'15'}
                                    height={'15'}
                                />
                                <Typography
                                    style={{
                                        paddingLeft: '5px',
                                        paddingRight: '5px',
                                        fontSize: '12px'
                                    }}
                                    variant="body2"
                                >
                                    {biomolecule.chebi}
                                </Typography>
                            </>
                        }
                        {
                            cardType === 'normal' && biomolecule.complex_portal &&
                            <>
                                <LogoIcon logoName={'complex-portal'} width={'15'} height={'15'}/>
                                <Typography
                                    style={{
                                        paddingLeft: '5px',
                                        paddingRight: '5px',
                                        fontSize: '12px'
                                    }}
                                    variant="body2"
                                >
                                    {biomolecule.complex_portal}
                                </Typography>
                            </>
                        }
                    </div>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}>
                        {
                            cardType === 'normal' &&
                            <>
                                <div style={{display: "flex"}}>
                                    {
                                        biomolecule.gene &&
                                        <Typography
                                            style={{
                                                paddingLeft: '5px',
                                                paddingRight: '5px',
                                                fontSize: '12px'
                                            }}
                                            variant="body2"
                                        >
                                            Gene: {biomolecule.gene}
                                        </Typography>
                                    }
                                </div>
                                {
                                    !selected &&
                                    <div style={{display: "flex"}}>
                                        <Tooltip title="Add to biomolecules">
                                            <IconButton
                                                onClick={props.onBiomoleculeAdd}
                                                size="small"
                                                style={{color: 'green'}}
                                                aria-label="Add"
                                            >
                                                <AddCircleIcon/>
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                }
                            </>
                        }
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default ResultBiomoleculeCard;