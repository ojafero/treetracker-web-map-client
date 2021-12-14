import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import log from 'loglevel';
import { makeStyles } from 'models/makeStyles';
import React from 'react';

import FeaturedTreesSlider from '../components/FeaturedTreesSlider';
import LeaderBoard from '../components/LeaderBoard';
import Filter from '../components/common/Filter';
import { useMapContext } from '../mapContext';
import * as utils from '../models/utils';

// create style object for use in this component
const useStyles = makeStyles()((theme) => ({
  root: {
    padding: theme.spacing(3, 4),
    maxWidth: "100%",
    boxSizing: "border-box",
  },
  title: {
    fontFamily: 'Montserrat',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: '32px',
    lineHeight: '39px',
    /* identical to box height */
    display: 'flex',
    alignItems: 'center',
    color: '#474B4F',
  },
  title2: {
    fontFamily: 'Montserrat',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: '32px',
    lineHeight: '39px',
    display: 'flex',
    alignItems: 'center',
    color: '#474B4F',
  },
}));

export default function Top({ trees, countries }) {
  // use map context to get the map
  const mapContext = useMapContext();

  const { classes } = useStyles();

  async function handleCountryClick(countryId) {
    log.debug('handleCountryClick', countryId);
    // use utils.requestAPI to request API
    const country = await utils.requestAPI(`/countries/${countryId}`);
    // print country
    log.debug('country', country);

    const { lat, lon } = country.centroid;

    const { map } = mapContext;
    map.flyTo(lat, lon, 6);
  }

  function handleFilter(filter) {
    log.warn('handleFilter', filter);
    mapContext.map.setFilters({
      timeline: `${filter.startDate}_${filter.endDate}`,
    });
    mapContext.map.rerender();
  }

  return (
    <div className={classes.root}>
      <Box sx={{display: "flex", justifyContent: "flex-end", }}>
        <Filter onFilter={handleFilter} />
      </Box>
      <Typography variant="h2" className={classes.title}>
        Featured Trees
      </Typography>
      <Box>
        <FeaturedTreesSlider trees={trees} />
      </Box>
      <Typography variant="h2" className={classes.title2}>
        Check out the global leaders in the tree planting effort
      </Typography>
      <LeaderBoard
        countries={countries}
        handleCountryClick={handleCountryClick}
      />
    </div>
  );
}

export async function getServerSideProps() {
  const props = {};
  {
    const url = `${process.env.NEXT_PUBLIC_API_NEW}/trees/featured`;
    log.warn('url:', url);

    const res = await fetch(url);
    const data = await res.json();
    log.warn('response:', data);
    props.trees = data.trees;
  }

  {
    const url = `${process.env.NEXT_PUBLIC_API_NEW}/countries/leader`;
    log.warn('url:', url);

    const res = await fetch(url);
    const data = await res.json();
    log.warn('response:', data);
    props.countries = data.countries;
  }

  return {
    props,
  };
}