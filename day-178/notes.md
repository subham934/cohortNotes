express
dotenv
singleton Auth--> MVC

Global Error Middleware
Async Handler
Token - JWT



Authentication: There are mainly two types of auth(tokens)
1. Singleton token: A single token is used for authentication throughout the application.
2. multiple tokens: Different tokens are used for different sessions or users, providing more granular control over authentication.(access tokens and refresh tokens)

attacks like XSS and CSRF can compromise authentication tokens if proper security measures are not implemented. These attacks happens on cookies, apis, compromised frontend applications, and can lead to unauthorized access if tokens are stolen.

1. Access tokens: These tokens are used to access protected resources and have a limited lifespan. It last of an hour or 5 hrs.
2. Refresh tokens: These tokens are used to obtain new access tokens without requiring the user to re-authenticate. They usually have a longer lifespan compared to access tokens, often lasting days or weeks.

even now, if our tokens get compromised, we can mitigate the impact by implementing token revocation mechanisms and using short-lived access tokens along with refresh tokens. This way, the compromised access token will expire quickly, and the attacker won't be able to use it for long.

Refresh Token VS Access Token

1. Access Token:
   - Short-lived token used to access protected resources.
   - Typically expires within an hour or a few hours.
   - If compromised, the impact is limited due to its short lifespan.
   - used for all protected routes and requests.
   - Typically stored in memory or local storage on the client side.

2. Refresh Token:
   - Long-lived token used to obtain new access tokens.
   - Typically expires in days or weeks.
   - If compromised, it can be used to generate new access tokens until revoked.
   - only used for obtaining new access tokens.
   - save in DB & cookies for secure storage.



siddy934_db_user
hGw3JfrITj5qe64r
mongodb+srv://<db_username>:hGw3JfrITj5qe64r@cluster0.psige9k.mongodb.net/