const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory');
const compiledCampaign = require('../ethereum/build/Campaign');

const minimum = 100;
let accounts;
let factory;
let campaignAddress;
let campaign;
let manager;
let approver;
let campaignProvider;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    manager = accounts[0];
    approver = accounts[1];
    campaignProvider = accounts[2];
    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({data: compiledFactory.bytecode})
        .send({
            from: manager,
            gas: '1000000'
        });
    await factory.methods.createCampaign(minimum.toString()).send({
        from: manager,
        gas: '1000000'
    });
    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress
    );
});

describe('Campaigns', () => {
    it('deploys a factory and campaign', async () =>{
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('marks caller as manager', async () => {
        assert.equal(manager, await campaign.methods.manager().call());
    });

    it('it receives ether and registers approvers', async () => {
        await campaign.methods.contribute().send({
            value: minimum.toString(),
            from: approver
        });
        assert(await campaign.methods.approvers(approver).call());
    });

    it('requires a minimum contribution', async () => {
        try {
            await campaign.methods.contribute().send({
                value: (minimum-1).toString(),
                from: approver
            });
            assert(false);
        } catch (error) {
            assert.ok(error);
        }
    });

    it('allows a manager to make a payment request', async () => {
        const description = 'buy huniepop';
        await campaign.methods.createRequest(description, '5', accounts[9]).send({
            from: manager,
            gas: '1000000'
        });
        const request = await campaign.methods.requests(0).call();
        assert.equal(
            description,
            request.description
        );
    });

    it('processes request', async () => {
        let providerBalance = await web3.eth.getBalance(campaignProvider);
        providerBalance = parseFloat(providerBalance.toString());

        await campaign.methods.contribute().send({
            value: web3.utils.toWei('10', 'ether'),
            from: approver
        });

        await campaign.methods.createRequest(
            'placeholder',
            web3.utils.toWei('5', 'ether'),
            campaignProvider
        ).send({
            from: manager,
            gas: '1000000'
        });

        await campaign.methods.approveRequest(0).send({
            from: approver,
            gas: '1000000'
        });

        await campaign.methods.finalizeRequest(0).send({
            from: manager,
            gas: '1000000'
        });

        let providerPostBalance = await web3.eth.getBalance(campaignProvider);
        providerPostBalance = parseFloat(providerPostBalance.toString());

        assert(providerPostBalance > providerBalance);
    });
});