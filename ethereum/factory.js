import web3 from './web3';
import campaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(campaignFactory.interface),
    '0x82eE4A9606890274c1d22bE7b4079DB6A395F5DA'
);

export default instance;