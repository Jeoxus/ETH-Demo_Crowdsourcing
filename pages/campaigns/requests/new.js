import React, {Component} from 'react';
import {Form, Button, Input, Message} from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import Campaign from "../../../ethereum/campaign";
import web3 from "../../../ethereum/web3";
import {Link, Router} from "../../../routes";

class NewRequest extends Component {
    state = {
        loading: false,
        errorMessage: '',
        description: '',
        value: '',
        recipient: '',
    };

    static async getInitialProps(props){
        const {address} = props.query;

        return {address};
    }

    onSubmit = async (event) => {
        event.preventDefault();

        const {address} = this.props;
        const {description, value, recipient} = this.state;
        const campaign = Campaign(address);

        this.setState({
            errorMessage: '',
            loading: true
        });

        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods
                .createRequest(description,
                    web3.utils.toWei(value, 'ether'), recipient)
                .send({
                    from: accounts[0]
                });

            Router.pushRoute(`/campaigns/${address}/requests`);
        } catch (e) {
            this.setState({ errorMessage: e.message});
        }

        this.setState({loading: false});
    };

    render() {
        const {
            errorMessage,
            loading,
            value,
            description,
            recipient
        } = this.state;
        const {address} = this.props;
        return(
            <Layout>
                <Link route={`/campaigns/${address}/requests`}>
                    <a>
                        Back
                    </a>
                </Link>
                <h3>Create a Request</h3>
                <Form onSubmit={this.onSubmit} error={!!errorMessage}>
                    <Form.Field>
                        <label>Description</label>
                        <Input
                            value={description}
                            onChange={
                                event => this.setState({description: event.target.value})
                            }
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Value</label>
                        <Input
                            label="ether"
                            labelPosition="right"
                            value={value}
                            onChange={
                                event => this.setState({value: event.target.value})
                            }
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Recipient</label>
                        <Input
                            value={recipient}
                            onChange={
                                event => this.setState({recipient: event.target.value})
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

export default NewRequest;