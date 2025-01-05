const { task} = require("hardhat/config")
task("interact-contract","interact with fundme contract").
    addParam("addr","fundme contract address").setAction(async(taskArgs ,hre)=>{

    const fundMeFactory =await ethers.getContractFactory("FundMe");
    const fundMe = fundMeFactory.attach(taskArgs.addr);
    const [firstAccount,secondAccount] = await ethers.getSigner();

    const fundTx= await fundMe.fund({value: ethers.parseEther("0.5")})

    await fundTx.wait();

    const bgalanceOfContract = ethers.provider.getBalance(fundMe.target);
    console.log(`Balance of the contract is ${bgalanceOfContract}`)
    
    const fundTxWithSecond= await fundMe.fund({value: ethers.parseEther("0.5")})

    await fundTxWithSecond.wait();

    const balanceOfContractAfterSecondFund = ethers.provider.getBalance(fundMe.target);
    console.log(`Balance of the contract is ${balanceOfContractAfterSecondFund}`)

    //check mapping
    const firstAccountbalanceInFundMe = fundMe.fundersToAmount(firstAccount.address)
    const secondAccountbalanceInFundMe =fundMe.fundersToAmount(secondAccount.address)

    console.log(`Balance of first account${firstAccount.address} is ${firstAccountbalanceInFundMe} `)
    console.log(`Balance of second account${secondAccount.address} is ${secondAccountbalanceInFundMe} `)



})

module.exports ={}