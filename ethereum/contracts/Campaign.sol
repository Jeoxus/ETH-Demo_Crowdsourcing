pragma solidity ^0.4.17;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint minimumContribution) public {
        deployedCampaigns.push(new Campaign(minimumContribution, msg.sender));
    }

    function getDeployedCampaigns() public view returns (address[]){
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        mapping(address => bool) approvals;
        uint approvalCount;
    }

    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approvers_count;
    Request[] public requests;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function Campaign(uint _minimumContribution, address _manager) public {
        manager = _manager;
        minimumContribution = _minimumContribution;
    }

    function contribute() public payable {
        require(msg.value >= minimumContribution);
        require(!approvers[msg.sender]);

        approvers[msg.sender] = true;
        approvers_count++;
    }

    function createRequest(string description, uint value, address recipient)
    public restricted{
        requests.push(Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
            }));

    }

    function approveRequest(uint index) public {
        address sender = msg.sender;
        require(approvers[sender]);

        Request storage request = requests[index];
        require(!request.approvals[sender]);

        request.approvals[sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];

        require(!request.complete);
        require(request.approvalCount > approvers_count/2);

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getSummary() public view returns (
        uint, uint, uint, uint, address
    ) {
        return (
            minimumContribution,
            this.balance,
            requests.length,
            approvers_count,
            manager
        );
    }

    function getRequestCount() public view returns (uint) {
        return requests.length;
    }
}