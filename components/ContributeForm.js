import React, {Component} from 'react';
import {Form, Button, Input, Message} from 'semantic-ui-react';
import {Router} from '../routes';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';

class ContributeForm extends Component{
    state={
        value: '',
        loading: false,
        errorMessage: ''
    };

    handleAmountChange = (event) => {
        this.setState({
            value: event.target.value
        });
    };

    handleFormSubmit = async (event) => {
        event.preventDefault();
        let {value} = this.state;
        let {address} = this.props;

        this.setState({
            loading: true,
            errorMessage: ''
        });

        const campaign = Campaign(address);
        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(value, "ether")
            });
            Router.replaceRoute(`/campaigns/${address}`);
        } catch (error) {
            this.setState({
                errorMessage: error.message
            });
        }

        this.setState({loading: false});
    };

    render() {
        let {value, loading, errorMessage} = this.state;
        return (
            <Form
                onSubmit={this.handleFormSubmit}
                error={!!errorMessage}
            >
                <Form.Field>
                    <label>Amount to contribute</label>
                    <Input
                        label="ether"
                        labelPosition="right"
                        value={value}
                        onChange={this.handleAmountChange}
                    />
                </Form.Field>
                <Message
                    error
                    header="Something just exploded..."
                    content={errorMessage}
                    style={{overflowWrap: 'break-word'}}
                />
                <Button
                    primary
                    loading={loading}
                >
                    Contribute!
                </Button>
            </Form>
        );
    }
}

export default ContributeForm;