// SPDX-License-Identifier: GPL-3.0


pragma solidity >=0.4.22;

contract Election {
    address public admin;
    string public topic;
    uint256 public startTime;
    uint256 public endTime;
    struct Candidate {
        uint256 candidateId; // candidateId starts from index 1
        string name;
    }
    mapping(uint256 => uint256) private voteCount;
    uint256 public candidatesCount;
    mapping(uint256 => Candidate) public candidates;
    struct Voter {
        address voterAddress;
        string name;
        bool voted;
        bool registered; // to check if this voter has registered
        uint256 candidateId;
    }
    uint256 public votersCount;
    mapping(address => Voter) public voters;
// constructor call
    constructor() public {
        admin = msg.sender;
        startTime = block.timestamp;
        endTime = startTime + 5 minutes;
        topic = "Who should be the Prime Minister(2019)?";
        candidates[1] = Candidate(1, "Congress");
        candidates[2] = Candidate(2, "BJP");
        candidates[3] = Candidate(3, "Shivsena");
        candidates[4] = Candidate(4, "NCP");
        candidatesCount = 4;
    }

    modifier adminOnly() {
        require(admin == msg.sender);
        _;
    }

    modifier registeredVotersOnly() {
        require(voters[msg.sender].registered);
        _;
    }

    modifier withinTimeLimit() {
        require(block.timestamp < endTime);
        _;
    }

    modifier afterTimeLimit() {
        require(block.timestamp > endTime);
        _;
    }

    event voterRegistered(address _voterAddress);

    event voteCasted(address _voterAddress);
function timestamp() external view returns (uint256) {
  return block.timestamp;
}
    function getCurrentVoter()
        public
        view
        returns (
            address,
            string memory,
            bool,
            bool,
            uint256
        )
    {
        Voter memory voter = voters[msg.sender];
        return (
            voter.voterAddress,
            voter.name,
            voter.voted,
            voter.registered,
            voter.candidateId
        );
    }

    function addVoter(string memory _name) public {
        require(!voters[msg.sender].registered,"You've already registered");
        votersCount++;
        voters[msg.sender] = Voter(msg.sender, _name, false, true, 0);
        emit voterRegistered(msg.sender);
    }

    // main voting function takes your selected candidate id and increments their vote count
    function vote(uint256 _candidateId)
        public
        registeredVotersOnly
        withinTimeLimit
    {
        require(!voters[msg.sender].voted);
        voteCount[_candidateId]++;
        voters[msg.sender].voted = true;
        voters[msg.sender].candidateId = _candidateId;
        emit voteCasted(msg.sender);
    }

    function getVoteCountFor(uint256 _candidateId)
       external
        view
        returns (uint256, string memory)
    {
        return (voteCount[_candidateId], candidates[_candidateId].name);
    }

    // returns (id, name, voteCount) of the winning candidate
    function getWinningCandidate()
        external
        view
        returns (
            uint256,
            string memory,
            uint256
        )
    {    
        uint256 maxVote = 0;
        uint256 maxVoteCandidateId = 0;
        for (uint256 i = 0; i <= candidatesCount; i++) {
            if (maxVote < voteCount[i]) {
                maxVote = voteCount[i];
                maxVoteCandidateId = i;
            }
        }
        return (
            maxVoteCandidateId,
            candidates[maxVoteCandidateId].name,
            maxVote
        );
    }
}
