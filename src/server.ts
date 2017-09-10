/**
 * Module dependencies
 */
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as twilioConfig from './config/twilio.config';

const wiki = require('wikijs').default;

const twilio = require('twilio');

/**
 * Controllers (route handlers).
 */
// import * as homeController from "./controllers/home";

/**
 * Setup Twilio using keys in Config
 */
const client = new twilio(twilioConfig.ACCOUNT_SID, twilioConfig.AUTH_TOKEN);

const app = express();

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log('  App is running at http://localhost:%d in %s mode', app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

app.post('/', (req, res) => {
  const term = req.body.Body;
  console.log(term);
  wiki()
    .page(term)
    .then((page: any) => {
      //   console.log(page);
      page.summary().then((summary: any) => {
        client.messages
          .create({
            from: twilioConfig.NUMBER,
            to: req.body.From,
            body: page.raw.title + ': ' + summary,
          })
          .then((message: any) => {
            // console.log(message);
          })
          .catch((error: any) => {
            console.log(error);
            client.messages
              .create({
                from: twilioConfig.NUMBER,
                to: req.body.From,
                body: page.raw.title + ': ' + summary.substring(0, 1500),
              })
              .then((message: any) => {
                //   console.log(message);
              });
          });
      });
    })
    .catch((error: any) => {
      client.messages
        .create({
          from: twilioConfig.NUMBER,
          to: req.body.From,
          body: 'No article found',
        })
        .then((message: any) => {
          // console.log(message);
        });
    });
});

module.exports = app;
