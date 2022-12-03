import React, { useState, useEffect } from "react";
import ElectionContract from "./contracts/Election.json";
import getWeb3 from "./getWeb3";
import RegisterForm from "./components/RegisterForm";
import VoteNow from "./components/VoteNow";
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import "./App.css";
import TimeLeft from "./components/TimeLeft";
import Spinner from "./components/Spinner";
import Results from "./components/Results";


const App = () => {

  const [loading, setLoading] = useState(true);
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(undefined);
  const [registered, setRegistered] = useState(false);
  const [voted, setVoted] = useState(false);
  const [voterdetails, setVoterdetails] = useState({ metamaskID: "", name: "", voted: " ", registered: " " });
  const [starttime, setStarttime] = useState('');
  const [endtime, setEndtime] = useState('');


  useEffect(() => {

    const init = async () => {

      try {
        // load web3.
        const web3 = await getWeb3();
        // get the Metamask account.
        const accounts = await web3.eth.getAccounts();
        // get the network id.
        const networkId = await web3.eth.net.getId();
        // get the contract deployed on the network(particularly on definite network id).
        const deployedNetwork = ElectionContract.networks[networkId];
    //  Create an instance of your contract.
        const instance = new web3.eth.Contract(
          ElectionContract.abi,
          deployedNetwork && deployedNetwork.address,
        );

        // set web3, accounts, contract instance.
        setWeb3(web3);
        setAccounts(accounts);
        setContract(instance);

        // extract voterDetails.
        const voterInstance = await instance.methods.voters(accounts[0]).call(function (err, result) {
          if (!err) {
            return result;
          }
        });
        const hasRegistered = voterInstance[3];

        setVoterdetails({
          metamaskID: voterInstance[0], name: voterInstance[1],
          voted: voterInstance[2], registered: voterInstance[3]
        });
        
        setRegistered(hasRegistered);
        
        setVoted(voterInstance[2]);

        // extract startTime and endTime from the contract specified.
        const startTime = await instance.methods.startTime().call(function (error, result) {
          if (!error) {
            return result;
          }
        });

        const endTime = await instance.methods.endTime().call(function (error, result) {
          if (!error) {
            return result;
          }
        });
       
        setStarttime(startTime);
        setEndtime(endTime);
        setLoading(false);


      } catch (error) {
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
      }

    }
    init()
  }, [web3, accounts, contract, registered, voterdetails, loading, voted, starttime, endtime]);


  return (<div>

    <Router>
      <NavBar />
      <SideBar />
      <div className="content">

        <div className="center-elements">
          {loading ?
            <Spinner /> :

            <>
              <Routes>
                <Route exact path="/" element={<RegisterForm setVoterdetails={setVoterdetails} setRegistered={setRegistered} registered={registered} voterdetails={voterdetails} contract={contract} accounts={accounts} web3={web3} />}></Route>
                <Route exact path="/voteNow" element={<VoteNow setVoterdetails={setVoterdetails} setVoted={setVoted} contract={contract} registered={registered} voterdetails={voterdetails} voted={voted} accounts={accounts} web3={web3} />}></Route>
                <Route exact path="/results" element={<Results contract={contract} accounts={accounts} web3={web3} />}></Route>
              </Routes>
            </>
          }
        </div>
        {loading ?
          'loading...' : <TimeLeft contract={contract} accounts={accounts} starttime={starttime} endtime={endtime} />
        }

      </div>
    </Router>
  </div>);
};

export default App;
