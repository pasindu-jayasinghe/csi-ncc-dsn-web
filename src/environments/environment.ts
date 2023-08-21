// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  baseUrlAPI: 'http://localhost:7080'  ,
  //baseUrlAPI: 'https://nccdsn.env.gov.lk/web-api'  ,
  
  baseUrlAPIDocUploadAPI: 'http://localhost:7080/document/upload2'  ,


  keycloak : {
    // Url of the Identity Provider
    issuer : "https://nccdsn.env.gov.lk/auth/realms/ncc-dsn",
    //issuer : "http://13.76.166.4:8080/auth/realms/ncc-dsn",
    // URL of the SPA to redirect the user to after login
    //redirectUri : "https://nccdsn.env.gov.lk",
    redirectUri : "http://localhost:7070",
    //http://40.65.186.12:7070/home
    // The SPA's id. 
    // The SPA is registerd with this id at the auth-serverß
    clientId: "dsn-app",
    responseType : "code",
    // set the scope for the permissions the client should request
    // The first three are defined by OIDC.
    scope : "openid profile email",
    requireHttps:"false",
    showDebugInformation : "true",
    disableAtHashCheck : "true",
    skipIssuerCheck : "true"
  }


};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
