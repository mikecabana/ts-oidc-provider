import express from 'express';
import helmet from 'helmet';
import oidc from 'oidc-provider';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 4000;
const ISSUER = process.env.ISSUER || `http://localhost:${PORT}`;

const isProd = process.env.NODE_ENV === 'production';

const app = express();

const directives = helmet.contentSecurityPolicy.getDefaultDirectives();
delete directives['form-action'];
app.use(
    helmet({
        contentSecurityPolicy: {
            useDefaults: false,
            directives,
        },
    })
);

const provider = new oidc.Provider(ISSUER, {
    clients: [
        {
            client_id: 'sample',
            client_secret: 'secret',
            grant_types: ['client_credentials'],
            redirect_uris: [],
            response_types: [],
        },
        {
            client_id: 'postman',
            client_secret: 'secret',
            grant_types: ['authorization_code'],
            redirect_uris: ['https://oauth.pstmn.io/v1/callback'],
            response_types: ['code'],
        },
    ],
    scopes: ['api1'],
    pkce: { methods: ['S256'] },
    features: {
        clientCredentials: { enabled: true },
        introspection: { enabled: true },
    },
    cookies: {
        keys: ['secret'],
    },
    jwks: {
        keys: [
            {
                p: 'yiRD9-42nsN0n7bxLqWhvyVQSh5BIYDlXUVdI6tzW2RhmMIWu3P9n8ygByENUErFkU62iU5aLl4-DlnOCfhNeIy6EoObaebADthaJ4IS_EhLqZ21AMptpMaY9A9LwA9npSGjenSU3wtPNY7qMt8pGnZhI2baLVILLJeXURlIB1E',
                kty: 'RSA',
                q: 'w4JRV90wB0m6isFzbt0U9C9LsarTMz4-0B3-jVN6TNFHQgoOTjKeY9bsaFZ7VTgNMY93DhCgy9lzK6xuoXJroGMrYa8xCHM6YLYHMxDoDUXJPxcRZcIfzXfPuUD3auIsYrGxdkGEph9l31KQh2E0y4wv3qOU6Ucmi8QtY31lP7k',
                d: 'VE2z-ie-voOlciYseMTT_TaKFwE0RUabgsQhKAcnRp6f2CLAnsoPvHNRiXaWX8B6EcX4kFl3maLcIRHrUHOlIt3oLvI1xh2QuRXRfirdu0poHjCFPjoMF4kWEdTyA6WEw9QDmwTa3NA5NPxqBUV6EBujC0iGkGo3lhC2jM_SJVskm8_ApB4Nuyb2tAdYHHCYHry9fbdCjruN-nyk_KaUhyfsiTxZBRnf_2DeSkoeOGJ8P9O1wcpTp0xgCNTIRj__87VTjigQ6q0lNvmPZGLkvd-_cRRNGKgu--Ra56_mGSE6IjDA-yhnucUrYTmbTUrALKyNwUuq47ez9jYcnc3jgQ',
                e: 'AQAB',
                use: 'sig',
                kid: 'IYNlZiN9bTb5XU08Yhxm0nFKU_TYOIiXwYzRpwQuDEI',
                qi: 'TbyfB6dL8SW8xy12YL4aF-lH7EQNfAJIc-lEiCDRPYwhKlOEYqSnD4gRSSkGmUVvPyBrBOKn9f3RJa1XlckYWTib8jS2b1fn4zeZieNuZ71NSI7fjRNaapfz781Zds0hoYkBOqL4AD8gjsVXloO8769rXZ7p3Nc2RJovIWUjbLg',
                dp: 'AfPRuD5TxrrKkJRaxgGRi2AX429hX6p4DKuT17lbNuHEU45kW9El_Poj_Y2jLEhcmiexeagJFPOSE99oLw536Rcq4OzmfmJdLoeGb2VBO7CTEoNUcTqDTpkgdxMCv0smzCCEDLW9jl30mObVekJPilLkY0wmBVQKiZa5Pm5JFNE',
                alg: 'RS256',
                dq: 'ZDYP67F8RMAN1cGCoXjAnMkBS3f7-XAWUiaNq3L2ZRmAJOFyo7JebV5knrZ1USEB4j1fEN6FDPfQiLpBmo9Di1pJijB6OZKWgavL1Oj9iJAUrznruPTfyDl5R8N9DlQP3Caoh6zdiSje1rFDU6EHpq2ce8ntMgU-RLWxbiWAGEE',
                n: 'mmCGazjWWYe6g5H5-DZlqMPuVChWgyK_d826WEj0u3r4ncky56YXEKcUnQ2NyGJTCMNEF4_0WTOfLQ6scrLZ_-Scg7gEWfOslgDG01_xZQX38y-zFOORp38rxqd65on8KUr7MYJrovJfpQ24Nbrh8nbc8xXv8OX8ArhlNkl7mxJXW91_CEG-ux9XpENPzj2PigF3HT2BgM2sbvjVKeaTq93ilMIFIiCW23hVQI73X7xMTSg7DrlSp64wYjAd5PEXwwx7lXUuH70a1_gXpI7DQq2JHJtMMmtLi-DyWtyc9phIBulaShzyFl0FiH7bzju7VLW_wKObcLDZSIUkbs84iQ',
            },
        ],
    },
});
app.use('/oidc', provider.callback());

app.get('/', (req, res) => res.json({ status: 'running' }));

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
