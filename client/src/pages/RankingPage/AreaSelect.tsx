import { css } from "@linaria/core";
import {
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
} from "@mui/material";
import { getCityList, getDistrictList } from "../../models/CityModel";
import { useState } from "react";
import { ThemeSheet } from "../../theme/ThemeSheet";

const wrapStyle = css`
  max-width: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: row;
  flex-grow: 1;
`;

export default function AreaSelect() {
  /**
   * City > District (시 > 구)
   */
  const [city, setCity] = useState<string | null>(null);
  const [districtList, setDistrictList] = useState<string[] | null>(null);

  const cityList = getCityList();

  const handleCityClick = (selectedCity: string) => {
    setCity(selectedCity);
    const data = getDistrictList(selectedCity);
    if (!data) return;
    setDistrictList(data);
  };

  const handleDistrictClick = (selectedDistrict: string) => {
    // clear data and show data of district
  };

  return (
    <Grid container className={wrapStyle}>
      {/* 대분류 */}
      <Grid item xs={4}>
        <List
          sx={{
            width: "100%",
            height: "100%",
            borderRight: `1px solid ${ThemeSheet.Gray[100]}`,
          }}
        >
          {cityList.map((value, index) => {
            return (
              <ListItem key={index} component="div" disablePadding>
                <ListItemButton
                  selected={value === city}
                  onClick={() => handleCityClick(value)}
                >
                  <ListItemText primary={value} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Grid>

      {/* 소분류 */}
      {districtList !== null ? (
        <Grid item xs={8}>
          <List
            sx={{
              width: "100%",
              height: "100%",
            }}
            dense={false}
          >
            {districtList.map((value, index) => {
              return (
                <ListItem
                  key={index}
                  component="div"
                  disablePadding
                  secondaryAction={123}
                >
                  <ListItemButton>
                    <ListItemText primary={value} secondary={"100점"}/>
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Grid>
      ) : (
        ""
      )}
    </Grid>
  );
}
