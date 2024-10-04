import React, {useEffect, useState} from 'react';
import {RootState} from "../../stateManagement/store";
import {connect, ConnectedProps} from "react-redux";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {Tooltip, Typography} from "@mui/material";
import {CSVLink} from "react-csv";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFileDownload} from "@fortawesome/free-solid-svg-icons";

const mapStateToProps = (state: RootState) => ({
    network: state.network,
    filters: state.filters
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type AssociationListProps = PropsFromRedux & {biomoleculeIds: [string] | []};
const AssociationListComponent : React.FC<AssociationListProps> = ({
                                                                       network,
                                                                       filters,
                                                                       biomoleculeIds
                                                                    }) => {
    const [columns, setColumns] = useState<any>(null);
    const [rows, setRows] = useState<any>(null);
    const [interactionsToDownload, setInteractionsToDownload] = useState<any[] | []>([]);

    useEffect(() => {
        // name id mapping for partners
        if(!network) return;

        let interactor_name_mapping : { [key: number]: string} = {};
        network.interactors.forEach((interactor: any) => {
            let interactorId = network.context.interactors.interactor_mapping[interactor.id];
            interactor_name_mapping[interactor.id] = interactor.name;
        });

        let participants: {[key: string]: any} = {};
        let interactionsToDownload : any[] = [];
        network.interactions.forEach((interaction: any) => {
            let rowData : {[key: string]: any};
            let partner = interaction.participants
                .filter((biomolecule: string) => {
                    return !network.biomolecules.includes(biomolecule);
                })[0];

            if(!partner) {
                partner = 1;
            } else {
                if(biomoleculeIds[0] && network.context.interactors.interactor_mapping[partner].includes(biomoleculeIds[0])) {
                    partner = 1;
                }
            }

            if(participants[partner]) {
                rowData = participants[partner];
            } else {
                rowData = {}
            }

            rowData.id = partner;
            if(!rowData.interactions) rowData.interactions = [];
            rowData.interactions.push(interaction.id);

            let spokeExpandedFrom : string[] = [];
            let directlySupported : string[] = [];
            if(interaction.experiments && interaction.experiments.direct && interaction.experiments.direct.binary) {
                directlySupported = interaction.experiments.direct.binary.map(
                    (experimentId: number) => network.context.experiment_mapping[experimentId]
                );
            }

            if(interaction.experiments && interaction.experiments.direct && interaction.experiments.direct.spoke_expanded_from) {
                spokeExpandedFrom = interaction.experiments.direct.spoke_expanded_from.map(
                    (experimentId: number) => network.context.experiment_mapping[experimentId]
                );
            }

            if(!rowData.score) rowData.score = [];
            rowData.score.push(interaction.score);

            if(!rowData.type) rowData.type = [];
            rowData.type.push(interaction.type === 1 ? "Experimental" : "Predicted")

            if(!rowData.directlySupportedBy) rowData.directlySupportedBy = [];
            rowData.directlySupportedBy.push(...directlySupported);

            if(!rowData.spokeExpandedFrom) rowData.spokeExpandedFrom = [];
            rowData.spokeExpandedFrom.push(...spokeExpandedFrom);

            participants[partner] = rowData;

            let particpantId = null;
            let p1 = interaction.participants[0];
            if(p1 !== 1) {
                particpantId = p1;
            }
            if(interaction.participants.length > 1) {
                let p2 = interaction.participants[1];
                if(p2 !== 1) {
                    particpantId = p2;
                }
            }
            interactionsToDownload.push({
                participant: network.context.interactors.interactor_mapping[particpantId],
                participantName: interactor_name_mapping[particpantId],
                id: interaction.id,
                score: interaction.score,
                type: interaction.type === 1 ? 'Experimental' : 'Predicted'
            });
        });
        setInteractionsToDownload(interactionsToDownload);

        let rows = Object.keys(participants).map((participant: any) => {
            return participants[participant];
        })
        setRows(rows);
        const columns: GridColDef[] = [
            {
                field: 'id',
                headerName: 'Participant',
                width: 600,
                renderCell: (params: any) =>  (
                    <>
                        <a href={process.env.REACT_APP_PUBLIC_URL+"biomolecule/"+network.context.interactors.interactor_mapping[params.value]}>
                            {interactor_name_mapping[params.value]}</a>
                    </>)
            },
            {
                field: 'interactions',
                headerName: 'Interactions',
                width: 350,
                renderCell: (params: any) =>  (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {
                                params.value.map((assoc: string) => (
                                    <div style={{ display: 'flex' }}>
                                        <a
                                            key={assoc}
                                            href={`${process.env.REACT_APP_PUBLIC_URL}association/${assoc}`}
                                        >
                                            {assoc}
                                        </a>
                                    </div>
                                ))
                            }
                        </div>
                )
            },
            {
                field: 'directlySupportedBy',
                headerName: 'Non-expanded',
                width: 200,
                renderCell: (params: any) =>  (
                    <>
                        {
                            params.value.length > 0 && (
                                <Tooltip
                                    title={
                                        <ul style={{ backgroundColor: '#ffffff', margin: 0, padding: 0, listStyleType: 'none' }}>
                                            {params.value?.map((ex: any) => (
                                                <li key={ex}>
                                                    <a href={process.env.REACT_APP_PUBLIC_URL + "experiment/" + ex}>
                                                        {ex}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    }
                                    placement="top"
                                    componentsProps={{
                                        tooltip: {
                                            sx: {
                                                bgcolor: "#fff",
                                                color: "#fff"
                                            }
                                        }
                                    }}
                                    PopperProps={{
                                        sx: {
                                            background: '#fff',
                                            backgroundColor: '#ffffff',
                                            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                                            maxWidth: '400px',
                                            border: '1px solid rgba(0, 0, 0, 0.1)'
                                        }
                                    }}
                                >
                                  <span className="table-cell-truncate">
                                    {params.value.length}
                                  </span>
                                </Tooltip>
                            )
                        }
                        {
                            params.value?.length === 0 && <span className="table-cell-trucate">{params.value?.length}</span>
                        }
                    </>
                ),
                sortComparator: (v1, v2) =>  v2.length - v1.length
            },
            {
                field: 'spokeExpandedFrom',
                headerName: 'Spoke Expanded',
                width: 200,
                renderCell: (params: any) =>  (
                    <>
                        {
                            params.value.length > 0 && (
                                <Tooltip
                                    title={
                                        <ul style={{ backgroundColor: '#ffffff', margin: 0, padding: 0, listStyleType: 'none' }}>
                                            {params.value?.map((ex: any) => (
                                                <li key={ex}>
                                                    <a href={process.env.REACT_APP_PUBLIC_URL + "experiment/" + ex}>
                                                        {ex}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    }
                                    placement="top"
                                    componentsProps={{
                                        tooltip: {
                                            sx: {
                                                bgcolor: "#fff",
                                                color: "#fff"
                                            }
                                        }
                                    }}
                                    PopperProps={{
                                        sx: {
                                            background: '#fff',
                                            backgroundColor: '#ffffff',
                                            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                                            maxWidth: '400px',
                                            border: '1px solid rgba(0, 0, 0, 0.1)'
                                        }
                                    }}
                                >
                                  <span className="table-cell-truncate">
                                    {params.value?.length}
                                  </span>
                                </Tooltip>
                            )
                        }
                        {
                            params.value.length === 0 && <span className="table-cell-trucate">{params.value.length}</span>
                        }
                    </>
                ),
                sortComparator: (v1, v2) =>  v2.length - v1.length
            },
            {
                field: 'score',
                headerName: 'MI Score',
                width: 100,
                renderCell: (params: any) =>  (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {
                            params.value.map((score: number) => {
                                if(score && score !== 0) {
                                    return(
                                        <div style={{ display: 'flex' }}>
                                            {score}
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>
                ),
                sortComparator: (v1, v2) =>  parseInt(v2) - parseInt(v1)
            },
            {
                field: 'type',
                headerName: 'Type',
                width: 120,
                renderCell: (params: any) =>  (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {
                            params.value.map((type: string) => (
                                <div style={{
                                    display: 'flex',
                                    color: type === 'Experimental' ? "black" : "red",
                                    fontWeight: 'bold'
                                }}>
                                    {type}
                                </div>
                            ))
                        }
                    </div>
                ),
                sortComparator: (v1, v2) =>  v2.localeCompare(v1)
            }
        ];
        setColumns(columns);
    }, []);

    /*
    const rows = network.interactions.map((interaction: any) => {
        let partner = interaction.participants
            .filter((biomolecule: string) => {
                let partnerId = network.context.interactors.interactor_mapping[biomolecule];
                return !partnerId.includes(biomoleculeIds[0]);
            })[0];
        //partner = network.context.interactors.interactor_mapping[partner];
        if(!partner) partner = biomoleculeIds[0];

        let directlySupported = [];
        if(interaction.experiments && interaction.experiments.direct && interaction.experiments.direct.binary) {
            directlySupported = interaction.experiments.direct.binary.map(
                (experimentId: number) => network.context.experiment_mapping[experimentId]
            );
        }

        let spokeExpandedFrom = [];
        if(interaction.experiments && interaction.experiments.direct && interaction.experiments.direct.spoke_expanded_from) {
            spokeExpandedFrom = interaction.experiments.direct.spoke_expanded_from.map(
                (experimentId: number) => network.context.experiment_mapping[experimentId]
            );
        }

        return {
            id: interaction.id,
            association: interaction.id,
            directlySupportedBy: directlySupported,
            spokeExpandedFrom: spokeExpandedFrom,
            score: interaction.score,
            type:  interaction.type === 1 ? "Experimental" : "Predicted"
        }
    });*/

    return(
        <>
            {
                network.interactors && network.interactors.length > 0 && columns &&
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%'
                    }}>
                        <div style={{
                            display: 'flex',
                            paddingBottom: '5px',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <CSVLink
                                data={interactionsToDownload}
                                headers={['id','participant', 'participantName', 'score', 'type']}
                                filename={`${biomoleculeIds[0]}-interactions.csv`}
                            >
                                <Typography variant={"body2"}>
                                    <FontAwesomeIcon
                                        icon={faFileDownload}
                                        style={{
                                            marginRight: '10px',
                                            fontSize: '1.5em'
                                        }}
                                        color={'darkgreen'}
                                    />Export as CSV
                                </Typography>
                            </CSVLink>
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            margin: '0 auto',
                            border: '1px solid #ccc',
                        }}>
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                initialState={{
                                    pagination: {
                                        paginationModel: {
                                            pageSize: 10,
                                        },
                                    },
                                }}
                                pageSizeOptions={[10]}
                                disableRowSelectionOnClick
                            />
                        </div>
                    </div>
                </div>
            }
        </>
    );
}

export default connector(AssociationListComponent);