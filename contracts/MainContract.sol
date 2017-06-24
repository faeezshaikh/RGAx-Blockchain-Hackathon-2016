contract MainContract {
    address public owner;
    uint public premiumCost;
    uint public payoutCoverage;
    uint public triggerCondition;
    uint public yieldYear;
    uint public acerage;
    State public state;
    enum State { Proposed, Live, Inactive }
    SubContract[] public subContracts;

    struct SubContract {
        address marketUser;
        //payout that the user is responsible for
        uint payOut;
        //The split of the premium cost that the user
        uint splitPremium;
    }

    function MainContract() {
      //set the owner to the contract
      owner = msg.sender;

      //flip the state to proposed
      state = State.Proposed;

      //TODO: comment this out since this is for testing only
      //payoutCoverage = 1000;

      //premiumCost = _premiumCost;
    }

   

    function proposedPremiumCost(uint _premiumCost) returns(bool success) {
        if(owner != msg.sender) return false;
        premiumCost = _premiumCost;

        return true;
    }

    function proposedAcerage(uint _acerage) returns(bool success) {
        if(owner != msg.sender) return false;
        acerage = _acerage;

        return true;
    }

    function buyInsuranceContract(address _marketUser, uint _payOut, uint _splitPremium)
    {
        //check if the SubContract are filled up
        if(subContracts.length >= 2) return;

        //save struct in memory before pushing it into the array. Soliditys way of things.
        SubContract memory subA = SubContract (_marketUser, _payOut, _splitPremium);

        //Fill SubContract based on the address
        subContracts.push(subA);
    }

    function checkSubcontractFilled() returns(bool success) {
        //for(uint i = 0; i < subContracts.length; i ++ )
        //if the subcontracts are filled up with 2 people then consider it completed
        if(subContracts.length == 2) {
            state = State.Live;
            return true;
        }

        return false;
    }


    function distributePremium()
    {

    }

    function serviceWeatherAPI() returns(uint weatherTemp) {
        //TODO: call up some random weather generation here
        return 60;
    }

    function simulateWeatherDisaster() returns(uint weatherTemp) {
        //it is hot up in here
        return 150;
    }

    /// Abort the purchase and reclaim the ether.
    function cancelInsurance(){
        if( owner != msg.sender) {
            return;
        }

        if(state == State.Proposed) {
            //figure out the console
            //aborted();
            state = State.Inactive;
        }
    }


}
