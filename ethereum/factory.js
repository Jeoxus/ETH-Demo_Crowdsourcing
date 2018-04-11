import web3 from './web3';
import campaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(campaignFactory.interface),
    '0xD319b0cD580E33ADEbdCC2403B2c3C1205739872'
);

export default instance;