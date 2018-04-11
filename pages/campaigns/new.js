import React, {Component} from 'react';
import {Form, Button, Input, Message} from 'semantic-ui-react';
import Layout from '../../components/Layout';
import web3 from '../../ethereum/web3';
import factory from '../../ethereum/factory';

class CampaignNew extends Component{
    state = {
        minimumContribution: '',
        errorMessage: '',
        loading: false
    };

    onSubmit = async (event) => {
        event.preventDefault();

        let {minimumContribution} = this.state;
        this.setState({
            errorMessage: '',
            loading: true
        });

        try {
            const accounts = await web3.eth.getAccounts();
            await factory.methods
                .createCampaign(minimumContribution)
                .send({
                    from: accounts[0]
                });
        } catch (e) {
            this.setState({ errorMessage: e.message});
        }

        this.setState({loading: false});
    };

    render() {
        let {minimumContribution, errorMessage, loading} = this.state;
        return (
            <Layout>
                <h3>Create a Campaign</h3>
                <Form onSubmit={this.onSubmit} error={!!errorMessage}>
                    <Form.Field>
                        <label>Minimum Contribution</label>
                        <Input
                            label="wei"
                            labelPosition="right"
                            value={minimumContribution}
                            onChange={
                                event => this.setState({minimumContribution: event.target.value})
                            }
                        />
                    </Form.Field>
                    <Message
                        error
                        header="Something just exploded..."
                        content={errorMessage}
                    />
                    <Button
                        primary
                        loading={loading}
                    >
                        Create!
                    </Button>
                </Form>
            </Layout>
        );
    }
}

export default CampaignNew;