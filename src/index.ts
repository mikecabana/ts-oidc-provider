import express from 'express';
import helmet from 'helmet';
import oidc from 'oidc-provider';

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

app.get('/', (req, res) => res.json({ status: 'running' }));

const provider = new oidc.Provider(ISSUER, {});
app.use('/oidc', provider.callback());

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
