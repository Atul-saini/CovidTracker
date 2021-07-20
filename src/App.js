import React ,{useEffect, useState} from 'react';
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent
} from "@material-ui/core";
import './App.css';
import InfoBox from './InfoBox';

import Table from './Table';
import {sortData,prettyPrintStat} from "./util";
import numeral from 'numeral';
import LineGraph from "./LineGraph";
//import Mapi from './Mapi';
//require('leaflet/dist/leaflet.css');
//import "MapContainer/dist/leaflet.css";
function App() {
  const [countries,setCountries]=useState([]);
  const [country, setCountry]=useState("Worldwide");
  const [countryInfo,setCountryInfo]=useState({});
  const [tableData,setTableData]= useState([]);
  const [mapCenter,setMapCenter]=useState({lat:34.80746,lng:-40.4796});
  const [mapZoom,setMapZoom]=useState(3);
  const [mapCountries,setMapCountries]=useState([]);
  const [casesType,setCaseType]=useState('cases');
  var url1="https://www.countryflags.io/ind/flat/64.png";
  useEffect(() => {

  fetch("https://disease.sh/v3/covid-19/all")
  .then(response=>response.json())
  .then(data=>{
    setCountryInfo(data);
  })
  },[] )

  useEffect( ()=>{
  const getCountriesDate =async()=> {
    await fetch("https://disease.sh/v3/covid-19/countries")
    .then( (response)=>response.json())
    .then((data)=>{
      const countries =data.map( (country)=> (
        {
          name: country.country,
          value : country.countryInfo.iso2
        } ));
         const sortedData=sortData(data);
        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries);
    });
  };
  getCountriesDate();
  },[]);

  const onCountryChange = async(event)=>{
            const countryCode=event.target.value;
            setCountry(countryCode);
            // url1=`https://www.countryflags.io/${countryCode}/64.png `;
        const url= countryCode==='worldwide' ? 'https://disease.sh/v3/covid-19/all' 
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
        await fetch(url)
        .then(response=>response.json())
        .then(data=>{
              setCountry(countryCode);
               setCountryInfo(data);
               setMapCenter([data.countryInfo.lat,data.countryInfo.lon]);
               setMapZoom(4);
        });
  };


  return (
    <div className="app">
    <div className="app__left">

    <div className="app__header">
     <h1> Covid 19 Tracker</h1>
      
       <FormControl className="app__dropdown">
         <Select variant = "outlined"  onChange={onCountryChange} value={country} >
           
          <MenuItem value={country} > Worldwide</MenuItem>
         { countries.map((country)=> (

            <MenuItem value={country.value}> {country.name}
            </MenuItem>
          )
          )
        }
          </Select>
       </FormControl>

       </div>

       <div className="app__status">
           <InfoBox
            onClick={(e)=> setCaseType('cases')}
              title="CoronaVirus Cases"
             cases={prettyPrintStat(countryInfo.todayCases)}
             total={prettyPrintStat(countryInfo.cases)}

             />
           <InfoBox 
            onClick={(e)=> setCaseType('recovered')}
            title="Recovered" 
           cases={prettyPrintStat(countryInfo.todayRecovered)} 
           total={prettyPrintStat(countryInfo.recovered)} 

           />
           
           <InfoBox  onClick={(e) => setCaseType("deaths")} 
            title="Deaths" 
            cases={prettyPrintStat(countryInfo.totalDeaths)} 
            total={prettyPrintStat(countryInfo.deaths)}
            
           />
       </div>
      
   </div>
<Card className="app__right">

 <CardContent>
    <h1>Live cases by Country</h1>
    <Table countries={tableData}>

    </Table>
    <h3>World Wide new {casesType}</h3>
    <LineGraph casesType= {casesType}/>
 </CardContent>
 
</Card>
    </div>
    
  
  );
}

export default App;
