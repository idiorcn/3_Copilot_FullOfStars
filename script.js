let playerFunds = 5000000;
let computerFunds = 5000000;
let playerStocks = 0;
let stockPrice = 100;
let priceHistory = [stockPrice];

const playerFundsElement = document.getElementById('player-funds');
const computerFundsElement = document.getElementById('computer-funds');
const playerStocksElement = document.getElementById('player-stocks');
const playerStockValueElement = document.getElementById('player-stock-value');
const priceChartElement = document.getElementById('price-chart');
const buyButton = document.getElementById('buy-button');
const sellButton = document.getElementById('sell-button');
const stockAmountInput = document.getElementById('stock-amount');

function updatePrice() {
    const change = (Math.random() - 0.5) * 10;
    stockPrice = Math.max(1, stockPrice + change);
    priceHistory.push(stockPrice);
    if (priceHistory.length > 100) {
        priceHistory.shift();
    }
    drawChart();
    updatePlayerStockValue();
}

function drawChart() {
    priceChartElement.innerHTML = '';
    const maxPrice = Math.max(...priceHistory);
    const minPrice = Math.min(...priceHistory);
    const canvas = document.createElement('canvas');
    canvas.width = priceChartElement.clientWidth;
    canvas.height = priceChartElement.clientHeight;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - ((priceHistory[0] - minPrice) / (maxPrice - minPrice)) * canvas.height);
    priceHistory.forEach((price, index) => {
        const x = (index / (priceHistory.length - 1)) * canvas.width;
        const y = canvas.height - ((price - minPrice) / (maxPrice - minPrice)) * canvas.height;
        ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#4caf50';
    ctx.stroke();
    priceChartElement.appendChild(canvas);
}

function computerTrade() {
    const action = Math.random() > 0.5 ? 'buy' : 'sell';
    const amount = Math.floor(Math.random() * 1000);
    if (action === 'buy' && computerFunds >= stockPrice * amount) {
        computerFunds -= stockPrice * amount;
    } else if (action === 'sell' && computerFunds + stockPrice * amount <= 5000000) {
        computerFunds += stockPrice * amount;
    }
    computerFundsElement.textContent = computerFunds;
}

function playerTrade(action) {
    const amount = parseInt(stockAmountInput.value);
    if (action === 'buy' && playerFunds >= stockPrice * amount) {
        playerFunds -= stockPrice * amount;
        playerStocks += amount;
    } else if (action === 'sell' && playerStocks >= amount) {
        playerFunds += stockPrice * amount;
        playerStocks -= amount;
    }
    playerFundsElement.textContent = playerFunds;
    playerStocksElement.textContent = playerStocks;
    updatePlayerStockValue();
    checkGameOver();
}

function updatePlayerStockValue() {
    const stockValue = playerStocks * stockPrice;
    playerStockValueElement.textContent = stockValue;
}

function checkGameOver() {
    const totalValue = playerFunds + playerStocks * stockPrice;
    if (totalValue < 10000) {
        alert('电脑赢了！');
        resetGame();
    } else if (computerFunds < 10000) {
        alert('玩家赢了！');
        resetGame();
    }
}

function resetGame() {
    playerFunds = 5000000;
    computerFunds = 5000000;
    playerStocks = 0;
    stockPrice = 100;
    priceHistory = [stockPrice];
    playerFundsElement.textContent = playerFunds;
    computerFundsElement.textContent = computerFunds;
    playerStocksElement.textContent = playerStocks;
    playerStockValueElement.textContent = 0;
    drawChart();
}

buyButton.addEventListener('click', () => playerTrade('buy'));
sellButton.addEventListener('click', () => playerTrade('sell'));

setInterval(() => {
    updatePrice();
    computerTrade();
}, 1000);

drawChart();
