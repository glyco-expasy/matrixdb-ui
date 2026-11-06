import {IconButton, InputBase, Paper} from "@mui/material";
import React, {useState} from "react";
import SearchIcon from "@mui/icons-material/Search";

function SearchBox(props: any) {

    const [searchText, setSearchText] = useState<string | null>(null);
    const [searchTextChange, setSearchTextChange] = useState<boolean>(false);

    const onPressEnter = (e: React.KeyboardEvent) =>{
        if( e.key === 'Enter' ){
            e.preventDefault();
            props.onPressEnter(e, searchText);
        }
    };

    const handleSearch = () => {
        props.onClickSearch(searchText);
    }
    const onSearchTextChange = (e : any) => {
        setSearchText(e.target.value);
        setSearchTextChange(true);
        //props.onSearchTextChange(e);
    }

    return (
        <>
            <Paper
                component="form"
                sx={{
                    p: '2px 4px',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: 'var(--mdb-radius)',
                    width: '100%'
                }}
            >
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    inputProps={{ 'aria-label': 'e.g Heparin' }}
                    onChange={onSearchTextChange}
                    onKeyDown={onPressEnter}
                    value={searchText || (!searchTextChange && props.searchQuery) || ""}
                />
                <IconButton
                    type="button"
                    sx={{ p: '10px' }}
                    aria-label="search"
                    onClick={handleSearch}
                >
                    <SearchIcon/>
                </IconButton>
            </Paper>
        </>
    );
}

export default SearchBox;