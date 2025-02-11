import express, { response } from "express";
import dotenv from "dotenv";
import axios from "axios";
import bodyParser from "body-parser";
dotenv.config();

const app = express();
const port = process.env.port;
const url = process.env.url;
const apikey = process.env.apikey;
const imagepi = process.env.imageApi;

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index.ejs");
})

app.post("/search", async (req, res) =>{
    const searchCountry = req.body.countryselected;

    if(searchCountry === '')
    {
        res.render("index.ejs");
    }
    else{
        try {
            //
            const responseImage = (await axios.get(`${imagepi}${searchCountry}&orientation=landscape&size=large`, {
                headers: {
                    Authorization: `${apikey}`
                }
            })).data;
            const responseCountry = await axios.get(`${url}${searchCountry}`);
            const result = responseCountry.data[0];
            const currency = Object.keys(result.currencies)[0];
            const lat = result.latlng[0];
            const lng = result.latlng[1];
            const mapsurl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 5},${lat - 5},${lng + 5},${lat + 5}&layer=mapnik`;
            const languages = Object.values(result.languages).join(", ");
            const responsedata = {
                common: result.name.common,
                official: result.name.official,
                domain: result.tld[0],
                currenciesCode: currency,
                currenciesName: result.currencies[currency].name,
                capital: result.capital[0],
                region: result.region,
                languages: languages,
                area: result.area + " Km²",
                maps: mapsurl,
                population: result.population,
                timezones: result.timezones[0],
                flags: result.flags.svg,
                countryimage: responseImage.photos[0].src.original,
                countryimageinfo: responseImage.photos[0].alt,
                photographername: responseImage.photos[0].photographer,
                photographerurl: responseImage.photos[0].url,
            };
            res.render("index.ejs", {response: responsedata});
          } catch (error) {
            console.error(error);
          }
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});