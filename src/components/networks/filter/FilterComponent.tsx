import React, {useEffect, useState} from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {AppDispatch, RootState} from '../../../stateManagement/store';
import * as actions from '../../../stateManagement/actions';
import {Accordion, AccordionDetails, AccordionSummary, Button, IconButton, Paper, Typography} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAtom, faCircleNodes, faFilter, faCancel} from "@fortawesome/free-solid-svg-icons";
import {
    FilterConfiguration,
    FilterConfigurationManager,
    FilterCriterionConfiguration
} from "./FilterConfigurationManager";
import FilterManager, {Filter, FilterCriterion} from "./FilterManager";
import FilterCriterionComponent, {FilterWithSubCriteriaComponent} from "./FilterCriterionComponent";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const mapStateToProps = (state: RootState) => ({
    currentState: state.currentState,
    filterConfiguration: state.filterConfiguration,
    filters: state.filters,
    network: state.network
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    updateFilterAction: (filters: Filter) => dispatch(actions.updateFilter(filters))
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type NewFilterComponentProps = ConnectedProps<typeof connector>;
const NewFilterComponent: React.FC<NewFilterComponentProps> = ({
                                                            currentState,
                                                            filterConfiguration,
                                                            filters,
                                                            network,
                                                            updateFilterAction,
                                                      }) => {

    const [currentFilters, setCurrentFilters] = useState<Filter>(filters);
    const [filterViewConfiguration, setFilterViewConfiguration]  = useState<FilterConfiguration>(filterConfiguration);

    const filterConfigurationManger = new FilterConfigurationManager(network);

    useEffect(() => {
        let currentFilterConfiguration = filterConfigurationManger.getFilterConfiguration(currentFilters);
        setFilterViewConfiguration(currentFilterConfiguration);
    }, [currentFilters]);

    const onFilterCriterionAdd = (newFilterType: string, newFilterCriterion: FilterCriterion) => {
        let newFilters:Filter = JSON.parse(JSON.stringify(currentFilters));

        // Add criterion to the filters
        if(newFilterType === 'interactor' && newFilters.interactors.length === 0) {
            newFilters.interactors.push(newFilterCriterion);
        }

        if(newFilterType === 'interaction' && newFilters.interactions.length === 0) {
            newFilters.interactions.push(newFilterCriterion);
        }

        let existingCriterion: FilterCriterion | undefined = undefined;
        if(newFilterType === 'interactor') {
            newFilters.interactors.forEach((filterCriterion: FilterCriterion) => {
                if(newFilterCriterion.id === filterCriterion.id) {

                    if(newFilterCriterion.value) {
                        filterCriterion.value = newFilterCriterion.value;
                        existingCriterion = filterCriterion;
                    }

                    if(newFilterCriterion.subCriteria) {
                        if(filterCriterion.subCriteria?.id === newFilterCriterion.subCriteria.id) {
                            filterCriterion.subCriteria.value = newFilterCriterion.subCriteria.value;
                            existingCriterion = filterCriterion;
                        }
                    }
                }
            });

            // Add the filter if not existing
            if(existingCriterion) {
                if(newFilterCriterion.subCriteria) {
                    if(!newFilterCriterion.subCriteria.value) {
                        // Remove sub criterion
                        newFilters.interactors = newFilters.interactors.filter((filterCriterion: FilterCriterion) => {
                            if(filterCriterion.id === newFilterCriterion.id) {
                                return newFilterCriterion.subCriteria?.id === existingCriterion?.id;
                            }
                        });
                    }
                } else if(!newFilterCriterion.value) {
                    // Remove criterion
                    newFilters.interactors = newFilters.interactors.filter((filterCriterion: FilterCriterion) => filterCriterion !== existingCriterion);
                }
            } else {
                newFilters.interactors.push(newFilterCriterion);
            }
        }

        if(newFilterType === 'interaction') {
            newFilters.interactions.forEach((filterCriterion: FilterCriterion) => {
                if(newFilterCriterion.id === filterCriterion.id) {
                    if(newFilterCriterion.value) {
                        filterCriterion.value = newFilterCriterion.value;
                    }
                    existingCriterion = filterCriterion;
                }
            });

            // Add the filter if not existing
            if(existingCriterion) {
                if(!newFilterCriterion.value) {
                    // Remove criterion
                    newFilters.interactions = newFilters.interactions.filter((filterCriterion: FilterCriterion) => filterCriterion !== existingCriterion);
                }
            } else {
                newFilters.interactions.push(newFilterCriterion);
            }
        }
        setCurrentFilters(newFilters);
        //updateFilterAction(newFilters);
    }

    const onFilterCriterionClear = (filterType: string, filterCriteria: FilterCriterion)  => {
        // Should remove from current filters
        let newFilters = JSON.parse(JSON.stringify(currentFilters));
        if(filterType === 'interactor') {
            let newInteractorCriteria = newFilters.interactors.filter((filter: any) => filter.id !== filterCriteria.id);
            newFilters.interactors = newInteractorCriteria;
        } else {
            let newInteractionCriteria = newFilters.interactions.filter((filter: any) => filter.id !== filterCriteria.id);
            newFilters.interactions = newInteractionCriteria;
        }
        setCurrentFilters(newFilters);
    }

    const onFilterCancel = () => {
        updateFilterAction({interactors: [], interactions: []});
    }

    const onFilterApply = () => {
        updateFilterAction(currentFilters);
    }

    return (
            <Paper
                square
                style={{
                    padding: '10px',
                    background: 'var(--mdb-surface)',
                    boxShadow: 'var(--mdb-shadow)'
                }}>
                {
                    <>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingBottom: '10px'
                        }}>
                            <Typography variant='body1' fontWeight='bold'>
                                Filter Participant Interactions
                            </Typography>
                        </div>
                        <div>
                            {
                                <>
                                    <Accordion key={0} defaultExpanded>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            <Typography variant='body2' fontWeight='bold'>
                                                <FontAwesomeIcon icon={faAtom} size='2xs'/>
                                                <span style={{
                                                    paddingLeft: '5px'
                                                }}>
                                                    Participant
                                                </span>
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {
                                                filterViewConfiguration['interactor']?.map((filterCriterionConfiguration: FilterCriterionConfiguration) => {
                                                    if(!filterCriterionConfiguration.enable) return (<></>);
                                                    if(filterCriterionConfiguration.subCriteria) {
                                                        return(
                                                            <FilterWithSubCriteriaComponent
                                                                filterType='interactor'
                                                                criterion={filterCriterionConfiguration}
                                                                onAdd={onFilterCriterionAdd}
                                                                onRemove={onFilterCriterionClear}
                                                            />
                                                        );
                                                    } else {
                                                        return(
                                                            <FilterCriterionComponent
                                                                filterType='interactor'
                                                                criterion={filterCriterionConfiguration}
                                                                onAdd={onFilterCriterionAdd}
                                                                onRemove={onFilterCriterionClear}
                                                            />
                                                        );
                                                    }
                                                })
                                            }
                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion key={1} defaultExpanded>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            <Typography variant='body2' fontWeight='bold'>
                                                <FontAwesomeIcon icon={faCircleNodes} size='2xs'/>
                                                <span style={{
                                                    paddingLeft: '5px'
                                                }}>
                                                    Interaction
                                                </span>
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {
                                                filterViewConfiguration['interaction']?.map((filterCriterionConfiguration: FilterCriterionConfiguration) => {
                                                    if(!filterCriterionConfiguration.enable) return (<></>);
                                                    if(filterCriterionConfiguration.subCriteria) {
                                                        filterCriterionConfiguration.subCriteria.map((filterCriterionConfiguration: FilterCriterionConfiguration) => {
                                                            return(
                                                                <FilterCriterionComponent
                                                                    filterType='interaction'
                                                                    criterion={filterCriterionConfiguration}
                                                                    onAdd={onFilterCriterionAdd}
                                                                    onRemove={onFilterCriterionClear}
                                                                />
                                                            )
                                                        })
                                                    } else {
                                                        return(
                                                            <FilterCriterionComponent
                                                                filterType='interaction'
                                                                criterion={filterCriterionConfiguration}
                                                                onAdd={onFilterCriterionAdd}
                                                                onRemove={onFilterCriterionClear}
                                                            />
                                                        )
                                                    }
                                                })
                                            }
                                        </AccordionDetails>
                                    </Accordion>
                                </>
                            }
                            {
                                (
                                    <div style={{
                                        paddingTop: '20px'
                                    }}>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        color="error"
                                        style={{
                                            marginRight: '10px',
                                            marginLeft: '5px'
                                        }}
                                        onClick={onFilterCancel}
                                    >
                                        <IconButton>
                                            <FontAwesomeIcon
                                                icon={faCancel}
                                                size={"2xs"}
                                                color={'red'}
                                            />
                                        </IconButton>
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        color="success"
                                        onClick={onFilterApply}
                                    >
                                        <IconButton>
                                            <FontAwesomeIcon
                                                icon={faFilter}
                                                size={"2xs"}
                                                color={'green'}
                                            />
                                        </IconButton>
                                        Apply
                                    </Button>
                                </div>
                                )
                            }
                        </div>
                    </>
                }
            </Paper>
    );
};

export default connector(NewFilterComponent);
