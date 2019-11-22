App = {
  web3Provider: null,
  contracts: {},
  account: 0x0,

  init: async function() {

    return await App.initWeb3();
  },

  initWeb3: async function() {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }

    return App.displayAccountInfo();
  },

  displayAccountInfo: function(){
    web3.eth.getCoinbase(function(err, account) {
      if( err === null) {
        App.account = account;
        $('#accountId').text(account);
      }
      return App.initContract();
    });
  },

initContract: function(){
  $.getJSON('Voting.json',function(votingArtifact){
    App.contracts.Voting =  TruffleContract(votingArtifact);

    App.contracts.Voting.setProvider(App.web3Provider);
    return App.reloadVoters();
  });
},

  reloadVoters: function(){

    App.contracts.Voting.deployed().then(function(instance){
      return instance.getAllCandidatesWithVotes();
    }).then(function(candidateObject){
      console.log(candidateObject.toString());
      var votingTemplate = $('#votingTemplate');
      votingTemplate.find('.panel-title').text('First Candidate');
      votingTemplate.find('.voter-name').text(candidateObject[0]);
      votingTemplate.find('.Votes').text(candidateObject[1]);
      votingTemplate.find('.btn-vote').attr('id',0);
      $('#votersRow').append(votingTemplate.html());

      votingTemplate.find('.panel-title').text('Second Candidate');
      votingTemplate.find('.voter-name').text(candidateObject[2]);
      votingTemplate.find('.Votes').text(candidateObject[3]);
      votingTemplate.find('.btn-vote').attr('id',1);
      $('#votersRow').append(votingTemplate.html());

      votingTemplate.find('.panel-title').text('Third Candidate');
      votingTemplate.find('.voter-name').text(candidateObject[4]);
      votingTemplate.find('.Votes').text(candidateObject[5]);
      votingTemplate.find('.btn-vote').attr('id',2);
      $('#votersRow').append(votingTemplate.html());

    })

  },

  Vote: function(_index){
    console.log('id ', _index);

    App.contracts.Voting.deployed().then(function(instance){
      return instance.voteForCandidate(_index,{
        from: App.account,
        gas: 5000000
      });
    }).then(function(result){

    }).catch(function(err){
      console.error(err);
    });
  },

  AuthorizeVoter: function(){
    var _address =$('#address').val();

    if((_address.trim() == '') || (_address == 0x0)){
      return false
    }

    App.contracts.Voting.deployed().then(function(instance){
      return instance.authorizeVoter(_address,{
        from: App.account,
        gas: 5000000
      });
    }).then(function(result){

    }).catch(function(err){
      console.error(err);
    });

  }


};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
