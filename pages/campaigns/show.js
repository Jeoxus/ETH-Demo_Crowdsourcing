import React, {Component} from 'react';
import {Card, Grid, Button} from 'semantic-ui-react';
import {Link} from '../../routes';
import web3 from '../../ethereum/web3';
import Layout from '../../components/Layout';
import ContributeForm from '../../components/ContributeForm';
import Campaign from '../../ethereum/campaign';


class CampaignShow extends Component {
    static async getInitialProps(props) {
        const campaign = Campaign(props.query.address);
        const summary = await campaign.methods.getSummary().call();
        return {
            minimumContribution: summary[0],
            balance: summary[1],
            requestsCount: summary[2],
            approversCount: summary[3],
            manager: summary[4],
            campaignAddress: props.query.address
        };
    }

    renderCards = () => {
        const {
            balance,
            minimumContribution,
            requestsCount,
            approversCount,
            manager
        } = this.props;

        const items = [
            {
                header: manager,
                description: 'The manager created this campaign and can create requests.',
                meta: 'Address of the Manager',
                style: {overflowWrap: 'break-word'}
            },
            {
                header: minimumContribution,
                description: 'You must contribute at least this much wei to become an approver.',
                meta: 'Minimum Contribution (wei)',
            },
            {
                header: requestsCount,
                description: 'A request tries to withdraw money from the contract. Must be approved by approvers.',
                meta: 'Number or Requests',
            },
            {
                header: approversCount,
                description: 'Number of people who have already donated to this campaign.',
                meta: 'Number or Approvers',
            },
            {
                header: web3.utils.fromWei(balance, "ether"),
                description: 'Amount of money this campaign has left to spend.',
                meta: 'Campaign Balance (ether)',
            },
        ];

        return <Card.Group items={items}/>;
    };

    render() {
        let {campaignAddress} = this.props;
        return (
            <Layout>
                <h3>Campaign Show</h3>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10}>
                            {this.renderCards()}

                        </Grid.Column>

                        <Grid.Column width={6}>
                            <ContributeForm address={campaignAddress}/>
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row>
                        <Grid.Column>
                            <Link route={`/campaigns/${campaignAddress}/requests`}>
                                <a>
                                    <Button
                                        primary
                                    >
                                        View Requests
                                    </Button>
                                </a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        );
    }
}

export default CampaignShow;