App = {
  web3Provider: null,
  contracts: {},
  account: "0x0",
  loading: false,
  tokenPrice: 1000000000000000,
  tokensSold: 0,
  tokensAvailable: 750000,

  init: function () {
    console.log("App initialized...");
    return App.initWeb3();
  },

  initWeb3: function () {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      window.ethereum.enable();
      App.web3Provider = window.web3.currentProvider;
    }

    return App.initContracts();
  },

  initContracts: function () {
    $.getJSON("TokenSale.json", function (tokeSale) {
      App.contracts.TokenSale = TruffleContract(tokeSale);
      App.contracts.TokenSale.setProvider(App.web3Provider);
      App.contracts.TokenSale.deployed().then(function (contractInstance) {
        console.log("Token Sale Address:", contractInstance.address);
      });
    }).done(function () {
      $.getJSON("Token.json", function (token) {
        App.contracts.Token = TruffleContract(token);
        App.contracts.Token.setProvider(App.web3Provider);
        App.contracts.Token.deployed().then(function (contractInstance) {
          console.log("Token Address:", contractInstance.address);
        });

        //App.listenForEvents();
        return App.render();
      });
    });
  },

  // // Listen for events emitted from the contract
  // listenForEvents: function() {
  //   App.contracts.TokenSale.deployed().then(function(instance) {
  //     instance.Sell({}, {
  //       fromBlock: 0,
  //       toBlock: 'latest',
  //     }).watch(function(error, event) {
  //       console.log("event triggered", event);
  //       App.render();
  //     })
  //   })
  // },

  render: function () {
    if (App.loading) {
      return;
    }
    App.loading = true;

    const loader = $("#loader");
    const content = $("#content");

    loader.show();
    content.hide();

    let tokenSaleInstance;
    let tokenContractInstance;

    // Load account data
    web3.eth.getCoinbase().then(function (account) {
      App.account = account;
      $("#accountAddress").html("Your Account: " + account);
    });

    // Load token sale contract
    App.contracts.TokenSale.deployed()
      .then(function (instance) {
        tokenSaleInstance = instance;
        return tokenSaleInstance.tokenPrice();
      })
      .then(function (tokenPrice) {
        App.tokenPrice = tokenPrice;
        $(".token-price").html(web3.utils.fromWei(App.tokenPrice, "ether"));
        return tokenSaleInstance.tokenSold();
      })
      .then(function (tokensSold) {
        App.tokensSold = tokensSold.toNumber();
        $(".tokens-sold").html(App.tokensSold);
        $(".tokens-available").html(App.tokensAvailable);

        var progressPercent =
          (Math.ceil(App.tokensSold) / App.tokensAvailable) * 100;
        $("#progress").css("width", progressPercent + "%");

        // Load token contract
        App.contracts.Token.deployed()
          .then(function (instance) {
            tokenContractInstance = instance;
            console.log(App.account);
            return tokenContractInstance.balanceOf(App.account);
          })
          .then(function (balance) {
            $(".dapp-balance").html(balance.toNumber());
            App.loading = false;
            loader.hide();
            content.show();
          });
      });
  },

  buyTokens: function () {
    $("#content").hide();
    $("#loader").show();
    var numberOfTokens = $("#numberOfTokens").val();
    App.contracts.TokenSale.deployed()
      .then(function (instance) {
        return instance.buyTokens(numberOfTokens, {
          from: App.account,
          value: numberOfTokens * App.tokenPrice,
          gas: 500000, // Gas limit
        });
      })
      .then(function (result) {
        console.log("Tokens bought...");
        $("form").trigger("reset"); // reset number of tokens in form
        // Wait for Sell event
      });
  },
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
