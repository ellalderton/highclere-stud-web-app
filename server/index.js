const compression = require('compression')
const express = require('express')
const consola = require('consola')
const {
  Nuxt,
  Builder
} = require('nuxt')
const app = express()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000
// const port = 3000
// const quotaStatic = process.env.QUOTAGUARDSTATIC_URL;
const redirectToHTTPS = require('express-http-to-https').redirectToHTTPS;
const timeout = require('connect-timeout');
const referrerPolicy = require('referrer-policy');
const frameguard = require('frameguard');
const hsts = require('hsts');
const xssFilter = require('x-xss-protection');
const hidePoweredBy = require('hide-powered-by');
const noSniff = require('dont-sniff-mimetype');
const featurePolicy = require('feature-policy');
const csp = require('helmet-csp');
const rateLimit = require("express-rate-limit");

// Bugsnag
const bugsnag = require('@bugsnag/js');
const bugsnagExpress = require('@bugsnag/plugin-express');
const bugSnagKey = process.env.BUGSNAG_API_KEY || 'na';
const bugsnagClient = bugsnag(bugSnagKey);

bugsnagClient.use(bugsnagExpress);
let middleware = bugsnagClient.getPlugin('express');

app.use(middleware.requestHandler);

app.use(compression())

app.enable("trust proxy");

const limiter = rateLimit({
  windowMs: 3 * 60 * 1000, // 3 minutes
  max: 150 // limit each IP to 150 requests per windowMs
});

//  apply to all requests
app.use(limiter);

const Cookies = require('universal-cookie')
const proxy = require('express-http-proxy')
const bodyParser = require('body-parser')

const companyId = 32; // Highclere Stud
const LIVEAPI = 'https://bloodstockapp.weatherbys.co.uk';
const STAGINGAPI = 'https://bloodstocksys.weatherbys.co.uk';
// const LOCALAPI = 'https://bloodstocksys.weatherbys.co.uk';
const LOCALAPI = 'http://cms-api.local';
const APIURL = process.env.NODE_ENV === 'production' ? process.env.VERSION === 'LIVE' ? `${LIVEAPI}` : `${STAGINGAPI}` : `${LOCALAPI}`;

const STAGINGEANDRAPITOKEN = '197E858994B549469C06F49FB9AB2DEF';
const LIVEEANDRAPITOKEN = 'B7EC49758A053541B1E7BB625429234C';
const EANDRAPITOKEN = process.env.VERSION === 'LIVE' ? LIVEEANDRAPITOKEN : STAGINGEANDRAPITOKEN;

app.set('port', port)

// Helmet Middleware
app.use(referrerPolicy());
app.use(frameguard({ action: 'deny' }));
app.use(hsts({
  maxAge: 15552000  // 180 days in seconds
}));
app.use(xssFilter());
app.use(hidePoweredBy());
app.use(noSniff());
app.use(featurePolicy({
  features: {
    fullscreen: ["'self'"],
    syncXhr: ["'none'"]
  }
}));

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // Don't redirect if the hostname is `localhost:port`  or the route is `/insecure`
  app.use(redirectToHTTPS([/localhost:(\d{4})/], [/\/insecure/], 301));

  // Any route that tries to access '/w-api' will be sent off to the Weatherbys API.
  // This will solve CORS issues.
  // Allows us to attach the headers needed.
  // Use the cookie to get the authorization token.
  // http://cms-api.local
  app.use(
    '/w-api',
    timeout('20s'),
    haltOnTimedout,
    proxy(APIURL, {
      reqBodyEncoding: null,
      limit: "80mb", // Set file upload limit

      proxyReqOptDecorator(opts, srcReq) {
        const cookies = new Cookies(srcReq.headers.cookie);

        opts.headers['authorization'] = cookies.get('app_jwt') || '';
        opts.headers['companyid'] = companyId;
        opts.headers['Accept'] = 'application/vnd.nodes.v1+json';

        return opts;
      }
    })
  );

  // Any route that tries to access '/w-qatar' will be sent off to the QatarRacing Processwire site api.
  app.use(
    '/w-mock',
    timeout('5s'),
    haltOnTimedout,
    proxy('https://entries-and-results-api.herokuapp.com/', {
      reqBodyEncoding: null,
    })
  );

  app.use(
    '/w-erapi',
    timeout('5s'),
    haltOnTimedout,
    proxy('https://live.bloodstockreports.co.uk', {
      reqBodyEncoding: null,

      proxyReqOptDecorator(opts, srcReq) {
        // console.log('OPTS', opts.path);
        // console.log('srcReq', srcReq);
        // console.log('opts', opts);
        // console.log('srcReq', srcReq);
        if(opts.path === '/4DCGI/EANDRAPI/RacesForHorse') {
          opts.headers['Authorization'] = EANDRAPITOKEN;
          opts.headers['Accept'] = 'application/json';
          console.log('OPTS RESULTS:', srcReq);
        } else {
          // console.log('OPTS', opts.path);
          opts.headers['Authorization'] = '3A79256464D0EE49896EDF50114C9FCA';
          // opts.headers['Content-Type'] = 'application/json';
          console.log('OPTS BREEDING:', srcReq);
        }
        
        return opts;
      }
    })
  );

  // app.use(
  //   '/w-maresapi',
  //   timeout('5s'),
  //   haltOnTimedout,
  //   proxy('https://live.bloodstockreports.co.uk', {
  //     reqBodyEncoding: null,

  //     proxyReqOptDecorator(opts, srcReq) {
  //       // console.log('opts', opts);
  //       // console.log('srcReq', srcReq);

  //       opts.headers['Authorization'] = '3A79256464D0EE49896EDF50114C9FCA';
  //       // opts.headers['Accept'] = 'application/json';
  //       opts.headers['Content-Type'] = 'application/json';

  //       return opts;
  //     }
  //   })
  // );
  
  // app.use((req,res,next)=>{
  //   // console.log('req recieved from client', req);
  //   next();//this will invoke next middleware function
  // });

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Catch any errors
  app.use(function (err, req, res, next) {
    console.log('Could not connect to API!');
    console.error(err.stack);
    bugsnagClient.notify(err);
    res.status(500).send(JSON.stringify({
      message: 'Could not connect to API!'
    }));
  });

  app.on('error', (e) => {
    console.error(e);
    bugsnagClient.notify(e);
  });

  app.use(middleware.errorHandler);

  function haltOnTimedout(req, res, next) {
    if (!req.timedout) {
      next();
    } else {
      let err = new Error("Error could not connect to API");
      bugsnagClient.notify(err);
      err.status = 504;
      next(err);
    }
  }

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
