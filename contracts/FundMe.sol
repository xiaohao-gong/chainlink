// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

// 1.创建一个收款函数
//2.记录投资人并且查看
//3.在锁定期内，达到目标值，生产商可以提款
// 4.在锁定期内，没有达到目标值，投资人在锁定期以后退款




contract FundMe {
    mapping(address => uint256) public fundersToAmount;


    uint256  constant MINIMUM_VALUE = 1 * 10 ** 18;

    AggregatorV3Interface internal dataFeed;

    uint256 constant TARGET =1000 * 10 **18;

    address public owner;

    uint256 deploymentTtimestamp;

    uint256 lockTime;

    address erc20Addr;

    bool public getFundSuccess = false;

    constructor(uint256 _lockTime){
        dataFeed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
        owner = msg.sender;
        deploymentTtimestamp = block.timestamp;
        lockTime = _lockTime;
    }
    


    function fund() external payable{
        require(convertEthToUsd(msg.value) >= MINIMUM_VALUE,"send more eth");
        require(block.timestamp <= deploymentTtimestamp + lockTime,"window is closed");
        fundersToAmount[msg.sender] = msg.value;
    }


    function setFunderToAmount(address funder, uint256 amountToUpdate) external {
        require(msg.sender == erc20Addr, "you do not have permission to call this funtion");
        fundersToAmount[funder] = amountToUpdate;
    }

    
     /**
     * Returns the latest answer.
     */
    function getChainlinkDataFeedLatestAnswer() public view returns (int) {
        // prettier-ignore
        (
            /* uint80 roundID */,
            int answer,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = dataFeed.latestRoundData();
        return answer;
    }

    function convertEthToUsd(uint256 ethAmount) internal view returns(uint256){
        uint256 ethPrice = uint256(getChainlinkDataFeedLatestAnswer());
        return ethAmount * ethPrice / (10 **8);
    }

    function transferOwnership(address newOwner) public onlyOwner{
        owner = newOwner;
    }


    function getFund() external windowClose onlyOwner {
        require(convertEthToUsd(address(this).balance) >= TARGET , "Target is not reached");
        require(block.timestamp >= deploymentTtimestamp + lockTime,"window is not closed");
        bool success;
        (success,) = payable(msg.sender).call{value: address(this).balance}("");
        require(success,"transfer tx failed");
        fundersToAmount[msg.sender] = 0;
        getFundSuccess = true; // flag

    }

    function refund() external windowClose {
        require(convertEthToUsd(address(this).balance) < TARGET,"Target is reached");
        require(fundersToAmount[msg.sender] != 0,"there is no fund for you");
        require(block.timestamp >= deploymentTtimestamp + lockTime,"window is not closed");
        bool success;
        (success, ) = payable(msg.sender).call{value: fundersToAmount[msg.sender]}("");
        require(success,"transfer tx failed");
        fundersToAmount[msg.sender] = 0;
    }

    modifier windowClose(){
         require(block.timestamp >= deploymentTtimestamp + lockTime,"window is not closed");
         _;//代表后执行代码
    }

    modifier onlyOwner(){
        require(msg.sender == owner, "this funciont can only be called by owner");
        _;
    }


}