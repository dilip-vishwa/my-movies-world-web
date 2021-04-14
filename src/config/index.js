import process from "process";
import dev_endpoint from './development';
import prod_endpoint from './production';


const env = process.env.NODE_ENV1 || 'production';

let endpoint = env === "production" ? prod_endpoint : dev_endpoint
const config = {
    endpoint: endpoint.endpoint
}

export default config;
