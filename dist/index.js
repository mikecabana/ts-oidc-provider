"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const oidc_provider_1 = __importDefault(require("oidc-provider"));
const PORT = process.env.PORT || 4000;
const ISSUER = process.env.ISSUER || `http://localhost:${PORT}`;
const isProd = process.env.NODE_ENV === 'production';
const app = (0, express_1.default)();
const directives = helmet_1.default.contentSecurityPolicy.getDefaultDirectives();
delete directives['form-action'];
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        useDefaults: false,
        directives,
    },
}));
app.get('/', (req, res) => res.json({ status: 'running' }));
const provider = new oidc_provider_1.default.Provider(ISSUER, {});
app.use('/oidc', provider.callback());
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
