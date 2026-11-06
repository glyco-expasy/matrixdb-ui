import React from "react";
import {Autocomplete, Button, Chip, Divider, Paper, Slider, TextField, Typography} from "@mui/material";
import {FilterCriterionConfiguration, FilterOptionType} from "./FilterConfigurationManager";
import {FilterCriterion} from "./FilterManager";

export const ReadOnlyFilterCriterionComponent: React.FC<any> = ({
                                                             filterType,
                                                             criterion,
                                                        }) => {
    const {label, value} = criterion;

    return(
        <Paper
            square
            style={{
                padding: '10px',
                background: 'var(--mdb-surface)',
                boxShadow: 'var(--mdb-shadow)'
            }}>
            <div>
                <Typography variant="body2" style={{ fontWeight: 'bold' }}>
                    {label}
                </Typography>
            </div>
            <Divider style={{ width: '40%', backgroundColor: 'black', margin: '1px 0' }} />
            <div style={{
                paddingTop: '10px'
            }}>
                <Typography variant="body1">
                    <Chip label={value} color="primary" />
                </Typography>
            </div>
        </Paper>
    )

}

export const EditingFilterCriterionComponent: React.FC<any> = ({
                                                            filterType,
                                                            criterion,
                                                            onValueChanged
                                                        }) => {
    const {id, label, options} = criterion;

    return(
        <Paper
            square
            style={{
                padding: '10px',
                margin: '5px',
                background: 'var(--mdb-surface)',
                boxShadow: 'var(--mdb-shadow)',
                height: 'auto'
            }}>
            <div>
                <Typography variant="body2" style={{ fontWeight: 'bold' }}>
                    {label}
                </Typography>
            </div>
            <Divider style={{ width: '40%', backgroundColor: 'black', margin: '1px 0' }} />
            <div style={{
                paddingTop: '10px'
            }}>
                {
                    options && options.length > 0 &&
                    <Autocomplete
                        size={"small"}
                        id={id}
                        options={options}
                        style={{width: '200px', height: '30px'}}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                            />
                        )}
                        onChange={(event: React.ChangeEvent<{}>, newValue: string | null) => onValueChanged(filterType, {
                            id: id,
                            value: newValue
                        })}
                    />
                }
            </div>
        </Paper>
    )
}

export const FilterWithSubCriteriaComponent: React.FC<FilterCriterionProps> = ({
                                                    filterType,
                                                    criterion,
                                                    onAdd,
                                                    onRemove
                                                })  => {
    const { label, subCriteria, value} = criterion;
    const filterCriterionId = criterion.id;

    if(value) {
        return(
            <ReadOnlyFilterCriterionComponent
                criterion={criterion}
            />
        )
    } else {
        return(
            <>
                <div style={{
                    display: 'flex',
                    marginRight: '10px',
                    marginTop: '10px',
                    marginBottom: '10px'
                }}>
                    <Typography
                        variant='caption'
                        fontWeight='bold'
                    >
                        {label}
                    </Typography>
                </div>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    {
                        subCriteria && subCriteria.map((filterCriterionConfiguration: FilterCriterionConfiguration) => {
                            const { id, label, options} = filterCriterionConfiguration;
                            const subCriteriaValue = filterCriterionConfiguration.value;
                            return(
                                <div style={{
                                    display: 'flex',
                                    paddingTop: '5px',
                                    height: '45px'
                                }}>
                                    <div style={{ width: '40%', marginRight: '10px' }}>
                                        <Typography variant="caption">{label}</Typography>
                                    </div>
                                    {
                                        value && (
                                            <div style={{ width: '60%' }}>
                                                {value}
                                            </div>
                                        )
                                    }
                                    {
                                        options && options.range && options.range.length > 0 && options.type === FilterOptionType.list && (
                                            <Autocomplete
                                                size="small"
                                                id={id}
                                                options={options.range}
                                                value={subCriteriaValue}
                                                style={{ width: '200px', height: '30px' }}
                                                renderInput={(params) => (
                                                    <TextField {...params} variant="outlined" />
                                                )}
                                                onChange={(event, newValue) => {
                                                    if(newValue) {
                                                        onAdd(filterType, { id: filterCriterionId, subCriteria: { id: id,  value: newValue }})
                                                    } else {
                                                        onRemove(filterType, { id: filterCriterionId, subCriteria: { id: id}});
                                                    }
                                                }}
                                            />
                                        )
                                    }
                                    {
                                        options && options.range && options.range.length > 0 && options.type === FilterOptionType.numeric && (
                                            <div style={{ width: '40%' }}>
                                                <Slider
                                                    track={'inverted'}
                                                    min={Math.min(...options.range)}
                                                    max={Math.max(...options.range)}
                                                    value={subCriteriaValue}
                                                    step={100}
                                                    valueLabelDisplay='auto'
                                                    onChange={(event, newValue) => {
                                                        if(newValue) {
                                                            onAdd(filterType, { id: filterCriterionId, subCriteria: { id: id,  value: newValue }})
                                                        } else {
                                                            onRemove(filterType, { id: filterCriterionId, subCriteria: { id: id}});
                                                        }
                                                    }}
                                                />
                                            </div>
                                        )
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            </>
        );
    }
}


interface FilterCriterionProps {
    filterType: string,
    criterion: FilterCriterionConfiguration,
    onAdd: (filterType: string, filterCriterion: FilterCriterion) => void;
    onRemove: (filterType: string, filterCriterion: FilterCriterion) => void;
}
const FilterCriterionComponent: React.FC<FilterCriterionProps> = ({
                                                filterType,
                                                criterion,
                                                onAdd,
                                                onRemove
                                            }) => {

    const {id, label, options, value} = criterion;

    return(
        <div style={{
            display: 'flex',
            height: '50px'
        }}>
            <div style={{ width: '40%', marginRight: '10px' }}>
                <Typography
                    variant='caption'
                    fontWeight='bold'
                >
                    {label}
                </Typography>
            </div>
            {
                options && options.range && options.range.length > 0 && options.type === FilterOptionType.list && (
                    <Autocomplete
                        size="small"
                        id={id}
                        options={options.range}
                        value={value}
                        style={{ width: '200px', height: '30px' }}
                        renderInput={(params) => (
                            <TextField {...params} variant="outlined" />
                        )}
                        onChange={(event, newValue) => {
                            if(newValue) {
                                onAdd(filterType, { id: id, value: newValue });
                            } else {
                                onRemove(filterType, { id: id });
                            }
                        }}
                    />
                )
            }
            {
                options && options.range && options.range.length > 0 && options.type === FilterOptionType.numeric && (
                    <div style={{ width: '40%' }}>
                        <Slider
                            track={'inverted'}
                            min={Math.min(...options.range)}
                            max={Math.max(...options.range)}
                            value={value}
                            step={0.1}
                            valueLabelDisplay='auto'
                            onChange={(event, newValue) => {
                                if(newValue) {
                                    onAdd(filterType, { id: id, value: newValue });
                                } else {
                                    onRemove(filterType, { id: id});
                                }
                            }}
                        />
                    </div>
                )
            }
        </div>
    );
}

export default FilterCriterionComponent;