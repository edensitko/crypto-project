
const coinInfoUrl = 'https://api.coingecko.com/api/v3/coins/';
const cryptoCurrencyUrl ='https://api.coingecko.com/api/v3/coins/markets?vs_currency=USD';
  

  let compareList = [];
  let cards = [];
  let cacheStorage = null;

var modal = document.querySelector("#myModal");
btn = document.querySelector("#showModalBtn");
var okBtn = document.querySelector("#okBtn");

btn.onclick = function() {
modal.style.display = "block";
}
okBtn.onclick = function() {
  modal.style.display = "none";
}

const LoadWindow = async () =>{
    $('nav a').click(function(e) {
        e.preventDefault();
        var href = $(this).attr('href');
        $('section').hide();
        $(href).show();
      });      
      allCardInfo = await $.get(cryptoCurrencyUrl);
      createListCards(allCardInfo);

     };
  
   
  const createListCards = async (cardList) => {
    try {
   
        $('#allCards').html('');
        cardList.map((card, index) => {
    const id = `cardExtendedInfo${index}`;
    const isChecked = compareList.some(coin => coin.coinId === card.id);
    const cardHtml = `
            <div class="col">
            <div class="card h-100">
            <div class="card-body">
            <label class="form-switch">
            <input type="checkbox" class="form-check-input toggle" 
                id="toggle${card.id}" 
                onclick="addToCompareList('${card.symbol}', '${card.id}', this)" 
                data-card-inp=${card.id}
                ${isChecked ? 'checked' : ''}>
            <i class="form-icon"></i>
        </label>
        
                <h4 class="card-title">${card.symbol}</h4>
                <p class="card-text">${card.name}</p>
                <button class="btn btn-primary moreInfo" 
                onclick="getMoreInfo('${card.id}', '${id}')" 
                data-bs-toggle="collapse"
                data-bs-target="#${id}" 
                aria-expanded="false">More Info
                </button>
            </div>
            <div class="collapse flex-grow-0" id="${id}">
                <div class="cardCollapse">
                    <div class="cardCollapseWrap">
                    <div class="spinner-border text-primary" style="display: block;"></div>
                    <div class="cryptoMoreInfo">
                        <img class="imgValue" src="" class="coinImg">
                    </div><hr/>
                    <div class="cryptoMoreInfo">
                        USD $: <span class="usdValue"></span>
                    </div><hr/>
                    <div class="cryptoMoreInfo">
                        EUR €: <span class="eurValue"></span>
                    </div><hr/>
                    <div class="cryptoMoreInfo">
                        ILS ₪: <span class="ilsValue"></span>
                    </div><hr/>
                    </div>
                </div>
            </div>
            </div>
        </div>
    `;
    $('#allCards').append(cardHtml);
  });
    } catch (error) {
      console.error(error);
    }
  };
  $("#submit").click(async function(event) {
    event.preventDefault();
    const firstLetter = $("#coin-name").val().charAt(0).toLowerCase();
    const coinInfoUrl = 'https://api.coingecko.com/api/v3/coins/';
    const response = await fetch(`${coinInfoUrl}?include_platform=false&include_coins=true`);
    $("#liveReport").hide();
    $("#about").hide(); 
    $("#home").show(); 
    try {
      const coins = await response.json();
      const filteredCoins = coins.filter(coin => coin.symbol.charAt(0).toLowerCase() === firstLetter);
      const cardHtml = filteredCoins.map(coin => {
        const isChecked = compareList.some(coinCompare => coinCompare.coinId === coin.id);
        const id = `cardExtendedInfo${coin.id}`;
        return `
          <div class="col">
            <div class="card h-100">
              <div class="card-body">
                <label class="form-switch">
                  <input type="checkbox" class="form-check-input toggle" 
                    id="toggle${coin.id}" 
                    onclick="addToCompareList('${coin.symbol}', '${coin.id}', this)" 
                    data-card-inp=${coin.id}
                    ${isChecked ? 'checked' : ''}>
                  <i class="form-icon"></i>
                </label>
                <h4 class="card-title">${coin.symbol}</h4>
                <p class="card-text">${coin.name}</p>
                <button class="btn btn-primary moreInfo" 
                  onclick="getMoreInfo('${coin.id}', '${id}')" 
                  data-bs-toggle="collapse"
                  data-bs-target="#${id}" 
                  aria-expanded="false">More Info
                </button>
              </div>
              <div class="collapse flex-grow-0" id="${id}">
                <div class="cardCollapse">
                  <div class="cardCollapseWrap">
                    <div class="spinner-border text-primary" style="display: block;"></div>
                    <div class="cryptoMoreInfo">
                      <img class="imgValue" src="" class="coinImg">
                    </div><hr/>
                    <div class="cryptoMoreInfo">
                      USD $: <span class="usdValue"></span>
                    </div><hr/>
                    <div class="cryptoMoreInfo">
                      EUR €: <span class="eurValue"></span>
                    </div><hr/>
                    <div class="cryptoMoreInfo">
                      ILS ₪: <span class="ilsValue"></span>
                    </div><hr/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('');
      $('#allCards').html(cardHtml);
    } catch (error) {
      console.error(error);
      $('#allCards').html(`<p>No matching coins found.</p>`);
    }
    $("#coin-name").val("");
  });
  
  
  const getMoreInfo = async (coinId, cardId) => {
    try {
      const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`);
      const data = await response.json();
      
      const cardCollapse = $(`#${cardId} .cardCollapse`);
      const spinner = cardCollapse.find('.spinner-border');
      const cryptoMoreInfo = cardCollapse.find('.cryptoMoreInfo');
      const imgValue = cryptoMoreInfo.find('.imgValue');
      const usdValue = cryptoMoreInfo.find('.usdValue');
      const eurValue = cryptoMoreInfo.find('.eurValue');
      const ilsValue = cryptoMoreInfo.find('.ilsValue');
  
      imgValue.attr('src', data.image.small);
      usdValue.text(data.market_data.current_price.usd);
      eurValue.text(data.market_data.current_price.eur);
      ilsValue.text(data.market_data.current_price.ils);
  
      spinner.hide();
      cardCollapse.collapse('show');
    } catch (error) {
      console.error(error);
    }
  };
  

  const setCachedData = async (cacheId, coinInfo) => {
    try {
      if (!cacheStorage) {
        cacheStorage = await caches.open('cryptoInfo');
      }
      coinInfo.timestamp = Date.now();
      await cacheStorage.put(cacheId, new Response(JSON.stringify(coinInfo)));
    } catch (e) {
      console.error(e, 'Error caching data');
    }
  };
  
  const getCachedData = async cacheId => {
    try {
      if (!cacheStorage) {
        cacheStorage = await caches.open('cryptoInfo');
      }
  
      const coinInfo = await cacheStorage.match(cacheId);
      if (!coinInfo) {
        return null;
      }
  
      const coinInfoJson = await coinInfo.json();
      const timeElapsed = (Date.now() - coinInfoJson.timestamp) / 1000;
      if (timeElapsed > 120) {
        cacheStorage.delete(cacheId);
        return null;
      }
      return coinInfoJson;
    } catch (e) {
      console.error(e, 'Error retrieving cached data');
      return null;
    }
  };

  function addToCompareList(symbol, id, checkbox) {
    const isChecked = $(checkbox).is(":checked");
    const index = compareList.findIndex(item => item.symbol === symbol && item.id === id);
  
    if (isChecked && index === -1) {
      if (compareList.length >= 5) {
        compareList.shift();
      }
      const cardData = { symbol, id };
      compareList.push(cardData);
      $(".modal-content h6").append(`<p>${symbol} - ${id}<button class="btn remove-btn" data-id="${id}">X</button></p>`);
      if (compareList.length === 5) {
        modal.style.display = "block";
        $(".addMsg").text("*you selected the max limit please remove coin to add new* ").show();
      }
    } else if (!isChecked && index !== -1) {
      compareList.splice(index, 1);
      $(".modal-content h6 p").eq(index).remove();
      $(".addMsg").hide();
    }
  
    $('input[type="checkbox"]').not(':checked').prop('disabled', compareList.length >= 5);
    $('input[type="checkbox"]:checked').prop('disabled', false);
    $("#compare-error").toggle(compareList.length >= 5);
  
    $('.remove-btn').off('click').on('click', function() {
      const index = $(this).parent().index();
      const symbol = $(this).parent().text().split(' - ')[0];
      const id = $(this).data("id"); 
      removeItem(symbol, id); 
      $(".addMsg").hide();
  
    
    });
  
    console.log(compareList); 
  };
  function removeItem(symbol, id) {
    const index = compareList.findIndex(item => item.symbol === symbol && item.id === id);
  
    if (index !== -1) {
      compareList.splice(index, 1);
      $(".modal-content h6 p").eq(index).remove();
      $('input[type=".form-check-input"]').not(':checked').prop('disabled', compareList.length >= 5);
      $('input[type=".form-check-input"]:checked').prop('disabled', false);
      $("#compare-error").toggle(compareList.length >= 5);
  
      $(`input[data-symbol="${symbol}"][data-id="${id}"]`).prop('checked', false);
      
      $(".form-check-input").each(function() {
        const symbol = $(this).data("symbol");
        const id = $(this).data("id");
        const isAlreadyAdded = compareList.some(item => item.symbol === symbol && item.id === id);
        $(this).prop("checked", isAlreadyAdded);
      });
  
      console.log(compareList);
    }
  }
  
  function renderChart() {
    var chart = new CanvasJS.Chart("chartContainer", {
      title : {
        text : "Live Crypto Prices"
      },
      data : [{
        type : "line",
        dataPoints : []
      }]
    });
  
    chart.render();
    function updateChart() {
      var coins = compareList.map(coin => coin.id); 
      var currency = "USD"; 
      var url = "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=" + coins.join(",") + "&tsyms=" + currency;
    
      fetch(url)
        .then(response => response.json())
        .then(data => {
          var newDataPoints = [];
          var coinList = document.getElementById("coinList");
          coinList.innerHTML = ""; 
          for (var i = 0; i < coins.length; i++) {
            var coin = coins[i];
            var price = data.DISPLAY[coin][currency].PRICE;
            newDataPoints.push({ x: new Date(), y: price });
            var listItem = document.createElement("li");
            listItem.textContent = coin + ": " + price;
            coinList.appendChild(listItem);
          }
          chart.options.data[0].dataPoints = newDataPoints;
          chart.render();
        })
        .catch(error => {
          console.log("Error fetching data from API:", error);
        });
    }
    
    setInterval(function() {
      updateChart();
    }, 1000);
  }
  