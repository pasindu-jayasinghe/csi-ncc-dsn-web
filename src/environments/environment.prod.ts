export const environment = {
  production: true,
  // baseUrlAPI: 'http://13.76.166.4:7080',  
  baseUrlAPI: 'https://nccdsn.env.gov.lk/web-api',  
  //ec2-3-7-54-14.ap-south-1.compute.amazonaws.com
  //baseUrlAPIDocUploadAPI: 'http://13.76.166.4:7080/document/upload2',
  baseUrlAPIDocUploadAPI: 'https://nccdsn.env.gov.lk/web-api/document/upload2',

  //baseUrlAPI: " https://e50d4ab4906f.ngrok.io"

  keycloak : {
    // Url of the Identity Provider
    // issuer : "http://13.76.166.4:8080/auth/realms/ncc-dsn",
    issuer : "https://nccdsn.env.gov.lk/auth/realms/ncc-dsn",
    // URL of the SPA to redirect the user to after login
    // redirectUri : "http://13.76.166.4:7070",
    redirectUri : "https://nccdsn.env.gov.lk",
    //redirectUri : "http://40.65.186.12:7070",
    //http://40.65.186.12:7070/home
    // The SPA's id. 
    // The SPA is registerd with this id at the auth-serverß
    clientId: "dsn-app",
    responseType : "code",
    // set the scope for the permissions the client should request
    // The first three are defined by OIDC.
    scope : "openid profile email",
    requireHttps:"true",
    showDebugInformation : "true",
    disableAtHashCheck : "true",
  }

};
