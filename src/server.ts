/**
 * Module dependencies
 */
import * as express from "express";
import * as bodyParser from "body-parser";
import * as twilioConfig from "./config/twilio.config";

const twilio = require("twilio");

/**
 * Controllers (route handlers).
 */
// import * as homeController from "./controllers/home";

/**
 * Setup Twilio using keys in Config
 */
const client = new twilio(twilioConfig.ACCOUNT_SID, twilioConfig.AUTH_TOKEN);

const app = express();

app.set("port", process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Start Express server.
 */
app.listen(app.get("port"), () => {
    console.log(
        "  App is running at http://localhost:%d in %s mode",
        app.get("port"),
        app.get("env")
    );
    console.log("  Press CTRL-C to stop\n");
});

app.post("/", (req, res) => {
    console.log(req.body);
    // client.messages
    //     .create({
    //         from: twilioConfig.NUMBER,
    //         to: SOMETHING IN BODY,
    //         body: "Received your text!"
    //     })
    //     .then((message: any) => {
    //         console.log(message);
    //     });
});

module.exports = app;
