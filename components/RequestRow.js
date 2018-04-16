import React, {Component} from 'react';
import {Table, Button} from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import Campaign from '../ethereum/campaign';

class RequestRow extends Component{
    handleApprove = async () => {
        const {address, id} = this.props;
        const campaign = Campaign(address);
        const accounts = await web3.eth.getAccounts();
        await campaign.methods.approveRequest(id).send(
            {
                from: accounts[0]
            }
        );
    };

    handleFinalize = async () => {
        const {address, id} = this.props;
        const campaign = Campaign(address);
        const accounts = await web3.eth.getAccounts();
        await campaign.methods.finalizeRequest(id).send(
            {
                from: accounts[0]
            }
        );
    };

    render() {
        const {Row, Cell} = Table;
        const {id , request, approversCount} = this.props;
        const readyToFinalize = request.approvalCount > approversCount / 2;

        return(
            <Row
                disabled={request.complete}
                positive={readyToFinalize && !request.complete}
            >
                <Cell>{id}</Cell>
                <Cell>{request.description}</Cell>
                <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
                <Cell>{request.recipient}</Cell>
                <Cell>{request.approvalCount}/{approversCount}</Cell>
                <Cell>
                    {
                        request.complete ? null : (
                            <Button color='green' basic onClick={this.handleApprove}>
                                Approve
                            </Button>
                        )
                    }

                </Cell>
                <Cell>
                    {
                        request.complete ? null : (
                            <Button color='teal' basic onClick={this.handleFinalize}>
                                Finalize
                            </Button>
                        )
                    }
                </Cell>
            </Row>
        );
    }
}

export default  RequestRow;