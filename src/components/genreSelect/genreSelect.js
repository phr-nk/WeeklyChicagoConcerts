import React, { useEffect, useState } from "react";

import Chip from "@mui/material/Chip";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import {Select} from "@material-ui/core";
import CancelIcon from "@material-ui/icons/Cancel";
import Checkbox from "@material-ui/core/Checkbox";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@material-ui/core/ListItemText";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import InputLabel from '@mui/material/InputLabel';
import _without from "lodash/without";

import { ControlPointDuplicate } from "@material-ui/icons";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function GenreSelect(props) {
    const [genres, setGenres] = useState(["all"]);
    const [genreList, setGenreList] = useState(["all"]);

    useEffect(() => {
        setGenreList(props.genresList)
        setGenres(props.genres)
        console.log(genres)
        console.log(genreList)
      }, []);

    const handleChange = (event) => {
        setGenreList((current) => [...event.target.value]);
      };
    
      const handleDelete = (e, value) => {
        e.preventDefault();
        console.log("clicked delete");
        setGenreList((current) => _without(current, value));
      };

      return(
        <FormControl style={{ minWidth: 120, maxWidth: 300 }}>
          <InputLabel id="demo-multiple-chip-label">Genres</InputLabel>
            <Select
              style={{ width: 300 }}
              multiple
              color="warning"
              
              variant="outlined"
              MenuProps={MenuProps}
              value={genreList}
              onChange={handleChange}
              input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
              IconComponent={KeyboardArrowDownIcon}
              onOpen={() => console.log("select opened")}
              renderValue={(selected) => (
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={value}
                      clickable
                      deleteIcon={
                        <CancelIcon
                          onMouseDown={(event) => event.stopPropagation()}
                        />
                      }
                      onDelete={(e) => handleDelete(e, value)}
                      onClick={() => console.log("clicked chip")}
                    />
                  ))}
                </div>
              )}
            >
              <MenuItem value={"all"}>
                <Checkbox checked={genreList.includes("all")} />
                <ListItemText primary={"all"} />
              </MenuItem>
              {Object.entries(genres).map(([k, v]) => (
                <MenuItem value={k}>
                  <Checkbox checked={genreList.includes(k)} />
                  <ListItemText primary={k} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

      )
    
}

export default GenreSelect;