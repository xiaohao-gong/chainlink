const { ethers} = require("hardhat")

async function main(){
    // create factory
    const fundMeFactory = await ethers.getContractFactory("FundMe")
    console.log("contract deploying")
    // deploy contract from factory



    const fundMe = await fundMeFactory.deploy(300);
    await fundMe.waitForDeployment();

    console.log(`contract has been deployed successfully,contract address is ${fundMe.target}`);

    if(hre.network.config.chainId =11155111 && process.env.ETHERSCAN_API_KEY){
        console.log("Waiting for 5 confirmations")
        await fundMe.deploymentTransaction().wait(5);
        await verfiyFundMe(fundMe.target , [300])
    }else{
        console.log("verification skipped..")
    }

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



}

async function verfiyFundMe(fundMeAddr,args) {
    await hre.run("verify:verify", {
        address: fundMeAddr,
        constructorArguments:args,
      });
}


main().then().catch((error) => {
    console.error(error)
    process.exit(1) 
})