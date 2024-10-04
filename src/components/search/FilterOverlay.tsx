// OverlayPanel.tsx

import React, {useState} from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import BiomoleculeFilter from "../networks/biomolecule-filter/BiomoleculeFilter";
import {IconButton} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCancel, faFilter} from "@fortawesome/free-solid-svg-icons";

interface OverlayPanelProps {
    searchQuery: string,
    biomolecules: any[],
    anchorEl: HTMLElement | null;
    open: boolean;
    handleClose: () => void;
    onFilterSelection: (filterCriteria: any) => void;
    onFilterClear: () => void;
}

const FilterOverlay: React.FC<OverlayPanelProps> = ({
                                                   searchQuery,
                                                   biomolecules,
                                                   anchorEl,
                                                   open,
                                                   handleClose,
                                                   onFilterSelection,
                                                   onFilterClear
                                                   }) => {

    const [filterCriteria, setFilterCriteria] = useState<any| null>(null);

    const onFilterCriteriaChange = (filterCriteria: any) => {
        setFilterCriteria(filterCriteria);
    }

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
        >
            <Box
                sx={{
                    padding: 2,
                    bgcolor: "background.paper",
                    boxShadow: 0,
                    minWidth: 400,
                    maxWidth: 1000,
                    overflowY: 'auto'
                }}
            >
                <BiomoleculeFilter
                    searchQuery={searchQuery}
                    biomolecules={biomolecules}
                    onFilterSelection={onFilterCriteriaChange}
                />
            </Box>
            <div style={{
                paddingTop: '20px',
                paddingBottom: '10px',
                paddingLeft: '5px'
            }}>
                <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    style={{
                        marginRight: '10px',
                        marginLeft: '5px'
                    }}
                    onClick={()=>onFilterClear()}
                >
                    <IconButton>
                        <FontAwesomeIcon
                            icon={faCancel}
                            size={"2xs"}
                            color={'red'}
                        />
                    </IconButton>
                    Clear
                </Button>
                <Button
                    variant="outlined"
                    size="small"
                    color="success"
                    onClick={()=>onFilterSelection(filterCriteria)}
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
        </Popover>
    );
};

export default FilterOverlay;
