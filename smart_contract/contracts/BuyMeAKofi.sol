// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Buy Me A Kofi deployed to goerli at: 0x4BDacB24a0f47545460DC2bAC14e170906dAAf8E

contract BuyMeAKofi {
    // memo : message

    // event to emit whem memo is created
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    // Memo struct.
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    // List of all memos recieved from friends
    Memo[] memos;

    // address of contract deployer (owner)
    address payable owner;

    // deploy logic
    // constructor will run only once (first time)
    constructor() {
        // msg.sender is the one who is deploying
        owner = payable(msg.sender);
    }

    /**
     * @dev buy a kofi for contract owner
     * @param _name name of the kofi buyer
     * @param _message message from the kofi buyer
     */
    function buyKofi(string memory _name, string memory _message) public payable {
        // memory: after function is completed throw this variables so it saves some gas
        require (msg.value > 0, "can't buy kofi with 0 eth");

        // add to memos storage
        memos.push(Memo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        ));

        // emit a log event when new memo is created
        emit NewMemo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        );
    }

    /**
     * @dev send the entire balance in this contract to the owner
     */
    function withdrawTips() public {
        // address(this).balance has all balance of contract
        /* this function is public doesn't mean anyone can get money by calling it
           whoever call that function, money go to the owners account.
        */
        require(owner.send(address(this).balance));
    }

    /**
     * @dev retrieve all the memos on blockchain
     */
    function getMemos() public view returns(Memo[] memory) {
        // view before return tells that we not gonna do any change on blockchain, so it save some gas.
        return memos;
    }
}
