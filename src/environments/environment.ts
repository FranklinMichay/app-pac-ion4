// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://45.79.169.248:8000/entidades/getData?model=',
  apiURL1: 'http://45.79.169.248:8000/',
  socketUrl: 'http://45.79.169.248:8080/',
  apiMongoDB: 'http://157.245.123.192:3000/',
  url: 'http://45.79.169.248:8000',
  //paymentezAPI: 'https://ccapi-stg.paymentez.com'
  
  // apiUrl: 'http://192.168.0.102:9000/entidades/getData?model=',
  // apiURL1: 'http://192.168.0.102:9000/',
  // socketUrl: 'http://192.168.0.102:8080/',
  // apiMongoDB: 'http://192.168.0.102:3000/',
  // url: 'http://192.168.0.102:9000'

  //apiUrl: 'http://9d8d5137.ngrok.io/entidades/getData?model=',
  // apiURL1: 'http://9d8d5137.ngrok.io/',
  // socketUrl: 'http://f724eb12.ngrok.io',
  // apiMongoDB: 'http://192.168.0.107:3000/',
  // url: 'http://9d8d5137.ngrok.io'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
