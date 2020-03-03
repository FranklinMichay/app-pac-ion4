// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'https://medipharmec.com/api/entidades/getData?model=',
  apiURL1: 'https://medipharmec.com/api/',
  // apiUrl: 'http://192.168.0.113:8000/entidades/getData?model=',
  // apiURL1: 'http://192.168.0.113:8000/',
  socketUrl: 'https://medipharmec.com/',
  apiMongoDB: 'https://medipharmec.com/backNode/',
  url: 'https://medipharmec.com',
  mapbox: {
    accessToken: 'pk.eyJ1IjoiYnlqb3NlMDA3IiwiYSI6ImNqdzZ3NXFqbDBkZ3o0YXM1bzBlNzlsZDUifQ.H4Y5vm4i3ong8SaW1XUWNw'
 }
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
