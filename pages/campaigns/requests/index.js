import React, {Component} from 'react';
import {Button} from 'semantic-ui-react';
import {Link} from '../../../routes';
import Layout from '../../../components/Layout';

class RequestIndex extends Component {
    static async getInitialProps(props){
        let {address} = props.query;
        return {address};
    }

    render() {
        let {address} = this.props;
        return(
            <Layout>
                <h3>Requests</h3>
                <Link route={`/campaigns/${address}/requests/new`}>
                    <a>
                        <Button primary>
                            Àdd Request
                        </Button>
                    </a>
                </Link>
            </Layout>
        );
    }
}

export default RequestIndex;