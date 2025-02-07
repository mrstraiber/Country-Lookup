import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import bodyParser from "body-parser";
dotenv.config();

const app = express();
const port = process.env.port;
const url = process.env.url;
const apikey = process.env.apikey;

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index.ejs");
})

app.post("/search", async (req, res) =>{
    const searchCountry = req.body.countryselected;

    if(req.body.countryselected === '')
    {
        res.render("index.ejs", {response: "Please chose a country from list"});
    }
    else{
        try {
            const response = await axios.get(`${url}${searchCountry}`);
            const result = response.data[0];
            const currency = Object.keys(result.currencies)[0];
            const translate = Object.keys(result.translations);
            const responsedata = {
                common: result.name.common,
                official: result.name.official,
                domain: result.tld[0],
                
            }
            console.log(response.data);
          } catch (error) {
            console.error(error);
          }
    }
})





app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});