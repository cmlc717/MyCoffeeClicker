/* eslint-disable no-alert */

/**************
 *   SLICE 1
 **************/

 function updateCoffeeView(coffeeQty) {
    const coffeeCounter = document.getElementById("coffee_counter");
    coffeeCounter.innerText = coffeeQty;
  }
  
  function clickCoffee(data) {
    data.coffee++;
    updateCoffeeView(data.coffee);
    renderProducers(data);
    renderUpgrades(data)
  }
  
  /**************
   *   SLICE 2
   **************/
  
  function unlockProducers(producers, coffeeCount) {
    producers.map((ele) => {
      if (Number(coffeeCount) >= ele.price/2) {
        ele.unlocked = true;
      }
    });
  }
  
  function getUnlockedProducers(data) {
    return data.producers.filter((ele) => ele.unlocked === true);
  }
  
  function makeDisplayNameFromId(id) {
    let arr = id.split("_");  
    for (let i = 0; i < arr.length; i++) {
      arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].substring(1);
    }
    let newStr = arr.join(" ");
    return newStr;
  }
  
  function makeProducerDiv(producer) {
    const containerDiv = document.createElement('div');
    containerDiv.className = 'producer';
    const displayName = makeDisplayNameFromId(producer.id);
    const currentCost = producer.price;
    const html = `
    <div class="producer-column">
      <div class="producer-title">${displayName}</div>
      <button type="button" id="buy_${producer.id}">Buy</button>
      <button type="button" id="sell_${producer.id}">Sell</button>
    </div>
    <div class="producer-column">
      <div>Quantity: ${producer.qty}</div>
      <div>Coffee/half second: ${producer.cps}</div>
      <div>Cost: ${currentCost} coffee</div>
    </div>
    `;
    containerDiv.innerHTML = html;
    return containerDiv;
  }
  
  function deleteAllChildNodes(parent) {
    while (parent.hasChildNodes()) {
      parent.removeChild(parent.firstChild);
    }
  }
  
  function renderProducers(data) {
    const producerContainer = document.getElementById("producer_container");
    deleteAllChildNodes(producerContainer);
    unlockProducers(data.producers, data.coffee);
    let arr = getUnlockedProducers(data);
    let divArr = arr.map((producer) => makeProducerDiv(producer));
    divArr.forEach((div) => producerContainer.appendChild(div));
  }
  
  /**************
   *   SLICE 3
   **************/
  
  function getProducerById(data, producerId) {
    for (const producer of data.producers) {
      if (producer.id === producerId) {
        return producer;
      }
    }
  }
  
  function canAffordProducer(data, producerId) {
    let producer = getProducerById(data, producerId);
    if (data.coffee >= producer.price) {
      return true;
    } else {
      return false;
    }
  }
  
  function updateCPSView(cps) {
    let countpersec = document.getElementById("cps");
    countpersec.innerText = cps;
  }
  
  function updatePrice(oldPrice) {
    return Math.floor(oldPrice * 1.25);
  }
  
  function attemptToBuyProducer(data, producerId) {
    if (canAffordProducer(data, producerId)) {
      let producer = getProducerById(data, producerId);
      producer.qty++;
      data.coffee -= producer.price;
      data.totalCPS += producer.cps;
      producer.price = updatePrice(producer.price);
      return true;
    }
    return false;
  }
  
  function buyButtonClick(event, data) {
    if (event.target.tagName === "BUTTON") {
      let producerId = event.target.id.substring(4)
      let attempt = attemptToBuyProducer(data, producerId);
      if (attempt === false) {
        window.alert("Not enough coffee!");
      } else {
        renderProducers(data);
        updateCoffeeView(data.coffee);
        updateCPSView(data.totalCPS);
      }
    }
  }
  
  function tick(data) {
    data.coffee += data.totalCPS;
    updateCoffeeView(data.coffee);
    renderProducers(data);
    renderUpgrades(data)
  }
  
  /*************************
   *  Extra Credit Sell
   *************************/
  
  function sellButtonClick(event, data) {
    if (event.target.tagName === "BUTTON") {
      let producerId = event.target.id.substring(5)
      let attempt = attemptToSellProducer(data, producerId);
      if (attempt === false) {
        window.alert("You have none of these to sell!");
      } else {
        renderProducers(data);
        updateCoffeeView(data.coffee);
        updateCPSView(data.totalCPS);
      }
    }
  }
  
  function attemptToSellProducer(data, producerId) {
    if (canSellProducer(data, producerId)) {
      let producer = getProducerById(data, producerId);
      producer.qty--;
      data.coffee += producer.price;
      data.totalCPS -= producer.cps;
      return true;
    }
    return false;
  }
  
  function canSellProducer(data, producerId) {
    let producer = getProducerById(data, producerId);
    if (producer.qty >= 1) {
      return true;
    } else {
      return false;
    }
  }
  
  /*************************
   *  Extra Credit Upgrades
   *************************/
  
  function renderUpgrades(data) {
    const upgradesContainer = document.getElementById("upgrades_container");
    deleteAllChildNodes(upgradesContainer);
    let arr = unlockUpgrades(data.coffee);
    if (arr) {
        let divArr = arr.map((html) => makeUpgradesDiv(html));
        divArr.forEach((div) => upgradesContainer.appendChild(div));
    }
  }
  
  //if the coffee count meets a minimum, it will unlock the one-time upgrade
  function unlockUpgrades(coffeeCount) {
    let arr = [];
    if (coffeeCount > 100) {
      const html = `
      <div class="upgrade-column">
        <h4>Double Shot!!</h4>
        <h5>double the effectiveness of all available producers</h5>
        <h5>price: 500</h5>
        <button type="button" id="doubleShotBtn">Buy</button>
      </div>
      `;
      arr.push(html);
    } 
    if (coffeeCount > 1000) {
      const html = `
      <div class="upgrade-column">
        <h4>Red Eye</h4>
        <h5>halves the price of all producers</h5>
        <h5>price: 1000</h5>
        <button type="button" id="redEyeBtn">Buy</button>
      </div>
      `;
      arr.push(html);
    }
    if (coffeeCount > 5000) {
      const html = `
      <div class="upgrade-column">
        <h4>CAFFEINE OVERDOSE</h4>
        <h5>gives you one of every producer</h5>
        <h5>price: 5000</h5>
        <button type="button" id="overdoseBtn">Buy</button>
      </div>
      `;
      arr.push(html);
    }
    if (arr.length >= 1) {
      return arr;
    } else {
      return null;
    }
  }
  
  // make div holding html for one-time upgrade
  function makeUpgradesDiv(html) {
    const containerDiv = document.createElement('div');
    containerDiv.className = 'upgrade';
    containerDiv.innerHTML = html;
    return containerDiv;
  }
  
  function upgradesButtonClick(event, data) {
    if (event.target.id === "doubleShotBtn") {
      doubleShotFunc(data);
    } else if (event.target.id === "redEyeBtn") {
      redEyeFunc(data);
    } else if (event.target.id === "overdoseBtn") {
      overdoseFunc(data);
    }
  }
  
  //this upgrade makes all producers worth twice as much cps when purchased in the future
  function doubleShotFunc(data) {
    data.producers.forEach((producer) => producer.cps *=2);
    data.coffee -=500;
  }
  
  //this upgrade makes all producers cheaper
  function redEyeFunc(data) {
    data.producers.forEach((producer) => producer.price /=2);
    data.coffee -= 1000
  }
  
  //this upgrade gives the user one of each producer and updates their total cps accordingly
  function overdoseFunc(data) {
    data.producers.forEach((producer) => {
      producer.qty += 1;
      data.totalCPS += producer.cps;
    });
    updateCPSView(data.totalCPS);
    data.coffee -=5000;
  }
  
  /*************************
   *  Start your engines!
   *************************/
  // We'll begin with a check to see if we're in a web browser; if we're just running this code in node for purposes of testing, we don't want to 'start the engines'.
  
  // How does this check work? Node gives us access to a global variable /// called `process`, but this variable is undefined in the browser. So,
  // we can see if we're in node by checking to see if `process` exists.
  if (typeof process === 'undefined') {
    //if there is saved data, load it in
    window.addEventListener("load", () => {
      data.coffee = Number(localStorage.getItem("myCount"));
      data.totalCPS = Number(localStorage.getItem("myCPS"));
      let producerStr = localStorage.getItem("myProducers");
      let producerArr = producerStr.split("/");
      producerArr.pop(); //get rid of the extra element added at the end
      let producerObjArr = producerArr.map((producer) => {
        let arr = producer.split(",");
        let thisBool;
        if (arr[2] === "true") {
          thisBool = true;
        } else if (arr[2] === "false") {
          thisBool = false;
        }
        let prodObj = {id: arr[0], price: Number(arr[1]), unlocked: thisBool, cps: Number(arr[3]), qty: Number(arr[4])};
        return prodObj;
      });
      data.producers = producerObjArr;
  
      //render the data
      updateCPSView(data.totalCPS);
      updateCoffeeView(data.coffee);
      renderProducers(data);
      renderUpgrades(data)
    });
  
    //save the user's progress every 10 seconds 
    setInterval(() => localStorage.setItem("myCount", data.coffee), 10000);
    setInterval(() => localStorage.setItem("myCPS", data.totalCPS), 10000);
  
    setInterval(() => {
      let str = "";
      data.producers.forEach((producer) => {
        let producerStr = `${producer.id},${producer.price},${producer.unlocked},${producer.cps},${producer.qty}`;
        str += producerStr + "/";
      });
      localStorage.setItem("myProducers", str);
    }, 10000);
  
    // Get starting data from the window object
    // (This comes from data.js)
    const data = window.data;
  
    // Add an event listener to the giant coffee emoji
    const bigCoffee = document.getElementById('big_coffee');
    bigCoffee.addEventListener('click', () => clickCoffee(data));
  
    // Add an event listener to the container that holds all of the producers
    // Pass in the browser event and our data object to the event listener
    // to add the sell button, I edited this
    const producerContainer = document.getElementById('producer_container');
    producerContainer.addEventListener('click', event => {
      if (event.target.id.includes("buy")) {
        buyButtonClick(event, data);
      } else if (event.target.id.includes("sell")) {
        sellButtonClick(event, data);
      }
    });
  
    //I added this animation for fun, mostly because I can better understand the game when I give it a goal! 
    setInterval(()=> {
      let arr = Array.from(document.getElementsByClassName("sipper"));
      arr.forEach((img) => {
        if (img.className.includes("hidden")) {
          img.classList.remove("hidden");
        } else {
          img.classList.add("hidden");
        }
      })
    }, 1500); 
  
    // Call the tick function passing in the data object
    // altered to one per half second, a coffee themed website should be hyper!! :)
    setInterval(() => tick(data), 500);
  
    // in case someone wants to clear their local storage
    const clear = document.getElementById("clear");
    clear.addEventListener("click", () => {
      localStorage.clear();
      location.reload();
    });
  
    //upgrade button, I avoided making them one-time upgrades to not alter previous functions
    const upgradesContainer = document.getElementById('upgrades_container');
    upgradesContainer.addEventListener('click', event => {
      upgradesButtonClick(event, data);
    });
  }