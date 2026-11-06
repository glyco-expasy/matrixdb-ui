import {Box, CircularProgress, Grid, Paper, Tab, Table, TableCell, TableRow, Tabs, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import http from "../../commons/http-commons";
import logo from "../../assets/images/matrixdb_logo_medium.png";

interface AssociationsStatistics {
    associations : {
        protein : {
            protein: number,
            multimer: number,
            pfrag: number,
            gag: number
        },
        multimer: {
            multimer: number,
            pfrag: number,
            gag: number
        },
        pfrag: {
            pfrag: number,
            gag: number
        },
        gag :{
            gag : number
        }
    }
}

interface BiomoleculeStatistics {
    biomolecules : {
        protein : number,
        multimer: number,
        pfrag: number,
        gag: number,
        other: number
    }
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const StatisticsComponent = () => {

    const [associationStatistics, setAssociationStatistics] = useState<AssociationsStatistics>({
        associations: {
            protein : {
                protein: 0,
                multimer: 0,
                pfrag: 0,
                gag: 0
            },
            multimer: {
                multimer: 0,
                pfrag: 0,
                gag: 0
            },
            pfrag: {
                pfrag: 0,
                gag: 0
            },
            gag :{
                gag : 0
            }
        }
    });

    const [biomoleculeStatistics, setBiomoleculeStatistics] = useState<BiomoleculeStatistics>({
        biomolecules : {
            protein : 0,
            multimer: 0,
            pfrag: 0,
            gag: 0,
            other: 0
        }
    });

    const [statsLoaded, setStatsLoaded] = useState(false);

    /* useEffect(() => {
        http.get("/statistics/associations")
            .then((statisticsResponse) => {
                
                setAssociationStatistics({
                    associations : statisticsResponse.data.associations
                });
                setStatsLoaded(true);
            });
    }, []); */

    useEffect(() => {
        http.get("/statistics/biomolecules")
            .then((statisticsResponse) => {
                
                setBiomoleculeStatistics({
                    biomolecules : statisticsResponse.data.biomolecules
                });
                setStatsLoaded(true);
            });
    }, []);

    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const paperStyle = {
        background: 'var(--mdb-surface)',
        boxShadow: 'var(--mdb-shadow)',
        padding: '16px',
        width: '60%'
    };

    const TabPanel = (props: TabPanelProps) => {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ p: 3 }}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }

    return(
        <>
            <div className={"App-header"}>
                <div>
                    <img src={logo} className={"App-logo"}/>
                </div>
                <div>
                    <h4>The extracellular matrix interaction database</h4>
                </div>
            </div>

            <Grid container style={{ paddingTop : '10px' }} justifyContent="center">
                <Grid item xs={12}>
                    <h5>Statistics</h5>
                </Grid>
                <Grid container justifyContent="center">
                    <Paper style={paperStyle}>
                        <Tabs value={value} onChange={handleChange}>
                            <Tab label="Interactions" style={{ flexGrow: 1, fontSize: '12px' }} />
                            <Tab label="Biomolecules" style={{ flexGrow: 1 , fontSize: '12px'}} />
                            <Tab label="Experiments" style={{ flexGrow: 1 , fontSize: '12px'}} />
                        </Tabs>
                        {
                            !statsLoaded && <div style={{paddingTop: '10px'}}>
                                <CircularProgress />
                            </div>
                        }

                        { statsLoaded && associationStatistics && associationStatistics.associations && <TabPanel index={0} value={value}>
                            <Grid container alignItems='center' xs={6}>
                                <Table>
                                    <TableRow>
                                        <TableCell>
                                            <h5>Association</h5>
                                        </TableCell>
                                        <TableCell>
                                            <h5>Protein</h5>
                                        </TableCell>
                                        <TableCell>
                                            <h5>Multimer</h5>
                                        </TableCell>
                                        <TableCell>
                                            <h5>Pfrag</h5>
                                        </TableCell>
                                        <TableCell>
                                            <h5>GAG</h5>
                                        </TableCell>
                                        <TableCell>
                                            <h5>Other</h5>
                                        </TableCell>
                                        <TableCell>
                                            <h5>Total</h5>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <h5>Protein</h5>
                                        </TableCell>
                                        <TableCell>
                                            {associationStatistics.associations.protein.protein}
                                        </TableCell>
                                        <TableCell>
                                            {associationStatistics.associations.protein.multimer}
                                        </TableCell>
                                        <TableCell>
                                            {associationStatistics.associations.protein.pfrag}
                                        </TableCell>
                                        <TableCell>
                                            {associationStatistics.associations.protein.gag}
                                        </TableCell>
                                        <TableCell>
                                            -
                                        </TableCell>
                                        <TableCell>
                                            {associationStatistics.associations.protein.protein + associationStatistics.associations.protein.multimer + associationStatistics.associations.protein.pfrag + associationStatistics.associations.protein.gag}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <h5>Multimer</h5>
                                        </TableCell>
                                        <TableCell>
                                            {associationStatistics.associations.protein.multimer}
                                        </TableCell>
                                        <TableCell>
                                            {associationStatistics.associations.multimer.multimer}
                                        </TableCell>
                                        <TableCell>
                                            {associationStatistics.associations.multimer.pfrag}
                                        </TableCell>
                                        <TableCell>
                                            {associationStatistics.associations.multimer.gag}
                                        </TableCell>
                                        <TableCell>
                                            -
                                        </TableCell>
                                        <TableCell>
                                            {associationStatistics.associations.protein.multimer + associationStatistics.associations.multimer.multimer + associationStatistics.associations.multimer.pfrag + associationStatistics.associations.multimer.gag}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <h5>Pfrag</h5>
                                        </TableCell>
                                        <TableCell>
                                            {associationStatistics.associations.protein.pfrag}
                                        </TableCell>
                                        <TableCell>
                                            {associationStatistics.associations.multimer.pfrag}
                                        </TableCell>
                                        <TableCell>
                                            {associationStatistics.associations.pfrag.pfrag}
                                        </TableCell>
                                        <TableCell>
                                            {associationStatistics.associations.pfrag.gag}
                                        </TableCell>
                                        <TableCell>
                                            -
                                        </TableCell>
                                        <TableCell>
                                            {associationStatistics.associations.protein.pfrag + associationStatistics.associations.multimer.pfrag + associationStatistics.associations.pfrag.gag}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <h5>GAG</h5>
                                        </TableCell>
                                        <TableCell>
                                            {associationStatistics.associations.protein.gag}
                                        </TableCell>
                                        <TableCell>
                                            {associationStatistics.associations.multimer.gag}
                                        </TableCell>
                                        <TableCell>
                                            {associationStatistics.associations.pfrag.gag}
                                        </TableCell>
                                        <TableCell>
                                            {associationStatistics.associations.gag.gag}
                                        </TableCell>
                                        <TableCell>
                                            -
                                        </TableCell>
                                        <TableCell>
                                            {associationStatistics.associations.protein.gag + associationStatistics.associations.multimer.gag + associationStatistics.associations.pfrag.gag + associationStatistics.associations.gag.gag }
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <h5>Other</h5>
                                        </TableCell>
                                        <TableCell>
                                            -
                                        </TableCell>
                                        <TableCell>
                                            -
                                        </TableCell>
                                        <TableCell>
                                            -
                                        </TableCell>
                                        <TableCell>
                                            -
                                        </TableCell>
                                        <TableCell>
                                            -
                                        </TableCell>
                                        <TableCell>
                                            -
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <h5>Total</h5>
                                        </TableCell>
                                        <TableCell>
                                            {associationStatistics.associations.protein.protein + associationStatistics.associations.protein.multimer + associationStatistics.associations.protein.pfrag + associationStatistics.associations.protein.gag}
                                        </TableCell>
                                        <TableCell>
                                            {associationStatistics.associations.protein.multimer  + associationStatistics.associations.multimer.multimer  + associationStatistics.associations.multimer.pfrag + associationStatistics.associations.multimer.gag}
                                        </TableCell>
                                        <TableCell>
                                            {associationStatistics.associations.protein.pfrag + associationStatistics.associations.multimer.pfrag + associationStatistics.associations.pfrag.gag}
                                        </TableCell>
                                        <TableCell>
                                            {associationStatistics.associations.protein.gag + associationStatistics.associations.multimer.gag + associationStatistics.associations.pfrag.gag + associationStatistics.associations.gag.gag }
                                        </TableCell>
                                        <TableCell>
                                            -
                                        </TableCell>
                                        <TableCell>
                                            {associationStatistics.associations.protein.protein + associationStatistics.associations.protein.multimer + associationStatistics.associations.protein.pfrag + associationStatistics.associations.protein.gag
                                            + associationStatistics.associations.protein.multimer + associationStatistics.associations.multimer.multimer + associationStatistics.associations.multimer.pfrag + associationStatistics.associations.multimer.gag
                                            + associationStatistics.associations.protein.pfrag + associationStatistics.associations.multimer.pfrag + associationStatistics.associations.pfrag.gag
                                            + associationStatistics.associations.protein.gag + associationStatistics.associations.multimer.gag + associationStatistics.associations.pfrag.gag + associationStatistics.associations.gag.gag
                                            }
                                        </TableCell>
                                    </TableRow>
                                </Table>
                            </Grid>
                        </TabPanel>}

                        <TabPanel index={1} value={value}>
                            <table>
                                <thead>
                                <tr>
                                    <th>biomol</th>
                                    <th>count</th>
                                </tr>
                                </thead>
                                <tbody>
                                {Object.entries(biomoleculeStatistics.biomolecules).map(([key, value]) => (
                                    <tr key={key}>
                                        <td>{key}</td>
                                        <td>{value}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </TabPanel>
                        <TabPanel index={2} value={value}>
                            exps
                        </TabPanel>
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
}

export default StatisticsComponent;