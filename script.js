let playerFunds = 5000000;
let computerFunds = [5000000];
let playerStocks = 0;
let stockPrice = 100;
let priceHistory = [stockPrice];
let level = 1;
let challengeAttempts = 3;
let nextRecoveryTime = new Date();
const levelGoals = [10000, 1000000]; // Add more levels as needed

const playerFundsElement = document.getElementById('player-funds');
const computerFundsElements = [
    document.getElementById('computer1-funds'),
    document.getElementById('computer2-funds'),
    document.getElementById('computer3-funds'),
    document.getElementById('computer4-funds'),
    document.getElementById('computer5-funds')
];
const playerStocksElement = document.getElementById('player-stocks');
const playerStockValueElement = document.getElementById('player-stock-value');
const playerProfitElement = document.getElementById('player-profit');
const playerProfitRateElement = document.getElementById('player-profit-rate');
const priceChartElement = document.getElementById('price-chart');
const buyButton = document.getElementById('buy-button');
const sellButton = document.getElementById('sell-button');
const stockAmountInput = document.getElementById('stock-amount');
const levelElement = document.getElementById('level');
const priceScaleElement = document.getElementById('price-scale');
const percentageScaleElement = document.getElementById('percentage-scale');
const realTimePriceElement = document.getElementById('real-time-price');
const challengeAttemptsElement = document.getElementById('challenge-attempts');
const nextRecoveryTimeElement = document.getElementById('next-recovery-time');
const additionalComputersElement = document.getElementById('additional-computers');
const watchAdButton = document.getElementById('watch-ad-button');
const followGongzhonghaoButton = document.getElementById('follow-gongzhonghao-button');
const inviteFriendButton = document.getElementById('invite-friend-button');

function updatePrice() {
    const change = (Math.random() - 0.5) * 10;
    stockPrice = Math.max(1, stockPrice + change);
    priceHistory.push(stockPrice);
    if (priceHistory.length > 100) {
        priceHistory.shift();
    }
    drawChart();
    updatePlayerStockValue();
    realTimePriceElement.textContent = stockPrice.toFixed(2);
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
    drawScales(minPrice, maxPrice);
}

function drawScales(minPrice, maxPrice) {
    priceScaleElement.innerHTML = '';
    percentageScaleElement.innerHTML = '';
    for (let i = 0; i <= 10; i++) {
        const price = minPrice + (i * (maxPrice - minPrice)) / 10;
        const percentage = ((price - stockPrice) / stockPrice) * 100;
        const priceLabel = document.createElement('div');
        priceLabel.textContent = price.toFixed(2);
        priceScaleElement.prepend(priceLabel);
        const percentageLabel = document.createElement('div');
        percentageLabel.textContent = percentage.toFixed(2) + '%';
        percentageScaleElement.prepend(percentageLabel);
    }
}

function computerTrade() {
    computerFunds.forEach((funds, index) => {
        const action = Math.random() > 0.5 ? 'buy' : 'sell';
        const amount = Math.floor(Math.random() * 1000);
        if (action === 'buy' && funds >= stockPrice * amount) {
            computerFunds[index] -= stockPrice * amount;
        } else if (action === 'sell' && funds + stockPrice * amount <= 5000000) {
            computerFunds[index] += stockPrice * amount;
        }
        computerFundsElements[index].textContent = computerFunds[index].toFixed(2);
    });
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
    playerFundsElement.textContent = playerFunds.toFixed(2);
    playerStocksElement.textContent = playerStocks;
    updatePlayerStockValue();
    checkGameOver();
}

function updatePlayerStockValue() {
    const stockValue = playerStocks * stockPrice;
    playerStockValueElement.textContent = stockValue.toFixed(2);
    const profit = stockValue + playerFunds - 5000000;
    playerProfitElement.textContent = profit.toFixed(2);
    const profitRate = (profit / 5000000) * 100;
    playerProfitRateElement.textContent = profitRate.toFixed(2) + '%';
}

function checkGameOver() {
    const totalValue = playerFunds + playerStocks * stockPrice;
    if (totalValue < 10000) {
        alert('电脑赢了！');
        challengeAttempts--;
        challengeAttemptsElement.textContent = challengeAttempts;
        if (challengeAttempts === 0) {
            nextRecoveryTime = new Date(Date.now() + 4 * 60 * 60 * 1000);
            updateRecoveryTime();
        }
        resetGame();
    } else if (computerFunds.some(funds => funds < 10000)) {
        alert('玩家赢了！');
        resetGame();
    } else if (totalValue >= 5000000 + levelGoals[level - 1]) {
        alert('玩家完成了当前关卡！');
        nextLevel();
    }
}

function nextLevel() {
    if (level === 1) {
        level = 2;
        computerFunds = [5000000, 5000000, 5000000, 5000000, 5000000];
        additionalComputersElement.style.display = 'block';
        levelElement.textContent = '高手对决';
        document.querySelector('.level-info').textContent = '关卡: 高手对决 - 目标: 盈利1000000块';
    }
    resetGame();
}

function resetGame() {
    playerFunds = 5000000;
    computerFunds = computerFunds.map(() => 5000000);
    playerStocks = 0;
    stockPrice = 100;
    priceHistory = [stockPrice];
    playerFundsElement.textContent = playerFunds.toFixed(2);
    computerFundsElements.forEach((element, index) => {
        element.textContent = computerFunds[index].toFixed(2);
    });
    playerStocksElement.textContent = playerStocks;
    playerStockValueElement.textContent = 0;
    playerProfitElement.textContent = 0;
    playerProfitRateElement.textContent = '0%';
    realTimePriceElement.textContent = stockPrice.toFixed(2);
    drawChart();
}

function updateRecoveryTime() {
    const now = new Date();
    const timeDiff = nextRecoveryTime - now;
    if (timeDiff > 0) {
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        nextRecoveryTimeElement.textContent = `${hours}:${minutes}:${seconds}`;
        setTimeout(updateRecoveryTime, 1000);
    } else {
        challengeAttempts++;
        challengeAttemptsElement.textContent = challengeAttempts;
        nextRecoveryTimeElement.textContent = '--:--:--';
    }
}

watchAdButton.addEventListener('click', () => {
    alert('观看30秒广告以增加一次挑战机会');
    setTimeout(() => {
        challengeAttempts++;
        challengeAttemptsElement.textContent = challengeAttempts;
    }, 30000);
});

followGongzhonghaoButton.addEventListener('click', () => {
    alert('关注GrandMiracle公众号以增加一次挑战机会');
    challengeAttempts++;
    challengeAttemptsElement.textContent = challengeAttempts;
});

inviteFriendButton.addEventListener('click', () => {
    alert('邀请好友关注GrandMiracle公众号以增加一次挑战机会');
    challengeAttempts++;
    challengeAttemptsElement.textContent = challengeAttempts;
});

buyButton.addEventListener('click', () => playerTrade('buy'));
sellButton.addEventListener('click', () => playerTrade('sell'));

setInterval(() => {
    updatePrice();
    computerTrade();
}, 1000);

drawChart();
updateRecoveryTime();
