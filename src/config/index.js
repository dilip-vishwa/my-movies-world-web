import process from "process";
import dev_endpoint from './development';
import prod_endpoint from './production';


const env = process.env.NODE_ENV1 || 'production';

let endpoint = env == "production" ? prod_endpoint : dev_endpoint
console.log(env)
console.log(endpoint)
export default {
    endpoint: endpoint.endpoint
}